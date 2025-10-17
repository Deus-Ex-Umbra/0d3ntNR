import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entidades/cita.entidad';
import { AgendaControlador } from './agenda.controlador';
import { AgendaServicio } from './agenda.servicio';

@Module({
  imports: [TypeOrmModule.forFeature([Cita])],
  controllers: [AgendaControlador],
  providers: [AgendaServicio],
  exports: [AgendaServicio],
})
export class AgendaModule {}