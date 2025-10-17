import { MenuLateral } from '@/componentes/MenuLateral';
import { useAutenticacion } from '@/contextos/autenticacion-contexto';
import { Card, CardContent, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Calendar, Users, DollarSign, FileText, TrendingUp, Clock, Activity, Sparkles } from 'lucide-react';

export default function Inicio() {
  const { usuario } = useAutenticacion();

  const tarjetas_estadisticas = [
    { titulo: 'Pacientes Totales', valor: '0', icono: Users, color: 'text-blue-400', fondo: 'bg-blue-500/10' },
    { titulo: 'Citas Hoy', valor: '0', icono: Calendar, color: 'text-green-400', fondo: 'bg-green-500/10' },
    { titulo: 'Ingresos del Mes', valor: '$0', icono: DollarSign, color: 'text-yellow-400', fondo: 'bg-yellow-500/10' },
    { titulo: 'Tratamientos Activos', valor: '0', icono: FileText, color: 'text-purple-400', fondo: 'bg-purple-500/10' },
  ];

  const actividad_reciente = [
    { 
      tipo: 'Sistema', 
      descripcion: 'Bienvenido a DentalApp - Tu sistema de gestión dental', 
      tiempo: 'Ahora', 
      icono: Sparkles,
      color: 'text-primary'
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
      <MenuLateral />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Bienvenido, <span className="text-primary">{usuario?.nombre}</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Panel de control de tu consultorio dental
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-2 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-xl mt-1">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-primary mb-1">Mensaje del día</h3>
                  <p className="text-base text-foreground leading-relaxed">
                    ¡Bienvenido a DentalApp! Estamos listos para ayudarte a gestionar tu consultorio.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tarjetas_estadisticas.map((tarjeta, index) => {
              const Icono = tarjeta.icono;
              return (
                <Card key={index} className="border-2 border-border shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {tarjeta.titulo}
                    </CardTitle>
                    <div className={`${tarjeta.fondo} p-2 rounded-lg`}>
                      <Icono className={`h-5 w-5 ${tarjeta.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{tarjeta.valor}</div>
                    <p className="text-xs text-muted-foreground mt-1">Sin cambios</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-2 border-border shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Resumen Financiero</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                  <span className="text-muted-foreground font-medium">Total Ingresos</span>
                  <span className="font-bold text-green-400 text-lg">$0</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                  <span className="text-muted-foreground font-medium">Total Egresos</span>
                  <span className="font-bold text-red-400 text-lg">$0</span>
                </div>
                <div className="border-t-2 border-border pt-4 mt-4">
                  <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10">
                    <span className="font-bold text-foreground text-lg">Balance</span>
                    <span className="text-2xl font-bold text-primary">$0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-border shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Actividad Reciente</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {actividad_reciente.map((item, index) => {
                  const Icono = item.icono;
                  return (
                    <div key={index} className="flex items-start gap-3 rounded-lg bg-secondary/30 p-4 border border-border hover:bg-secondary/50 transition-colors">
                      <div className="rounded-full bg-primary/20 p-2">
                        <Icono className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold text-foreground">{item.tipo}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.descripcion}</p>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{item.tiempo}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-xl">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">¡Comienza a usar DentalApp!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Registra tu primer paciente o configura un tratamiento desde el menú lateral
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}