import {
  Users,
  Calendar,
  DollarSign,
  FileText,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAutenticacion } from '../contextos/contexto-autenticacion';
import { Button } from '@/componentes/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ItemMenu {
  icono: any;
  etiqueta: string;
  ruta: string;
}

const items_menu: ItemMenu[] = [
  { icono: Users, etiqueta: 'Pacientes', ruta: '/pacientes' },
  { icono: Calendar, etiqueta: 'Agenda', ruta: '/agenda' },
  { icono: ClipboardList, etiqueta: 'Tratamientos', ruta: '/tratamientos' },
  { icono: DollarSign, etiqueta: 'Finanzas', ruta: '/finanzas' },
  { icono: FileText, etiqueta: 'Reportes', ruta: '/reportes' },
];

export function BarraLateral() {
  const [abierta, setAbierta] = useState(false);
  const { usuario, cerrarSesion } = useAutenticacion();

  const obtener_iniciales = (nombre: string) => {
    return nombre
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Button
        variant="default"
        size="icon"
        onClick={() => setAbierta(!abierta)}
        className="lg:hidden fixed top-4 left-4 z-50"
      >
        {abierta ? <X size={24} /> : <Menu size={24} />}
      </Button>

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-background border-r
          transform transition-transform duration-200 ease-in-out
          ${abierta ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">Sistema Dental</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {items_menu.map((item) => {
              const Icono = item.icono;
              return (
                <Button
                  key={item.ruta}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setAbierta(false)}
                >
                  <Icono className="mr-3 h-5 w-5" />
                  <span>{item.etiqueta}</span>
                </Button>
              );
            })}
          </nav>

          <div className="p-4 border-t space-y-2">
            <div className="flex items-center gap-3 p-2">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {usuario?.nombre
                    ? obtener_iniciales(usuario.nombre)
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {usuario?.nombre}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {usuario?.correo}
                </p>
              </div>
            </div>

            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-3 h-5 w-5" />
              <span>Configuración</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={cerrarSesion}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </aside>

      {abierta && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setAbierta(false)}
        />
      )}
    </>
  );
}