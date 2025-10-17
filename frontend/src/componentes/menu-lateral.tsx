import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  Settings, 
  LogOut,
  Home,
  Smile
} from 'lucide-react';
import { useAutenticacion } from '@/contextos/autenticacion-contexto';
import { cn } from '@/lib/utilidades';

interface ItemMenu {
  icono: React.ElementType;
  etiqueta: string;
  ruta: string;
}

const items_menu: ItemMenu[] = [
  { icono: Home, etiqueta: 'Inicio', ruta: '/inicio' },
  { icono: Users, etiqueta: 'Pacientes', ruta: '/pacientes' },
  { icono: Calendar, etiqueta: 'Agenda', ruta: '/agenda' },
  { icono: Smile, etiqueta: 'Odontograma', ruta: '/odontograma' },
  { icono: FileText, etiqueta: 'Tratamientos', ruta: '/tratamientos' },
  { icono: DollarSign, etiqueta: 'Finanzas', ruta: '/finanzas' },
  { icono: Settings, etiqueta: 'Configuración', ruta: '/configuracion' },
];

export function MenuLateral() {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const { cerrarSesion, usuario } = useAutenticacion();

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navegar('/inicio-sesion');
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-slate-100">DentalApp</h1>
        <p className="mt-1 text-sm text-slate-400">Gestión Odontológica</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {items_menu.map((item) => {
            const Icono = item.icono;
            const activo = ubicacion.pathname === item.ruta;
            
            return (
              <button
                key={item.ruta}
                onClick={() => navegar(item.ruta)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  activo
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-300'
                )}
              >
                <Icono className="h-5 w-5" />
                <span>{item.etiqueta}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-900 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-slate-100">
            {usuario?.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-200">{usuario?.nombre}</p>
            <p className="truncate text-xs text-slate-500">{usuario?.correo}</p>
          </div>
        </div>
        
        <button
          onClick={manejarCerrarSesion}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-300"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}