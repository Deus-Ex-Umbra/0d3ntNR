import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Cita } from './entidades/cita.entidad';
import { CrearCitaDto } from './dto/crear-cita.dto';
import { ActualizarCitaDto } from './dto/actualizar-cita.dto';
import { Paciente } from '../pacientes/entidades/paciente.entidad';
import { PlanTratamiento } from '../tratamientos/entidades/plan-tratamiento.entidad';

@Injectable()
export class AgendaServicio {
  constructor(
    @InjectRepository(Cita)
    private readonly cita_repositorio: Repository<Cita>,
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
        relations: ['paciente'],
        order: { fecha: 'ASC' }
    });
  }

  async actualizar(id: number, actualizar_cita_dto: ActualizarCitaDto): Promise<Cita> {
    const datos_actualizar: Partial<Cita> = { ...actualizar_cita_dto };

    if (actualizar_cita_dto.paciente_id !== undefined) {
      datos_actualizar.paciente = { id: actualizar_cita_dto.paciente_id } as Paciente;
    }
     if (actualizar_cita_dto.plan_tratamiento_id !== undefined) {
      datos_actualizar.plan_tratamiento = { id: actualizar_cita_dto.plan_tratamiento_id } as PlanTratamiento;
    }

    const cita = await this.cita_repositorio.preload({
      id,
      ...datos_actualizar
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID "${id}" no encontrada.`);
    }
    return this.cita_repositorio.save(cita);
  }

  async eliminar(id: number): Promise<void> {
    const resultado = await this.cita_repositorio.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Cita con ID "${id}" no encontrada.`);
    }
  }
}