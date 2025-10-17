export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  avatar: string | null;
}

export interface RespuestaAutenticacion {
  token_acceso: string;
  usuario: Usuario;
}

export interface DatosInicioSesion {
  correo: string;
  contrasena: string;
}

export interface DatosRegistro {
  nombre: string;
  correo: string;
  contrasena: string;
}