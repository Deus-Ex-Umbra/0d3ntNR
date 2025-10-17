import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { PacientesServicio } from './pacientes.servicio';
import { CrearPacienteDto } from './dto/crear-paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar-paciente.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../autenticacion/guardias/jwt-auth.guardia';

@ApiTags('Pacientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pacientes')
export class PacientesControlador {
  constructor(private readonly pacientes_servicio: PacientesServicio) {}

  @Post()
  crear(@Body() crear_paciente_dto: CrearPacienteDto) {
    return this.pacientes_servicio.crear(crear_paciente_dto);
  }

  @Get()
  @ApiQuery({ name: 'termino_busqueda', required: false, type: String, description: 'Filtra pacientes por nombre, apellidos o ID.' })
  encontrarTodos(@Query('termino_busqueda') termino_busqueda?: string) {
    return this.pacientes_servicio.encontrarTodos(termino_busqueda);
  }

  @Get(':id')
  encontrarUno(@Param('id') id: string) {
    return this.pacientes_servicio.encontrarPorId(+id);
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() actualizar_paciente_dto: ActualizarPacienteDto) {
    return this.pacientes_servicio.actualizar(+id, actualizar_paciente_dto);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.pacientes_servicio.eliminar(+id);
  }
}