import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token_acceso');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token_acceso');
      window.location.href = '/inicio-sesion';
    }
    return Promise.reject(error);
  }
);

export const autenticacionApi = {
  registrar: async (datos: { nombre: string; correo: string; contrasena: string }) => {
    const respuesta = await api.post('/autenticacion/registro', datos);
    return respuesta.data;
  },
  iniciarSesion: async (credenciales: { correo: string; contrasena: string }) => {
    const respuesta = await api.post('/autenticacion/inicio-sesion', credenciales);
    return respuesta.data;
  },
};

export const usuariosApi = {
  obtenerPerfil: async () => {
    const respuesta = await api.get('/usuarios/perfil');
    return respuesta.data;
  },
  actualizarPerfil: async (datos: { nombre?: string; avatar?: string }) => {
    const respuesta = await api.put('/usuarios/perfil', datos);
    return respuesta.data;
  },
};