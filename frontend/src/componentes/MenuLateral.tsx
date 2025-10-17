import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  Settings, 
  LogOut,
  Home,
  Smile,
  Activity
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
    <div className="flex h-screen w-72 flex-col border-r-2 border-border bg-card/50 backdrop-blur-sm">
      <div className="border-b-2 border-border p-6 bg-gradient-to-br from-primary/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg flex items-center justify-center">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">DentalApp</h1>
            <p className="text-xs text-muted-foreground font-medium">Gestión Odontológica</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {items_menu.map((item) => {
            const Icono = item.icono;
            const activo = ubicacion.pathname === item.ruta;
            
            return (
              <Button
                key={item.ruta}
                variant={activo ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 h-12 text-base font-medium transition-all',
                  activo 
                    ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' 
                    : 'hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
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

      <div className="border-t-2 border-border p-4 space-y-3 bg-secondary/20">
        <div className="flex items-center gap-3 rounded-xl bg-secondary/60 p-3 border border-border">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-base font-bold shadow-md">
            {usuario?.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold text-foreground">{usuario?.nombre}</p>
            <p className="truncate text-xs text-muted-foreground">{usuario?.correo}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/15 border border-transparent hover:border-destructive/30 font-medium transition-all"
          onClick={manejarCerrarSesion}
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
}