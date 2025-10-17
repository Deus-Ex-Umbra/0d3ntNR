import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Egreso } from './entidades/egreso.entidad';
import { Pago } from './entidades/pago.entidad';
import { RegistrarEgresoDto } from './dto/registrar-egreso.dto';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { PlanesTratamientoServicio } from '../tratamientos/planes-tratamiento.servicio';

@Injectable()
export class FinanzasServicio {
  constructor(
    @InjectRepository(Egreso)
    private readonly egreso_repositorio: Repository<Egreso>,
    @InjectRepository(Pago)
    private readonly pago_repositorio: Repository<Pago>,
    private readonly planes_servicio: PlanesTratamientoServicio,
  ) {}

  async registrarEgreso(registrar_egreso_dto: RegistrarEgresoDto): Promise<Egreso> {
    const nuevo_egreso = this.egreso_repositorio.create(registrar_egreso_dto);
    return this.egreso_repositorio.save(nuevo_egreso);
  }

  async registrarPago(registrar_pago_dto: RegistrarPagoDto): Promise<Pago> {
    const plan = await this.planes_servicio.encontrarPlanPorId(registrar_pago_dto.plan_tratamiento_id);
    
    const nuevo_pago = this.pago_repositorio.create({
        ...registrar_pago_dto,
        plan_tratamiento: plan,
    });
    
    await this.planes_servicio.registrarAbono(plan.id, registrar_pago_dto.monto);
    
    return this.pago_repositorio.save(nuevo_pago);
  }

  async generarReporte(fecha_inicio_str?: string, fecha_fin_str?: string) {
    const fecha_inicio = fecha_inicio_str ? new Date(fecha_inicio_str) : new Date(0);
    const fecha_fin = fecha_fin_str ? new Date(fecha_fin_str) : new Date();

    const pagos = await this.pago_repositorio.find({ 
        where: { fecha: Between(fecha_inicio, fecha_fin) },
        relations: ['plan_tratamiento', 'plan_tratamiento.paciente']
    });
    const egresos = await this.egreso_repositorio.find({ where: { fecha: Between(fecha_inicio, fecha_fin) } });

    const total_ingresos = pagos.reduce((sum, pago) => sum + Number(pago.monto), 0);
    const total_egresos = egresos.reduce((sum, egreso) => sum + Number(egreso.monto), 0);
    const balance = total_ingresos - total_egresos;

    const movimientos = [
        ...pagos.map(p => ({ tipo: 'ingreso', fecha: p.fecha, monto: p.monto, concepto: `Pago de ${p.plan_tratamiento.paciente.nombre} ${p.plan_tratamiento.paciente.apellidos}` })),
        ...egresos.map(e => ({ tipo: 'egreso', fecha: e.fecha, monto: e.monto, concepto: e.concepto }))
    ].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

    return {
        total_ingresos,
        total_egresos,
        balance,
        movimientos
    };
  }
}