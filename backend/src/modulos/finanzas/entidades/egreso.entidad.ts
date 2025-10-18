import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cita } from '../../agenda/entidades/cita.entidad';

@Entity()
export class Egreso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  concepto: string;

  @Column()
  fecha: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @ManyToOne(() => Cita, { nullable: true, onDelete: 'SET NULL' })
  cita: Cita;
}