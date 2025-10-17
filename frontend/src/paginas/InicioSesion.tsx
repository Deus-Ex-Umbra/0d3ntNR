import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAutenticacion } from '@/contextos/autenticacion-contexto';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Registro() {
  const navegar = useNavigate();
  const { registrar } = useAutenticacion();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar_contrasena, setConfirmarContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (contrasena !== confirmar_contrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);

    try {
      await registrar(nombre, correo, contrasena);
      navegar('/inicio');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="desktop-window">
          <CardHeader className="space-y-1 text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
              <div className="text-2xl font-bold text-primary-foreground">D</div>
            </div>
            <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
            <CardDescription>Regístrate en DentalApp</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={manejarEnvio} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Dr. Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={cargando}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo">Correo electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="tu@email.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  disabled={cargando}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contrasena">Contraseña</Label>
                <Input
                  id="contrasena"
                  type="password"
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                  disabled={cargando}
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmar_contrasena">Confirmar contraseña</Label>
                <Input
                  id="confirmar_contrasena"
                  type="password"
                  placeholder="••••••••"
                  value={confirmar_contrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  required
                  disabled={cargando}
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={cargando}>
                {cargando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Cuenta
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/inicio-sesion" className="text-primary hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}