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
import { Button } from '@/componentes/ui/button';

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
    <div className="flex h-screen w-64 flex-col sidebar-desktop">
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">DentalApp</h1>
            <p className="text-xs text-muted-foreground">Gestión Odontológica</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <nav className="space-y-1">
          {items_menu.map((item) => {
            const Icono = item.icono;
            const activo = ubicacion.pathname === item.ruta;
            
            return (
              <Button
                key={item.ruta}
                variant={activo ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 h-11',
                  activo && 'bg-secondary text-secondary-foreground'
                )}
                onClick={() => navegar(item.ruta)}
              >
                <Icono className="h-5 w-5" />
                <span>{item.etiqueta}</span>
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border p-3 space-y-2">
        <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {usuario?.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-foreground">{usuario?.nombre}</p>
            <p className="truncate text-xs text-muted-foreground">{usuario?.correo}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={manejarCerrarSesion}
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
}