import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAutenticacion } from '@/contextos/autenticacion-contexto';
import { DisenoAutenticacion } from '@/componentes/diseno-autenticacion';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { Loader2 } from 'lucide-react';

export default function Registro() {
  const navegar = useNavigate();
  const { registrar } = useAutenticacion();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar_contrasena, setConfirmarContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarEnvio = async (e: React.FormEvent) => {
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
    <DisenoAutenticacion
      titulo="Crear cuenta"
      subtitulo="Regístrate para comenzar"
    >
      <form onSubmit={manejarEnvio} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-slate-300">Nombre completo</Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Dr. Juan Pérez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="correo" className="text-slate-300">Correo electrónico</Label>
          <Input
            id="correo"
            type="email"
            placeholder="tu@email.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contrasena" className="text-slate-300">Contraseña</Label>
          <Input
            id="contrasena"
            type="password"
            placeholder="••••••••"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            className="border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmar_contrasena" className="text-slate-300">Confirmar contraseña</Label>
          <Input
            id="confirmar_contrasena"
            type="password"
            placeholder="••••••••"
            value={confirmar_contrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            required
            className="border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-700"
          />
        </div>

        <Button
          type="submit"
          disabled={cargando}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {cargando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </Button>

        <div className="text-center text-sm text-slate-400">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/inicio-sesion" className="text-blue-400 hover:text-blue-300">
            Inicia sesión aquí
          </Link>
        </div>
      </form>
    </DisenoAutenticacion>
  );
}