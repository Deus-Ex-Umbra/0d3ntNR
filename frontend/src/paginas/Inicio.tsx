import { MenuLateral } from '@/componentes/menu-lateral';
import { useAutenticacion } from '@/contextos/autenticacion-contexto';
import { Card } from '@/componentes/ui/card';
import { Calendar, Users, DollarSign, FileText, TrendingUp, Clock } from 'lucide-react';

export default function Inicio() {
  const { usuario } = useAutenticacion();

  const tarjetas_estadisticas = [
    { titulo: 'Pacientes Totales', valor: '0', icono: Users, color: 'text-blue-400' },
    { titulo: 'Citas Hoy', valor: '0', icono: Calendar, color: 'text-green-400' },
    { titulo: 'Ingresos del Mes', valor: '$0', icono: DollarSign, color: 'text-yellow-400' },
    { titulo: 'Tratamientos Activos', valor: '0', icono: FileText, color: 'text-purple-400' },
  ];

  const actividad_reciente = [
    { tipo: 'Cita', descripcion: 'No hay actividad reciente', tiempo: '-', icono: Clock },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <MenuLateral />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100">
              Bienvenido, {usuario?.nombre}
            </h1>
            <p className="mt-2 text-slate-400">
              Aquí está el resumen de tu consultorio dental
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tarjetas_estadisticas.map((tarjeta, index) => {
              const Icono = tarjeta.icono;
              return (
                <Card key={index} className="border-slate-800 bg-slate-900/50 p-6 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">{tarjeta.titulo}</p>
                      <p className="mt-2 text-3xl font-bold text-slate-100">{tarjeta.valor}</p>
                    </div>
                    <div className={`rounded-full bg-slate-800 p-3 ${tarjeta.color}`}>
                      <Icono className="h-6 w-6" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-800 bg-slate-900/50 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-slate-100">Resumen Financiero</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Ingresos</span>
                  <span className="font-semibold text-green-400">$0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Egresos</span>
                  <span className="font-semibold text-red-400">$0</span>
                </div>
                <div className="border-t border-slate-800 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-200">Balance</span>
                    <span className="font-bold text-slate-100">$0</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-slate-800 bg-slate-900/50 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-slate-100">Actividad Reciente</h2>
              </div>
              <div className="space-y-4">
                {actividad_reciente.map((item, index) => {
                  const Icono = item.icono;
                  return (
                    <div key={index} className="flex items-start gap-3 rounded-lg bg-slate-800/50 p-3">
                      <Icono className="h-5 w-5 text-slate-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">{item.tipo}</p>
                        <p className="text-xs text-slate-400">{item.descripcion}</p>
                      </div>
                      <span className="text-xs text-slate-500">{item.tiempo}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}