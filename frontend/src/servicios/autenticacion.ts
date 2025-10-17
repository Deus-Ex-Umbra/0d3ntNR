import { peticionApi } from './api';
import type {
  RespuestaAutenticacion,
  DatosInicioSesion,
  DatosRegistro,
  Usuario,
} from '../tipos/usuario';

export const servicioAutenticacion = {
  async iniciarSesion(
    datos: DatosInicioSesion,
  ): Promise<RespuestaAutenticacion> {
    const respuesta = await peticionApi<RespuestaAutenticacion>(
      '/autenticacion/inicio-sesion',
      {
        method: 'POST',
        body: JSON.stringify(datos),
      },
    );

    localStorage.setItem('token', respuesta.token_acceso);
    return respuesta;
  },

  async registrar(datos: DatosRegistro): Promise<Usuario> {
    const respuesta = await peticionApi<Usuario>('/autenticacion/registro', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
    return respuesta;
  },

  async obtenerPerfil(): Promise<Usuario> {
    return peticionApi<Usuario>('/usuarios/perfil');
  },

  cerrarSesion(): void {
    localStorage.removeItem('token');
  },

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  },
};