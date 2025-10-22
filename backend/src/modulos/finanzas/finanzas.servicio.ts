import { Injectable, Inject, forwardRef, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Egreso } from './entidades/egreso.entidad';
import { Pago } from './entidades/pago.entidad';
import { RegistrarEgresoDto } from './dto/registrar-egreso.dto';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { ActualizarPagoDto } from './dto/actualizar-pago.dto';
import { ActualizarEgresoDto } from './dto/actualizar-egreso.dto';
import { PlanesTratamientoServicio } from '../tratamientos/planes-tratamiento.servicio';
import { AgendaServicio } from '../agenda/agenda.servicio';
import { Cita } from '../agenda/entidades/cita.entidad';

@Injectable()
export class FinanzasServicio {
  constructor(
    @InjectRepository(Egreso)
    private readonly egreso_repositorio: Repository<Egreso>,
    @InjectRepository(Pago)
    private readonly pago_repositorio: Repository<Pago>,
    @InjectRepository(Cita)
    private readonly cita_repositorio: Repository<Cita>,
    @Inject(forwardRef(() => PlanesTratamientoServicio))
    private readonly planes_servicio: PlanesTratamientoServicio,
    @Inject(forwardRef(() => AgendaServicio))
    private readonly agenda_servicio: AgendaServicio,
  ) {}

  async registrarEgreso(registrar_egreso_dto: RegistrarEgresoDto): Promise<Egreso> {
    if (registrar_egreso_dto.cita_id) {
      const cita = await this.cita_repositorio.findOne({
        where: { id: registrar_egreso_dto.cita_id },
        relations: ['plan_tratamiento'],
      });

      if (!cita) {
        throw new NotFoundException('La cita especificada no existe');
      }

      if (cita.plan_tratamiento) {
        throw new BadRequestException(
          'No se puede asociar un egreso a una cita que está vinculada a un plan de tratamiento'
        );
      }

      await this.cita_repositorio.update(cita.id, { estado_pago: 'cancelado' });
    }

    const nuevo_egreso = this.egreso_repositorio.create({
      concepto: registrar_egreso_dto.concepto,
      fecha: registrar_egreso_dto.fecha,
      monto: registrar_egreso_dto.monto,
      cita: registrar_egreso_dto.cita_id ? { id: registrar_egreso_dto.cita_id } as any : null,
    });

    return this.egreso_repositorio.save(nuevo_egreso);
  }

  async actualizarEgreso(id: number, actualizar_egreso_dto: ActualizarEgresoDto): Promise<Egreso> {
    const egreso_existente = await this.egreso_repositorio.findOne({
      where: { id },
      relations: ['cita', 'cita.plan_tratamiento'],
    });

    if (!egreso_existente) {
      throw new NotFoundException('El egreso especificado no existe');
    }

    if (actualizar_egreso_dto.cita_id !== undefined) {
      if (actualizar_egreso_dto.cita_id) {
        const cita = await this.cita_repositorio.findOne({
          where: { id: actualizar_egreso_dto.cita_id },
          relations: ['plan_tratamiento'],
        });

        if (!cita) {
          throw new NotFoundException('La cita especificada no existe');
        }

        if (cita.plan_tratamiento) {
          throw new BadRequestException(
            'No se puede asociar un egreso a una cita que está vinculada a un plan de tratamiento'
          );
        }

        if (egreso_existente.cita && egreso_existente.cita.id !== actualizar_egreso_dto.cita_id) {
          await this.cita_repositorio.update(egreso_existente.cita.id, { estado_pago: 'pendiente' });
        }

        await this.cita_repositorio.update(cita.id, { estado_pago: 'cancelado' });
      } else if (egreso_existente.cita) {
        await this.cita_repositorio.update(egreso_existente.cita.id, { estado_pago: 'pendiente' });
      }
    }

    const datos_actualizacion: any = {};
    if (actualizar_egreso_dto.concepto !== undefined) {
      datos_actualizacion.concepto = actualizar_egreso_dto.concepto;
    }
    if (actualizar_egreso_dto.fecha !== undefined) {
      datos_actualizacion.fecha = actualizar_egreso_dto.fecha;
    }
    if (actualizar_egreso_dto.monto !== undefined) {
      datos_actualizacion.monto = actualizar_egreso_dto.monto;
    }
    if (actualizar_egreso_dto.cita_id !== undefined) {
      datos_actualizacion.cita = actualizar_egreso_dto.cita_id
        ? { id: actualizar_egreso_dto.cita_id }
        : null;
    }

    await this.egreso_repositorio.update(id, datos_actualizacion);

    const updatedEgreso = await this.egreso_repositorio.findOne({
      where: { id },
      relations: ['cita'],
    });

    if (!updatedEgreso) {
      throw new Error('Unexpected error: Updated egreso not found');
    }

    return updatedEgreso;
  }

  async eliminarEgreso(id: number): Promise<void> {
    const egreso = await this.egreso_repositorio.findOne({
      where: { id },
      relations: ['cita'],
    });

    if (!egreso) {
      throw new NotFoundException('El egreso especificado no existe');
    }

    if (egreso.cita) {
      await this.cita_repositorio.update(egreso.cita.id, { estado_pago: 'pendiente' });
    }

    await this.egreso_repositorio.remove(egreso);
  }

  async registrarPago(registrar_pago_dto: RegistrarPagoDto): Promise<Pago> {
    if (registrar_pago_dto.cita_id) {
      const cita = await this.cita_repositorio.findOne({
        where: { id: registrar_pago_dto.cita_id },
        relations: ['plan_tratamiento'],
      });

      if (!cita) {
        throw new NotFoundException('La cita especificada no existe');
      }

      const pago_existente = await this.pago_repositorio.findOne({
        where: { cita: { id: registrar_pago_dto.cita_id } },
      });

      if (pago_existente) {
        throw new ConflictException('Esta cita ya tiene un pago asociado');
      }

      await this.cita_repositorio.update(cita.id, { estado_pago: 'pagado' });

      if (!registrar_pago_dto.plan_tratamiento_id && cita.plan_tratamiento) {
        registrar_pago_dto.plan_tratamiento_id = cita.plan_tratamiento.id;
      }
    }

    const nuevo_pago = this.pago_repositorio.create({
      fecha: registrar_pago_dto.fecha,
      monto: registrar_pago_dto.monto,
      concepto: registrar_pago_dto.concepto || 'Pago de tratamiento',
      plan_tratamiento: registrar_pago_dto.plan_tratamiento_id
        ? { id: registrar_pago_dto.plan_tratamiento_id } as any
        : null,
      cita: registrar_pago_dto.cita_id ? { id: registrar_pago_dto.cita_id } as any : null,
    });

    const pago_guardado = await this.pago_repositorio.save(nuevo_pago);

    if (registrar_pago_dto.plan_tratamiento_id) {
      await this.planes_servicio.registrarAbono(
        registrar_pago_dto.plan_tratamiento_id,
        registrar_pago_dto.monto
      );
    }

    return pago_guardado;
  }

  async actualizarPago(id: number, actualizar_pago_dto: ActualizarPagoDto): Promise<Pago> {
    const pago_existente = await this.pago_repositorio.findOne({
      where: { id },
      relations: ['plan_tratamiento', 'cita'],
    });

    if (!pago_existente) {
      throw new NotFoundException('El pago especificado no existe');
    }

    const monto_anterior = Number(pago_existente.monto);
    const monto_nuevo = actualizar_pago_dto.monto
      ? Number(actualizar_pago_dto.monto)
      : monto_anterior;

    if (pago_existente.plan_tratamiento && monto_nuevo !== monto_anterior) {
      await this.planes_servicio.descontarAbono(pago_existente.plan_tratamiento.id, monto_anterior);
      await this.planes_servicio.registrarAbono(pago_existente.plan_tratamiento.id, monto_nuevo);
    }

    const datos_actualizacion: any = {};
    if (actualizar_pago_dto.fecha !== undefined) {
      datos_actualizacion.fecha = actualizar_pago_dto.fecha;
    }
    if (actualizar_pago_dto.monto !== undefined) {
      datos_actualizacion.monto = actualizar_pago_dto.monto;
    }
    if (actualizar_pago_dto.concepto !== undefined) {
      datos_actualizacion.concepto = actualizar_pago_dto.concepto;
    }

    await this.pago_repositorio.update(id, datos_actualizacion);

    const updatedPago = await this.pago_repositorio.findOne({
      where: { id },
      relations: ['plan_tratamiento', 'cita'],
    });

    if (!updatedPago) {
      throw new Error('Unexpected error: Updated pago not found');
    }

    return updatedPago;
  }

  async eliminarPago(id: number): Promise<void> {
    const pago = await this.pago_repositorio.findOne({
      where: { id },
      relations: ['plan_tratamiento', 'cita'],
    });

    if (!pago) {
      throw new NotFoundException('El pago especificado no existe');
    }

    if (pago.plan_tratamiento) {
      await this.planes_servicio.descontarAbono(pago.plan_tratamiento.id, Number(pago.monto));
    }

    if (pago.cita) {
      await this.cita_repositorio.update(pago.cita.id, { estado_pago: 'pendiente' });
    }

    await this.pago_repositorio.remove(pago);
  }

  async eliminarPagosPorCita(cita_id: number): Promise<{ pagos_eliminados: number; monto_total: number }> {
    const pagos = await this.pago_repositorio.find({
      where: { cita: { id: cita_id } },
      relations: ['plan_tratamiento'],
    });

    const monto_total = pagos.reduce((sum, pago) => sum + Number(pago.monto), 0);

    for (const pago of pagos) {
      if (pago.plan_tratamiento) {
        await this.planes_servicio.descontarAbono(pago.plan_tratamiento.id, Number(pago.monto));
      }
      await this.pago_repositorio.remove(pago);
    }

    return {
      pagos_eliminados: pagos.length,
      monto_total,
    };
  }

  async generarReporte(fecha_inicio_str?: string, fecha_fin_str?: string) {
    const fecha_inicio = fecha_inicio_str ? new Date(fecha_inicio_str) : new Date(0);
    const fecha_fin = fecha_fin_str ? new Date(fecha_fin_str) : new Date();
    fecha_fin.setHours(23, 59, 59, 999);

    const pagos = await this.pago_repositorio.find({
      where: { fecha: Between(fecha_inicio, fecha_fin) },
      relations: ['plan_tratamiento', 'plan_tratamiento.paciente', 'cita'],
    });
    const egresos = await this.egreso_repositorio.find({
      where: { fecha: Between(fecha_inicio, fecha_fin) },
      relations: ['cita'],
    });

    const total_ingresos = pagos.reduce((sum, p) => sum + Number(p.monto), 0);
    const total_egresos = egresos.reduce((sum, e) => sum + Number(e.monto), 0);
    const balance = total_ingresos - total_egresos;

    const movimientos = [
      ...pagos.map((p) => ({
        id: p.id,
        tipo: 'ingreso' as const,
        fecha: p.fecha,
        monto: Number(p.monto),
        concepto:
          p.concepto ||
          (p.plan_tratamiento?.paciente
            ? `Pago de ${p.plan_tratamiento.paciente.nombre} ${p.plan_tratamiento.paciente.apellidos}`
            : 'Pago general'),
        cita_id: p.cita?.id,
        plan_tratamiento_id: p.plan_tratamiento?.id,
      })),
      ...egresos.map((e) => ({
        id: e.id,
        tipo: 'egreso' as const,
        fecha: e.fecha,
        monto: Number(e.monto),
        concepto: e.concepto,
        cita_id: e.cita?.id,
      })),
    ].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

    return {
      total_ingresos,
      total_egresos,
      balance,
      movimientos,
    };
  }
}