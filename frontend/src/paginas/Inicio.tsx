import { useState, useEffect } from 'react';
import { MenuLateral } from '@/componentes/MenuLateral';
import { useAutenticacion } from '@/contextos/autenticacion-contexto';
import { Card, CardContent, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Calendar, Users, DollarSign, FileText, TrendingUp, Clock, Sparkles, Loader2 } from 'lucide-react';
import { estadisticasApi, asistenteApi } from '@/lib/api';

interface Estadisticas {
  total_pacientes: number;
  citas_hoy: number;
  planes_activos: number;
  ingresos_mes: number;
  egresos_mes: number;
  balance_mes: number;
  citas_recientes: Array<{
    id: number;
    fecha: Date;
    descripcion: string;
    paciente?: {
      nombre: string;
      apellidos: string;
    };
  }>;
}

export default function Inicio() {
  const { usuario } = useAutenticacion();
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [frase_motivacional, setFraseMotivacional] = useState<string>('Bienvenido, ¿qué haremos hoy?');
  const [cargando, setCargando] = useState(true);
  const [cargando_frase, setCargandoFrase] = useState(false);

  useEffect(() => {
    cargarEstadisticas();
    cargarFraseMotivacional();
  }, []);

  const cargarEstadisticas = async () => {
    setCargando(true);
    try {
      const datos_estadisticas = await estadisticasApi.obtenerDashboard();
      setEstadisticas(datos_estadisticas);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarFraseMotivacional = async () => {
    setCargandoFrase(true);
    try {
      const frase = await asistenteApi.obtenerFraseMotivacional(7);
      setFraseMotivacional(frase);
    } catch (error) {
      console.error('Error al cargar frase:', error);
      setFraseMotivacional('Bienvenido, ¿qué haremos hoy?');
    } finally {
      setCargandoFrase(false);
    }
  };

  const formatearMoneda = (monto: number): string => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(monto);
  };

  const formatearFecha = (fecha: Date): string => {
    return new Date(fecha).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (cargando) {
    return (
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
        <MenuLateral />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Cargando estadísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  const tarjetas_estadisticas = [
    { 
      titulo: 'Pacientes Totales', 
      valor: estadisticas?.total_pacientes || 0, 
      icono: Users, 
      color: 'text-blue-400', 
      fondo: 'bg-blue-500/10' 
    },
    { 
      titulo: 'Citas Hoy', 
      valor: estadisticas?.citas_hoy || 0, 
      icono: Calendar, 
      color: 'text-green-400', 
      fondo: 'bg-green-500/10' 
    },
    { 
      titulo: 'Ingresos del Mes', 
      valor: formatearMoneda(estadisticas?.ingresos_mes || 0), 
      icono: DollarSign, 
      color: 'text-yellow-400', 
      fondo: 'bg-yellow-500/10' 
    },
    { 
      titulo: 'Tratamientos Activos', 
      valor: estadisticas?.planes_activos || 0, 
      icono: FileText, 
      color: 'text-purple-400', 
      fondo: 'bg-purple-500/10' 
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
      <MenuLateral />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground tracking-tight hover:text-primary transition-colors duration-200">
                Bienvenido, <span className="text-primary">{usuario?.nombre}</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Panel de control de tu consultorio dental
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-xl mt-1 hover:scale-110 transition-transform duration-200">
                  {cargando_frase ? (
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  ) : (
                    <Sparkles className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-primary mb-1">Mensaje del día</h3>
                  <p className="text-base text-foreground leading-relaxed">
                    {frase_motivacional}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tarjetas_estadisticas.map((tarjeta, index) => {
              const Icono = tarjeta.icono;
              return (
                <Card key={index} className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:scale-105 transition-all duration-200 cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {tarjeta.titulo}
                    </CardTitle>
                    <div className={`${tarjeta.fondo} p-2 rounded-lg hover:scale-110 transition-transform duration-200`}>
                      <Icono className={`h-5 w-5 ${tarjeta.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{tarjeta.valor}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Resumen Financiero</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors duration-200">
                  <span className="text-muted-foreground font-medium">Total Ingresos</span>
                  <span className="font-bold text-green-400 text-lg">
                    {formatearMoneda(estadisticas?.ingresos_mes || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors duration-200">
                  <span className="text-muted-foreground font-medium">Total Egresos</span>
                  <span className="font-bold text-red-400 text-lg">
                    {formatearMoneda(estadisticas?.egresos_mes || 0)}
                  </span>
                </div>
                <div className="border-t-2 border-border pt-4 mt-4">
                  <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10 hover:bg-primary/20 hover:scale-105 transition-all duration-200">
                    <span className="font-bold text-foreground text-lg">Balance</span>
                    <span className={`text-2xl font-bold ${(estadisticas?.balance_mes || 0) >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      {formatearMoneda(estadisticas?.balance_mes || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Próximas Citas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {!estadisticas?.citas_recientes || estadisticas.citas_recientes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No hay citas programadas</p>
                ) : (
                  estadisticas.citas_recientes.map((cita) => (
                    <div key={cita.id} className="flex items-start gap-3 rounded-lg bg-secondary/30 p-4 border border-border hover:bg-secondary/50 hover:scale-105 transition-all duration-200">
                      <div className="rounded-full bg-primary/20 p-2 hover:scale-110 transition-transform duration-200">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          {cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellidos}` : 'Evento general'}
                        </p>
                        <p className="text-xs text-muted-foreground">{cita.descripcion}</p>
                        <p className="text-xs text-muted-foreground font-medium">{formatearFecha(cita.fecha)}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}