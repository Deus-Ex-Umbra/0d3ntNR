import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAutenticacion } from '@/contextos/autenticacion-contexto';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Loader2, AlertCircle, UserPlus } from 'lucide-react';

export default function Registro() {
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-border shadow-2xl">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
              <UserPlus className="h-10 w-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Crear cuenta</CardTitle>
            <CardDescription className="text-base">Únete a DentalApp</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={manejarEnvio} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/15 border border-destructive/30 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium">
                  Nombre completo
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Dr. Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={cargando}
                  autoComplete="name"
                  className="h-11 bg-secondary/50 border-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo" className="text-sm font-medium">
                  Correo electrónico
                </Label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="tu@email.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  disabled={cargando}
                  autoComplete="email"
                  className="h-11 bg-secondary/50 border-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contrasena" className="text-sm font-medium">
                  Contraseña
                </Label>
                <Input
                  id="contrasena"
                  type="password"
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                  disabled={cargando}
                  autoComplete="new-password"
                  className="h-11 bg-secondary/50 border-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmar_contrasena" className="text-sm font-medium">
                  Confirmar contraseña
                </Label>
                <Input
                  id="confirmar_contrasena"
                  type="password"
                  placeholder="••••••••"
                  value={confirmar_contrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  required
                  disabled={cargando}
                  autoComplete="new-password"
                  className="h-11 bg-secondary/50 border-secondary"
                />
              </div>

              <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg" disabled={cargando}>
                {cargando && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Crear Cuenta
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t border-border pt-6">
            <div className="text-sm text-muted-foreground text-center">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/inicio-sesion" className="text-primary hover:underline font-semibold">
                Inicia sesión aquí
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}