import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Or } from 'typeorm';
import { Paciente } from './entidades/paciente.entidad';
import { CrearPacienteDto } from './dto/crear-paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar-paciente.dto';

@Injectable()
export class PacientesServicio {
  constructor(
    @InjectRepository(Paciente)
    private readonly paciente_repositorio: Repository<Paciente>,
  ) {}

  async crear(crear_paciente_dto: CrearPacienteDto): Promise<Paciente> {
    const nuevo_paciente = this.paciente_repositorio.create(crear_paciente_dto);
    return this.paciente_repositorio.save(nuevo_paciente);
  }

  async encontrarTodos(termino_busqueda?: string): Promise<Paciente[]> {
    if (termino_busqueda) {
      const id_busqueda = parseInt(termino_busqueda, 10);
      const where_conditions: any[] = [
        { nombre: ILike(`%${termino_busqueda}%`) },
        { apellidos: ILike(`%${termino_busqueda}%`) },
      ];
      if (!isNaN(id_busqueda)) {
        where_conditions.push({ id: id_busqueda });
      }
      return this.paciente_repositorio.find({ where: where_conditions });
    }
    return this.paciente_repositorio.find();
  }

  async encontrarPorId(id: number): Promise<Paciente> {
    const paciente = await this.paciente_repositorio.findOne({ 
      where: { id },
      relations: ['odontogramas', 'planes_tratamiento', 'planes_tratamiento.citas', 'planes_tratamiento.pagos'] 
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID "${id}" no encontrado.`);
    }
    return paciente;
  }

  async actualizar(id: number, actualizar_paciente_dto: ActualizarPacienteDto): Promise<Paciente> {
    const paciente = await this.paciente_repositorio.preload({
      id: id,
      ...actualizar_paciente_dto,
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID "${id}" no encontrado.`);
    }
    return this.paciente_repositorio.save(paciente);
  }

  async eliminar(id: number): Promise<void> {
    const resultado = await this.paciente_repositorio.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Paciente con ID "${id}" no encontrado.`);
    }
  }
}