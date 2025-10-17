import { MenuLateral } from '@/componentes/MenuLateral';
import { useAutenticacion } from '@/contextos/autenticacion-contexto';
import { Card, CardContent, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Calendar, Users, DollarSign, FileText, TrendingUp, Clock, Activity } from 'lucide-react';

export default function Inicio() {
  const { usuario } = useAutenticacion();

  const tarjetas_estadisticas = [
    { titulo: 'Pacientes Totales', valor: '0', icono: Users, color: 'text-blue-500' },
    { titulo: 'Citas Hoy', valor: '0', icono: Calendar, color: 'text-green-500' },
    { titulo: 'Ingresos del Mes', valor: '$0', icono: DollarSign, color: 'text-yellow-500' },
    { titulo: 'Tratamientos Activos', valor: '0', icono: FileText, color: 'text-purple-500' },
  ];

  const actividad_reciente = [
    { tipo: 'Sistema', descripcion: 'Bienvenido a DentalApp', tiempo: 'Ahora', icono: Activity },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MenuLateral />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Bienvenido, {usuario?.nombre}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Panel de control de tu consultorio dental
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tarjetas_estadisticas.map((tarjeta, index) => {
              const Icono = tarjeta.icono;
              return (
                <Card key={index} className="desktop-window">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {tarjeta.titulo}
                    </CardTitle>
                    <Icono className={`h-5 w-5 ${tarjeta.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{tarjeta.valor}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="desktop-window">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle>Resumen Financiero</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Ingresos</span>
                  <span className="font-semibold text-green-500">$0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Egresos</span>
                  <span className="font-semibold text-red-500">$0</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Balance</span>
                    <span className="text-xl font-bold text-foreground">$0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="desktop-window">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>Actividad Reciente</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {actividad_reciente.map((item, index) => {
                  const Icono = item.icono;
                  return (
                    <div key={index} className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Icono className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">{item.tipo}</p>
                        <p className="text-xs text-muted-foreground">{item.descripcion}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.tiempo}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}