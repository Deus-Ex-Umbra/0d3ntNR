import type { FormEvent } from 'react';
import { useState } from 'react';
import { useAutenticacion } from '../contextos/autenticacion-contexto';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/componentes/ui/card';
import { Alert, AlertDescription } from '@/componentes/ui/alerta';
import { Loader2 } from 'lucide-react';

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
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Sistema Dental</CardTitle>
          <CardDescription>Inicia sesión para continuar</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={manejarEnvio} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                placeholder="ejemplo@correo.com"
                disabled={cargando}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrasena">Contraseña</Label>
              <Input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                placeholder="••••••••"
                disabled={cargando}
              />
            </div>

            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <button
              onClick={alCambiarModo}
              className="text-primary hover:underline font-medium"
              disabled={cargando}
            >
              Registrarse
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}