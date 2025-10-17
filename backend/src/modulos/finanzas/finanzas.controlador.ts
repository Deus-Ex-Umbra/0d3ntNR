import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { FinanzasServicio } from './finanzas.servicio';
import { RegistrarEgresoDto } from './dto/registrar-egreso.dto';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../autenticacion/guardias/jwt-auth.guardia';

@ApiTags('Finanzas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finanzas')
export class FinanzasControlador {
  constructor(private readonly finanzas_servicio: FinanzasServicio) {}

  @Post('egresos')
  registrarEgreso(@Body() registrar_egreso_dto: RegistrarEgresoDto) {
    return this.finanzas_servicio.registrarEgreso(registrar_egreso_dto);
  }

  @Post('pagos')
  registrarPago(@Body() registrar_pago_dto: RegistrarPagoDto) {
    return this.finanzas_servicio.registrarPago(registrar_pago_dto);
  }

  @Get('reporte')
  @ApiQuery({ name: 'fecha_inicio', required: false, type: String })
  @ApiQuery({ name: 'fecha_fin', required: false, type: String })
  obtenerReporte(@Query('fecha_inicio') fecha_inicio?: string, @Query('fecha_fin') fecha_fin?: string) {
    return this.finanzas_servicio.generarReporte(fecha_inicio, fecha_fin);
  }
}