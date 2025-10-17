import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Paciente } from '../../pacientes/entidades/paciente.entidad';

@Entity()
export class Odontograma {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente, (paciente) => paciente.odontogramas, { onDelete: 'CASCADE' })
  paciente: Paciente;

  @Column('simple-json')
  datos: object;

  @CreateDateColumn()
  fecha_creacion: Date;
}