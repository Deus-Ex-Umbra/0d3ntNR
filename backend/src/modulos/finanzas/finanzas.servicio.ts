import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Egreso } from './entidades/egreso.entidad';
import { Pago } from './entidades/pago.entidad';
import { RegistrarEgresoDto } from './dto/registrar-egreso.dto';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { PlanesTratamientoServicio } from '../tratamientos/planes-tratamiento.servicio';
import { AgendaServicio } from '../agenda/agenda.servicio';

@Injectable()
export class FinanzasServicio {
  constructor(
    @InjectRepository(Egreso)
    private readonly egreso_repositorio: Repository<Egreso>,
    @InjectRepository(Pago)
    private readonly pago_repositorio: Repository<Pago>,
    private readonly planes_servicio: PlanesTratamientoServicio,
    private readonly agenda_servicio: AgendaServicio,
  ) {}

  async registrarEgreso(registrar_egreso_dto: RegistrarEgresoDto): Promise<Egreso> {
    const nuevo_egreso = this.egreso_repositorio.create({
      concepto: registrar_egreso_dto.concepto,
      fecha: registrar_egreso_dto.fecha,
      monto: registrar_egreso_dto.monto,
      cita: registrar_egreso_dto.cita_id ? { id: registrar_egreso_dto.cita_id } as any : null,
    });
    return this.egreso_repositorio.save(nuevo_egreso);
  }

  async registrarPago(registrar_pago_dto: RegistrarPagoDto): Promise<Pago> {
    const nuevo_pago = this.pago_repositorio.create({
      fecha: registrar_pago_dto.fecha,
      monto: registrar_pago_dto.monto,
      concepto: registrar_pago_dto.concepto || 'Pago de tratamiento',
      plan_tratamiento: registrar_pago_dto.plan_tratamiento_id ? { id: registrar_pago_dto.plan_tratamiento_id } as any : null,
      cita: registrar_pago_dto.cita_id ? { id: registrar_pago_dto.cita_id } as any : null,
    });
    
    if (registrar_pago_dto.plan_tratamiento_id) {
      await this.planes_servicio.registrarAbono(registrar_pago_dto.plan_tratamiento_id, registrar_pago_dto.monto);
    }

    if (registrar_pago_dto.cita_id) {
      await this.agenda_servicio.actualizar(registrar_pago_dto.cita_id, { estado_pago: 'pagado' });
    }
    
    return this.pago_repositorio.save(nuevo_pago);
  }

  async generarReporte(fecha_inicio_str?: string, fecha_fin_str?: string) {
    const fecha_inicio = fecha_inicio_str ? new Date(fecha_inicio_str) : new Date(0);
    const fecha_fin = fecha_fin_str ? new Date(fecha_fin_str) : new Date();

    const pagos = await this.pago_repositorio.find({ 
        where: { fecha: Between(fecha_inicio, fecha_fin) },
        relations: ['plan_tratamiento', 'plan_tratamiento.paciente', 'cita']
    });
    const egresos = await this.egreso_repositorio.find({ 
      where: { fecha: Between(fecha_inicio, fecha_fin) },
      relations: ['cita']
    });

    const total_ingresos = pagos.reduce((sum, pago) => sum + Number(pago.monto), 0);
    const total_egresos = egresos.reduce((sum, egreso) => sum + Number(egreso.monto), 0);
    const balance = total_ingresos - total_egresos;

    const movimientos = [
        ...pagos.map(p => ({ 
          tipo: 'ingreso' as const, 
          fecha: p.fecha, 
          monto: p.monto, 
          concepto: p.concepto || (p.plan_tratamiento ? `Pago de ${p.plan_tratamiento.paciente.nombre} ${p.plan_tratamiento.paciente.apellidos}` : 'Pago general'),
          cita_id: p.cita?.id
        })),
        ...egresos.map(e => ({ 
          tipo: 'egreso' as const, 
          fecha: e.fecha, 
          monto: e.monto, 
          concepto: e.concepto,
          cita_id: e.cita?.id
        }))
    ].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

    return {
        total_ingresos,
        total_egresos,
        balance,
        movimientos
    };
  }
}