import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tratamiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  numero_citas: number;

  @Column('decimal', { precision: 10, scale: 2 })
  costo_total: number;

  @Column({ default: 0 })
  intervalo_dias: number;

  @Column({ default: 0 })
  intervalo_semanas: number;

  @Column({ default: 0 })
  intervalo_meses: number;
}