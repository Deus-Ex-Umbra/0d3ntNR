import { Controller, Get, Post, Delete, Param, Body, UseGuards, Put } from '@nestjs/common';
import { CatalogoServicio } from './catalogo.servicio';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../autenticacion/guardias/jwt-auth.guardia';
import { CrearAlergiaDto } from './dto/crear-alergia.dto';
import { CrearEnfermedadDto } from './dto/crear-enfermedad.dto';
import { CrearMedicamentoDto } from './dto/crear-medicamento.dto';
import { CrearColorCategoriaDto } from './dto/crear-color-categoria.dto';

@ApiTags('Catálogo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('catalogo')
export class CatalogoControlador {
  constructor(private readonly catalogo_servicio: CatalogoServicio) {}

  @Post('alergias')
  crearAlergia(@Body() dto: CrearAlergiaDto) {
    return this.catalogo_servicio.crearAlergia(dto);
  }

  @Get('alergias')
  obtenerAlergias() {
    return this.catalogo_servicio.obtenerAlergias();
  }

  @Delete('alergias/:id')
  eliminarAlergia(@Param('id') id: string) {
    return this.catalogo_servicio.eliminarAlergia(+id);
  }

  @Post('enfermedades')
  crearEnfermedad(@Body() dto: CrearEnfermedadDto) {
    return this.catalogo_servicio.crearEnfermedad(dto);
  }

  @Get('enfermedades')
  obtenerEnfermedades() {
    return this.catalogo_servicio.obtenerEnfermedades();
  }

  @Delete('enfermedades/:id')
  eliminarEnfermedad(@Param('id') id: string) {
    return this.catalogo_servicio.eliminarEnfermedad(+id);
  }

  @Post('medicamentos')
  crearMedicamento(@Body() dto: CrearMedicamentoDto) {
    return this.catalogo_servicio.crearMedicamento(dto);
  }

  @Get('medicamentos')
  obtenerMedicamentos() {
    return this.catalogo_servicio.obtenerMedicamentos();
  }

  @Delete('medicamentos/:id')
  eliminarMedicamento(@Param('id') id: string) {
    return this.catalogo_servicio.eliminarMedicamento(+id);
  }

  @Post('colores')
  crearColor(@Body() dto: CrearColorCategoriaDto) {
    return this.catalogo_servicio.crearColor(dto);
  }

  @Get('colores')
  obtenerColores() {
    return this.catalogo_servicio.obtenerColores();
  }

  @Put('colores/:id')
  actualizarColor(@Param('id') id: string, @Body() dto: Partial<CrearColorCategoriaDto>) {
    return this.catalogo_servicio.actualizarColor(+id, dto);
  }

  @Delete('colores/:id')
  eliminarColor(@Param('id') id: string) {
    return this.catalogo_servicio.eliminarColor(+id);
  }
}