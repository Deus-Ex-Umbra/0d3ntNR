import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Paciente } from '../../pacientes/entidades/paciente.entidad';
import { PlanTratamiento } from '../../tratamientos/entidades/plan-tratamiento.entidad';

@Entity()
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

  @Column()
  descripcion: string;

  @ManyToOne(() => Paciente, { nullable: true, onDelete: 'SET NULL' })
  paciente: Paciente;

  @ManyToOne(() => PlanTratamiento, (plan) => plan.citas, { nullable: true, onDelete: 'CASCADE' })
  plan_tratamiento: PlanTratamiento;
}