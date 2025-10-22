import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Egreso } from './entidades/egreso.entidad';
import { Pago } from './entidades/pago.entidad';
import { FinanzasControlador } from './finanzas.controlador';
import { FinanzasServicio } from './finanzas.servicio';
import { TratamientosModule } from '../tratamientos/tratamientos.modulo';

@Module({
  imports: [
    TypeOrmModule.forFeature([Egreso, Pago]),
    forwardRef(() => TratamientosModule),
  ],
  controllers: [FinanzasControlador],
  providers: [FinanzasServicio],
  exports: [FinanzasServicio],
})
export class FinanzasModule {}