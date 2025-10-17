import { useState, FormEvent } from 'react';
import { useAutenticacion } from '../contextos/contexto-autenticacion';
import { Entrada } from '../componentes/ui/entrada';
import { Boton } from '../componentes/ui/boton';
import {
  Tarjeta,
  TarjetaEncabezado,
  TarjetaContenido,
} from '../componentes/ui/tarjeta';

interface PropiedadesInicioSesion {
  alCambiarModo: () => void;
}

export function InicioSesion({ alCambiarModo }: PropiedadesInicioSesion) {
  const { iniciarSesion } = useAutenticacion();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await iniciarSesion({ correo, contrasena });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Tarjeta className="w-full max-w-md">
        <TarjetaEncabezado>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Sistema Dental
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Inicia sesión para continuar
            </p>
          </div>
        </TarjetaEncabezado>

        <TarjetaContenido>
          <form onSubmit={manejarEnvio} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <Entrada
              etiqueta="Correo electrónico"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="ejemplo@correo.com"
              disabled={cargando}
            />

            <Entrada
              etiqueta="Contraseña"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              placeholder="••••••••"
              disabled={cargando}
            />

            <Boton
              type="submit"
              className="w-full"
              disabled={cargando}
              variante="primario"
            >
              {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Boton>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{' '}
              <button
                onClick={alCambiarModo}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                disabled={cargando}
              >
                Registrarse
              </button>
            </p>
          </div>
        </TarjetaContenido>
      </Tarjeta>
    </div>
  );
}