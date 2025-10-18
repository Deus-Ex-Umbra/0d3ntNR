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
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
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

export const pacientesApi = {
  crear: async (datos: any) => {
    const respuesta = await api.post('/pacientes', datos);
    return respuesta.data;
  },
  obtenerTodos: async (termino_busqueda?: string) => {
    const params = termino_busqueda ? `?termino_busqueda=${termino_busqueda}` : '';
    const respuesta = await api.get(`/pacientes${params}`);
    return respuesta.data;
  },
  obtenerPorId: async (id: number) => {
    const respuesta = await api.get(`/pacientes/${id}`);
    return respuesta.data;
  },
  actualizar: async (id: number, datos: any) => {
    const respuesta = await api.put(`/pacientes/${id}`, datos);
    return respuesta.data;
  },
  eliminar: async (id: number) => {
    const respuesta = await api.delete(`/pacientes/${id}`);
    return respuesta.data;
  },
};

export const tratamientosApi = {
  crear: async (datos: { nombre: string; numero_citas: number; costo_total: number }) => {
    const respuesta = await api.post('/tratamientos', datos);
    return respuesta.data;
  },
  obtenerTodos: async () => {
    const respuesta = await api.get('/tratamientos');
    return respuesta.data;
  },
  obtenerPorId: async (id: number) => {
    const respuesta = await api.get(`/tratamientos/${id}`);
    return respuesta.data;
  },
  actualizar: async (id: number, datos: any) => {
    const respuesta = await api.put(`/tratamientos/${id}`, datos);
    return respuesta.data;
  },
  eliminar: async (id: number) => {
    const respuesta = await api.delete(`/tratamientos/${id}`);
    return respuesta.data;
  },
};

export const planesTratamientoApi = {
  asignar: async (datos: { paciente_id: number; tratamiento_id: number; fecha_inicio: string }) => {
    const respuesta = await api.post('/planes-tratamiento', datos);
    return respuesta.data;
  },
  obtenerTodos: async () => {
    const respuesta = await api.get('/planes-tratamiento');
    return respuesta.data;
  },
  obtenerPorPaciente: async (paciente_id: number) => {
    const respuesta = await api.get(`/planes-tratamiento/paciente/${paciente_id}`);
    return respuesta.data;
  },
};

export const agendaApi = {
  crear: async (datos: any) => {
    const respuesta = await api.post('/agenda', datos);
    return respuesta.data;
  },
  obtenerPorMes: async (mes: number, ano: number) => {
    const respuesta = await api.get(`/agenda?mes=${mes}&ano=${ano}`);
    return respuesta.data;
  },
  actualizar: async (id: number, datos: any) => {
    const respuesta = await api.put(`/agenda/${id}`, datos);
    return respuesta.data;
  },
  eliminar: async (id: number) => {
    const respuesta = await api.delete(`/agenda/${id}`);
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
  digitalizarCitas: async (imagen_base64: string) => {
    const respuesta = await api.post('/asistente/ocr-citas', { imagen_base64 });
    return respuesta.data;
  },
};

export const finanzasApi = {
  registrarEgreso: async (datos: { concepto: string; fecha: Date; monto: number; cita_id?: number }) => {
    const respuesta = await api.post('/finanzas/egresos', datos);
    return respuesta.data;
  },
  registrarPago: async (datos: { plan_tratamiento_id?: number; cita_id?: number; fecha: Date; monto: number; concepto?: string }) => {
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

export const estadisticasApi = {
  obtenerDashboard: async () => {
    const respuesta = await api.get('/estadisticas/dashboard');
    return respuesta.data;
  },
};