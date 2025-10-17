import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppControlador } from './app.controlador';
import { AppServicio } from './app.servicio';
import { PacientesModule } from './modulos/pacientes/pacientes.modulo';
import { OdontogramaModule } from './modulos/odontograma/odontograma.modulo';
import { TratamientosModule } from './modulos/tratamientos/tratamientos.modulo';
import { AgendaModule } from './modulos/agenda/agenda.modulo';
import { FinanzasModule } from './modulos/finanzas/finanzas.modulo';
import { AutenticacionModule } from './modulos/autenticacion/autenticacion.modulo';
import { UsuariosModule } from './modulos/usuarios/usuarios.modulo';
import { GeminiModule } from './modulos/gemini/gemini.modulo';
import { NotasModule } from './modulos/notas/notas.modulo';
import { AsistenteModule } from './modulos/asistente/asistente.modulo';
import { Paciente } from './modulos/pacientes/entidades/paciente.entidad';
import { Odontograma } from './modulos/odontograma/entidades/odontograma.entidad';
import { Tratamiento } from './modulos/tratamientos/entidades/tratamiento.entidad';
import { PlanTratamiento } from './modulos/tratamientos/entidades/plan-tratamiento.entidad';
import { Cita } from './modulos/agenda/entidades/cita.entidad';
import { Egreso } from './modulos/finanzas/entidades/egreso.entidad';
import { Usuario } from './modulos/usuarios/entidades/usuario.entidad';
import { NotaDiaria } from './modulos/notas/entidades/nota-diaria.entidad';
import { Pago } from './modulos/finanzas/entidades/pago.entidad';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [
        Paciente,
        Odontograma,
        Tratamiento,
        PlanTratamiento,
        Cita,
        Egreso,
        Usuario,
        NotaDiaria,
        Pago,
      ],
      synchronize: true,
    }),
    PacientesModule,
    OdontogramaModule,
    TratamientosModule,
    AgendaModule,
    FinanzasModule,
    AutenticacionModule,
    UsuariosModule,
    GeminiModule,
    NotasModule,
    AsistenteModule,
  ],
  controllers: [AppControlador],
  providers: [AppServicio],
})
export class AppModule {}