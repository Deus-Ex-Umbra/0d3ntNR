import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AutenticacionServicio } from './autenticacion.servicio';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guardias/local-auth.guardia';
import { InicioSesionDto } from './dto/inicio-sesion.dto';

@ApiTags('Autenticación')
@Controller('autenticacion')
export class AutenticacionControlador {
  constructor(private readonly autenticacion_servicio: AutenticacionServicio) {}

  @Post('registro')
  async registrar(@Body() registro_usuario_dto: RegistroUsuarioDto) {
    return this.autenticacion_servicio.registrar(registro_usuario_dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('inicio-sesion')
  async iniciarSesion(@Request() req, @Body() inicio_sesion_dto: InicioSesionDto) {
    return this.autenticacion_servicio.iniciarSesion(req.user);
  }
}