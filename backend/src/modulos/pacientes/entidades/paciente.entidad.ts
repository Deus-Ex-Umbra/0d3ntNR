import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Odontograma } from '../../odontograma/entidades/odontograma.entidad';
import { PlanTratamiento } from '../../tratamientos/entidades/plan-tratamiento.entidad';

@Entity()
export class Paciente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  correo: string;

  @Column({ nullable: true })
  direccion: string;
  
  @Column('text', { nullable: true })
  notas_generales: string;

  @Column('text', { nullable: true })
  alergias: string;

  @Column('text', { nullable: true })
  enfermedades: string;

  @Column('text', { nullable: true })
  medicamentos: string;

  @Column('text', { nullable: true })
  notas_medicas: string;

  @Column({ nullable: true })
  color_categoria: string;

  @OneToMany(() => Odontograma, (odontograma) => odontograma.paciente)
  odontogramas: Odontograma[];

  @OneToMany(() => PlanTratamiento, (plan) => plan.paciente)
  planes_tratamiento: PlanTratamiento[];
}