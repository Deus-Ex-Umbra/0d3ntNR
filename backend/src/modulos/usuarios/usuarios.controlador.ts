import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsuariosServicio } from './usuarios.servicio';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../autenticacion/guardias/jwt-auth.guardia';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@ApiTags('Usuarios')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosControlador {
  constructor(private readonly usuarios_servicio: UsuariosServicio) {}

  @Get('perfil')
  @ApiOperation({
    summary: 'Obtener perfil del usuario actual',
    description: 'Retorna la información del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
    schema: {
      example: {
        id: 1,
        nombre: 'Dr. Juan Pérez',
        correo: 'juan@ejemplo.com',
        avatar: null,
      },
    },
  })
  obtenerPerfil(@Request() req) {
    return this.usuarios_servicio.encontrarPorId(req.user.id);
  }

  @Put('perfil')
  @ApiOperation({
    summary: 'Actualizar perfil del usuario',
    description: 'Permite actualizar nombre y avatar del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado exitosamente',
  })
  actualizarPerfil(
    @Request() req,
    @Body() actualizar_usuario_dto: ActualizarUsuarioDto,
  ) {
    return this.usuarios_servicio.actualizar(
      req.user.id,
      actualizar_usuario_dto,
    );
  }
}