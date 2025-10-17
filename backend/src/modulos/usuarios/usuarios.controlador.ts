import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsuariosServicio } from './usuarios.servicio';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../autenticacion/guardias/jwt-auth.guardia';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosControlador {
  constructor(private readonly usuarios_servicio: UsuariosServicio) {}

  @Get('perfil')
  obtenerPerfil(@Request() req) {
    return this.usuarios_servicio.encontrarPorId(req.user.id);
  }

  @Put('perfil')
  actualizarPerfil(@Request() req, @Body() actualizar_usuario_dto: ActualizarUsuarioDto) {
    return this.usuarios_servicio.actualizar(req.user.id, actualizar_usuario_dto);
  }
}