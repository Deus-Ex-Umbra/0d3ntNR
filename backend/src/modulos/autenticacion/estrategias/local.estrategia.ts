import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AutenticacionServicio } from '../autenticacion.servicio';

@Injectable()
export class LocalEstrategia extends PassportStrategy(Strategy) {
  constructor(private readonly autenticacion_servicio: AutenticacionServicio) {
    super({ usernameField: 'correo' });
  }

  async validate(correo: string, contrasena: string): Promise<any> {
    const usuario = await this.autenticacion_servicio.validarUsuario(correo, contrasena);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return usuario;
  }
}