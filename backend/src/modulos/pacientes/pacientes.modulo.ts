import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entidades/paciente.entidad';
import { PacientesControlador } from './pacientes.controlador';
import { PacientesServicio } from './pacientes.servicio';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente])],
  controllers: [PacientesControlador],
  providers: [PacientesServicio],
  exports: [PacientesServicio],
})
export class PacientesModule {}