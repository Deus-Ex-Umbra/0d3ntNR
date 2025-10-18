import axios from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_acceso');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token agregado al header:', token.substring(0, 20) + '...');
    } else {
      console.log('No hay token en localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`Respuesta exitosa de ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Error en interceptor de response:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('Token inválido o expirado, redirigiendo a inicio de sesión');
      localStorage.removeItem('token_acceso');
      
      if (window.location.pathname !== '/inicio-sesion' && window.location.pathname !== '/registro') {
        window.location.href = '/inicio-sesion';
      }
    }
    return Promise.reject(error);
  }
);

export const verificarConexion = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_URL}/api`, { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
};

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

export const notasApi = {
  crear: async (contenido: string) => {
    const respuesta = await api.post('/notas', { contenido });
    return respuesta.data;
  },
  obtenerUltimas: async (dias: number) => {
    const respuesta = await api.get(`/notas?dias=${dias}`);
    return respuesta.data;
  },
};

export const asistenteApi = {
  obtenerFraseMotivacional: async (dias: number = 7) => {
    const respuesta = await api.post('/asistente/frase-motivacional', { dias });
    return respuesta.data;
  },
};

export const finanzasApi = {
  registrarEgreso: async (datos: { concepto: string; fecha: Date; monto: number }) => {
    const respuesta = await api.post('/finanzas/egresos', datos);
    return respuesta.data;
  },
  registrarPago: async (datos: { plan_tratamiento_id: number; fecha: Date; monto: number }) => {
    const respuesta = await api.post('/finanzas/pagos', datos);
    return respuesta.data;
  },
  obtenerReporte: async (fecha_inicio?: string, fecha_fin?: string) => {
    const params = new URLSearchParams();
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);
    
    const respuesta = await api.get(`/finanzas/reporte?${params.toString()}`);
    return respuesta.data;
  },
};