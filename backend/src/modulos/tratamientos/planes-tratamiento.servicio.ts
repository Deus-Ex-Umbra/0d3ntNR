import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanTratamiento } from './entidades/plan-tratamiento.entidad';
import { AsignarPlanTratamientoDto } from './dto/asignar-plan-tratamiento.dto';
import { PacientesServicio } from '../pacientes/pacientes.servicio';
import { TratamientosServicio } from './tratamientos.servicio';
import { AgendaServicio } from '../agenda/agenda.servicio';

@Injectable()
export class PlanesTratamientoServicio {
  constructor(
    @InjectRepository(PlanTratamiento)
    private readonly plan_repositorio: Repository<PlanTratamiento>,
    private readonly pacientes_servicio: PacientesServicio,
    private readonly tratamientos_servicio: TratamientosServicio,
    private readonly agenda_servicio: AgendaServicio,
  ) {}

  async asignarPlan(asignar_plan_dto: AsignarPlanTratamientoDto): Promise<PlanTratamiento> {
    const { paciente_id, tratamiento_id, fecha_inicio } = asignar_plan_dto;
    const paciente = await this.pacientes_servicio.encontrarPorId(paciente_id);
    const tratamiento_plantilla = await this.tratamientos_servicio.encontrarPorId(tratamiento_id);

    const nuevo_plan = this.plan_repositorio.create({
      paciente,
      tratamiento: tratamiento_plantilla,
      costo_total: tratamiento_plantilla.costo_total,
      total_abonado: 0,
    });
    
    const plan_guardado = await this.plan_repositorio.save(nuevo_plan);

    // Generar citas
    const fecha_actual = new Date(fecha_inicio);
    for (let i = 0; i < tratamiento_plantilla.numero_citas; i++) {
      await this.agenda_servicio.crear({
        paciente_id: paciente.id,
        plan_tratamiento_id: plan_guardado.id,
        fecha: new Date(fecha_actual),
        descripcion: `${tratamiento_plantilla.nombre} - Cita ${i + 1}`,
      });
      fecha_actual.setDate(fecha_actual.getDate() + 7); // Asume frecuencia semanal
    }

    return this.encontrarPlanPorId(plan_guardado.id);
  }
  
  async encontrarPlanPorId(id: number): Promise<PlanTratamiento> {
    const plan = await this.plan_repositorio.findOne({
      where: { id },
      relations: ['citas', 'pagos']
    });
    if (!plan) {
        throw new NotFoundException(`Plan de tratamiento con ID "${id}" no encontrado.`);
    }
    return plan;
  }

  async obtenerPlanesPorPaciente(paciente_id: number): Promise<PlanTratamiento[]> {
    return this.plan_repositorio.find({
      where: { paciente: { id: paciente_id } },
      relations: ['tratamiento', 'citas', 'pagos'],
    });
  }

  async registrarAbono(plan_id: number, monto: number): Promise<PlanTratamiento> {
    const plan = await this.encontrarPlanPorId(plan_id);
    plan.total_abonado += monto;
    return this.plan_repositorio.save(plan);
  }
}