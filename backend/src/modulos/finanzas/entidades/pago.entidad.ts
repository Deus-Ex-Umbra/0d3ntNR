import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PlanTratamiento } from '../../tratamientos/entidades/plan-tratamiento.entidad';
import { Cita } from '../../agenda/entidades/cita.entidad';

@Entity()
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  fecha: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ nullable: true })
  concepto: string;

  @ManyToOne(() => PlanTratamiento, (plan) => plan.pagos, { nullable: true, onDelete: 'CASCADE' })
  plan_tratamiento: PlanTratamiento;

  @ManyToOne(() => Cita, { nullable: false, onDelete: 'CASCADE' })
  cita: Cita;
}