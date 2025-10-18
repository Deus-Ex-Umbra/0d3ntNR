import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Egreso } from './entidades/egreso.entidad';
import { Pago } from './entidades/pago.entidad';
import { FinanzasControlador } from './finanzas.controlador';
import { FinanzasServicio } from './finanzas.servicio';
import { TratamientosModule } from '../tratamientos/tratamientos.modulo';
import { AgendaModule } from '../agenda/agenda.modulo';

@Module({
  imports: [TypeOrmModule.forFeature([Egreso, Pago]), TratamientosModule, AgendaModule],
  controllers: [FinanzasControlador],
  providers: [FinanzasServicio],
})
export class FinanzasModule {}