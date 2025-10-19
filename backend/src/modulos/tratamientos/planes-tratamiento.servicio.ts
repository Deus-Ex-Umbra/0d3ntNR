import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanTratamiento } from './entidades/plan-tratamiento.entidad';
import { AsignarPlanTratamientoDto } from './dto/asignar-plan-tratamiento.dto';
import { PacientesServicio } from '../pacientes/pacientes.servicio';
import { TratamientosServicio } from './tratamientos.servicio';
import { AgendaServicio } from '../agenda/agenda.servicio';
import { Cita } from '../agenda/entidades/cita.entidad';

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

    const fecha_actual = new Date(fecha_inicio);
    fecha_actual.setUTCHours(0, 0, 0, 0);
    const citas_promesas: Promise<Cita>[] = [];
    for (let i = 0; i < tratamiento_plantilla.numero_citas; i++) {
        const fecha_cita = new Date(fecha_actual);
        fecha_cita.setDate(fecha_cita.getDate() + i * 7);
        citas_promesas.push(
            this.agenda_servicio.crear({
                paciente_id: paciente.id,
                plan_tratamiento_id: plan_guardado.id,
                fecha: fecha_cita,
                descripcion: `${tratamiento_plantilla.nombre} - Cita ${i + 1}`,
                estado_pago: 'pendiente',
            })
        );
    }
    await Promise.all(citas_promesas);

    return this.encontrarPlanPorId(plan_guardado.id);
  }

  async obtenerTodos(): Promise<PlanTratamiento[]> {
    return this.plan_repositorio.find({
      relations: ['paciente', 'tratamiento', 'citas', 'pagos'],
      order: { id: 'DESC' },
    });
  }

  async encontrarPlanPorId(id: number): Promise<PlanTratamiento> {
    const plan = await this.plan_repositorio.findOne({
      where: { id },
      relations: ['paciente', 'tratamiento', 'citas', 'pagos']
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
      order: { id: 'DESC' },
    });
  }

  async registrarAbono(plan_id: number, monto: number): Promise<PlanTratamiento> {
    const plan = await this.encontrarPlanPorId(plan_id);
    plan.total_abonado = Number(plan.total_abonado) + Number(monto);
    return this.plan_repositorio.save(plan);
  }
}