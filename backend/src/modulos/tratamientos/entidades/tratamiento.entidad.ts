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
}