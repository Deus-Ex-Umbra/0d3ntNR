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

  @Column({ default: 'pendiente' })
  estado_pago: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  monto_esperado: number;

  @ManyToOne(() => Paciente, { nullable: true, onDelete: 'SET NULL' })
  paciente: Paciente;

  @ManyToOne(() => PlanTratamiento, (plan) => plan.citas, { nullable: true, onDelete: 'CASCADE' })
  plan_tratamiento: PlanTratamiento;
}