import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PlanTratamiento } from '../../tratamientos/entidades/plan-tratamiento.entidad';

@Entity()
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  fecha: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @ManyToOne(() => PlanTratamiento, (plan) => plan.pagos)
  plan_tratamiento: PlanTratamiento;
}