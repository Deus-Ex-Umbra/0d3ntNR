import { Injectable } from '@nestjs/common';
import { UsuariosServicio } from '../usuarios/usuarios.servicio';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';

@Injectable()
export class AutenticacionServicio {
  constructor(
    private readonly usuarios_servicio: UsuariosServicio,
    private readonly jwt_servicio: JwtService,
  ) {}

  async validarUsuario(correo: string, contrasena: string): Promise<any> {
    const usuario = await this.usuarios_servicio.encontrarPorCorreo(correo);
    if (usuario && (await bcrypt.compare(contrasena, usuario.contrasena))) {
      const { contrasena, ...resultado } = usuario;
      return resultado;
    }
    return null;
  }

  async iniciarSesion(usuario: any) {
    const payload = { correo: usuario.correo, sub: usuario.id };
    const usuario_datos = await this.usuarios_servicio.encontrarPorId(
      usuario.id,
    );

    return {
      token_acceso: this.jwt_servicio.sign(payload),
      usuario: usuario_datos,
    };
  }

  async registrar(registro_usuario_dto: RegistroUsuarioDto) {
    return this.usuarios_servicio.crear(registro_usuario_dto);
  }
}