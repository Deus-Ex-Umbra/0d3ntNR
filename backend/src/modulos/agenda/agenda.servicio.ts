import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Cita } from './entidades/cita.entidad';
import { CrearCitaDto } from './dto/crear-cita.dto';
import { ActualizarCitaDto } from './dto/actualizar-cita.dto';
import { Paciente } from '../pacientes/entidades/paciente.entidad';
import { PlanTratamiento } from '../tratamientos/entidades/plan-tratamiento.entidad';
import { FinanzasServicio } from '../finanzas/finanzas.servicio';

@Injectable()
export class AgendaServicio {
  constructor(
    @InjectRepository(Cita)
    private readonly cita_repositorio: Repository<Cita>,
    private readonly finanzas_servicio: FinanzasServicio,
  ) {}

  async crear(crear_cita_dto: CrearCitaDto): Promise<Cita> {
    const { paciente_id, plan_tratamiento_id, ...cita_data } = crear_cita_dto;
    const nueva_cita = this.cita_repositorio.create(cita_data);

    if (paciente_id) {
      nueva_cita.paciente = { id: paciente_id } as Paciente;
    }
    if (plan_tratamiento_id) {
      nueva_cita.plan_tratamiento = { id: plan_tratamiento_id } as PlanTratamiento;
    }

    return this.cita_repositorio.save(nueva_cita);
  }

  async obtenerCitasPorMes(mes: number, ano: number): Promise<Cita[]> {
    const primer_dia = new Date(ano, mes - 1, 1);
    const ultimo_dia = new Date(ano, mes, 0, 23, 59, 59);

    const where_condition: FindOptionsWhere<Cita> = {
        fecha: Between(primer_dia, ultimo_dia)
    };

    return this.cita_repositorio.find({
        where: where_condition,
        relations: ['paciente', 'plan_tratamiento', 'plan_tratamiento.paciente'],
        order: { fecha: 'ASC' }
    });
  }

  async actualizar(id: number, actualizar_cita_dto: ActualizarCitaDto): Promise<Cita> {
    const cita_actual = await this.cita_repositorio.findOne({
      where: { id },
      relations: ['plan_tratamiento', 'paciente'],
    });

    if (!cita_actual) {
      throw new NotFoundException(`Cita con ID "${id}" no encontrada.`);
    }

    const estado_anterior = cita_actual.estado_pago;
    const datos_actualizar: Partial<Cita> = { ...actualizar_cita_dto };

    if (actualizar_cita_dto.paciente_id !== undefined) {
      datos_actualizar.paciente = actualizar_cita_dto.paciente_id ? { id: actualizar_cita_dto.paciente_id } as Paciente : undefined;
    }
    if (actualizar_cita_dto.plan_tratamiento_id !== undefined) {
      datos_actualizar.plan_tratamiento = actualizar_cita_dto.plan_tratamiento_id ? { id: actualizar_cita_dto.plan_tratamiento_id } as PlanTratamiento : undefined;
    }

    const cita = await this.cita_repositorio.preload({
      id,
      ...datos_actualizar
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID "${id}" no encontrada.`);
    }

    const cita_guardada = await this.cita_repositorio.save(cita);

    const nuevo_estado = actualizar_cita_dto.estado_pago || estado_anterior;
    const cambio_a_pagado = estado_anterior !== 'pagado' && nuevo_estado === 'pagado';
    const cambio_desde_pagado = estado_anterior === 'pagado' && nuevo_estado !== 'pagado';
    const tiene_plan_tratamiento = cita_actual.plan_tratamiento && cita_actual.plan_tratamiento.id;
    const tiene_monto = cita_guardada.monto_esperado && cita_guardada.monto_esperado > 0;

    if (cambio_a_pagado && tiene_plan_tratamiento && tiene_monto) {
      await this.finanzas_servicio.registrarPago({
        plan_tratamiento_id: cita_actual.plan_tratamiento.id,
        cita_id: id,
        fecha: new Date(),
        monto: Number(cita_guardada.monto_esperado),
        concepto: `Pago automático de cita: ${cita_guardada.descripcion}`,
      });
    }

    if (cambio_desde_pagado && tiene_plan_tratamiento) {
      await this.finanzas_servicio.eliminarPagosPorCita(id);
    }

    const cita_actualizada = await this.cita_repositorio.findOne({
      where: { id },
      relations: ['paciente', 'plan_tratamiento', 'plan_tratamiento.paciente'],
    });

    if (!cita_actualizada) {
      throw new NotFoundException(`Cita con ID "${id}" no encontrada después de actualizar.`);
    }

    return cita_actualizada;
  }

  async eliminar(id: number): Promise<void> {
    const resultado = await this.cita_repositorio.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Cita con ID "${id}" no encontrada.`);
    }
  }
}