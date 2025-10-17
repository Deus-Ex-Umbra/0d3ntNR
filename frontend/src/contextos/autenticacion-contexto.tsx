import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { autenticacionApi, usuariosApi } from '@/lib/api';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  avatar?: string;
}

interface AutenticacionContexto {
  usuario: Usuario | null;
  cargando: boolean;
  iniciarSesion: (correo: string, contrasena: string) => Promise<void>;
  cerrarSesion: () => void;
  registrar: (nombre: string, correo: string, contrasena: string) => Promise<void>;
  actualizarUsuario: (datos: Partial<Usuario>) => void;
}

const AutenticacionContexto = createContext<AutenticacionContexto | undefined>(undefined);

export function ProveedorAutenticacion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      const token = localStorage.getItem('token_acceso');
      if (!token) {
        setCargando(false);
        return;
      }
      
      const datos_usuario = await usuariosApi.obtenerPerfil();
      setUsuario(datos_usuario);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      localStorage.removeItem('token_acceso');
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  };

  const iniciarSesion = async (correo: string, contrasena: string) => {
    const respuesta = await autenticacionApi.iniciarSesion({ correo, contrasena });
    localStorage.setItem('token_acceso', respuesta.token_acceso);
    setUsuario(respuesta.usuario);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token_acceso');
    setUsuario(null);
  };

  const registrar = async (nombre: string, correo: string, contrasena: string) => {
    await autenticacionApi.registrar({ nombre, correo, contrasena });
    await iniciarSesion(correo, contrasena);
  };

  const actualizarUsuario = (datos: Partial<Usuario>) => {
    setUsuario(prev => prev ? { ...prev, ...datos } : null);
  };

  return (
    <AutenticacionContexto.Provider value={{ 
      usuario, 
      cargando, 
      iniciarSesion, 
      cerrarSesion, 
      registrar,
      actualizarUsuario
    }}>
      {children}
    </AutenticacionContexto.Provider>
  );
}

export function useAutenticacion() {
  const contexto = useContext(AutenticacionContexto);
  if (contexto === undefined) {
    throw new Error('useAutenticacion debe usarse dentro de ProveedorAutenticacion');
  }
  return contexto;
}