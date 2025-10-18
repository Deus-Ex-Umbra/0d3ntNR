import { useState, useEffect } from 'react';
import { MenuLateral } from '@/componentes/MenuLateral';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { Textarea } from '@/componentes/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/componentes/ui/dialog';
import { DollarSign, TrendingUp, TrendingDown, Plus, Calendar, FileText, Loader2, AlertCircle } from 'lucide-react';
import { finanzasApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/componentes/ui/toaster';

interface Movimiento {
  tipo: 'ingreso' | 'egreso';
  fecha: Date;
  monto: number;
  concepto: string;
}

interface ReporteFinanzas {
  total_ingresos: number;
  total_egresos: number;
  balance: number;
  movimientos: Movimiento[];
}

export default function Finanzas() {
  const [reporte, setReporte] = useState<ReporteFinanzas | null>(null);
  const [cargando, setCargando] = useState(true);
  const [fecha_inicio, setFechaInicio] = useState('');
  const [fecha_fin, setFechaFin] = useState('');
  
  const [dialogo_egreso_abierto, setDialogoEgresoAbierto] = useState(false);
  const [guardando_egreso, setGuardandoEgreso] = useState(false);
  const [concepto_egreso, setConceptoEgreso] = useState('');
  const [fecha_egreso, setFechaEgreso] = useState('');
  const [monto_egreso, setMontoEgreso] = useState('');

  useEffect(() => {
    cargarReporte();
  }, []);

  const cargarReporte = async (inicio?: string, fin?: string) => {
    setCargando(true);
    try {
      const datos = await finanzasApi.obtenerReporte(inicio, fin);
      setReporte(datos);
    } catch (error) {
      console.error('Error al cargar reporte:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el reporte financiero',
        variant: 'destructive',
      });
    } finally {
      setCargando(false);
    }
  };

  const manejarFiltrarPorFechas = () => {
    if (!fecha_inicio || !fecha_fin) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar ambas fechas',
        variant: 'destructive',
      });
      return;
    }
    cargarReporte(fecha_inicio, fecha_fin);
  };

  const limpiarFiltros = () => {
    setFechaInicio('');
    setFechaFin('');
    cargarReporte();
  };

  const manejarRegistrarEgreso = async () => {
    if (!concepto_egreso || !fecha_egreso || !monto_egreso) {
      toast({
        title: 'Error',
        description: 'Todos los campos son obligatorios',
        variant: 'destructive',
      });
      return;
    }

    const monto = parseFloat(monto_egreso);
    if (isNaN(monto) || monto <= 0) {
      toast({
        title: 'Error',
        description: 'El monto debe ser un número positivo',
        variant: 'destructive',
      });
      return;
    }

    setGuardandoEgreso(true);
    try {
      await finanzasApi.registrarEgreso({
        concepto: concepto_egreso,
        fecha: new Date(fecha_egreso),
        monto,
      });

      toast({
        title: 'Éxito',
        description: 'Egreso registrado correctamente',
      });

      setDialogoEgresoAbierto(false);
      setConceptoEgreso('');
      setFechaEgreso('');
      setMontoEgreso('');
      
      cargarReporte(fecha_inicio || undefined, fecha_fin || undefined);
    } catch (error) {
      console.error('Error al registrar egreso:', error);
      toast({
        title: 'Error',
        description: 'No se pudo registrar el egreso',
        variant: 'destructive',
      });
    } finally {
      setGuardandoEgreso(false);
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
      year: 'numeric',
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
            <p className="text-muted-foreground">Cargando reporte financiero...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
      <MenuLateral />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground tracking-tight hover:text-primary transition-colors duration-200">
                Finanzas
              </h1>
              <p className="text-lg text-muted-foreground">
                Gestión financiera de tu consultorio
              </p>
            </div>

            <Dialog open={dialogo_egreso_abierto} onOpenChange={setDialogoEgresoAbierto}>
              <DialogTrigger asChild>
                <Button size="lg" className="shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-200">
                  <Plus className="h-5 w-5 mr-2" />
                  Registrar Egreso
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Registrar Egreso</DialogTitle>
                  <DialogDescription>
                    Registra un gasto o egreso de tu consultorio
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="concepto">Concepto</Label>
                    <Textarea
                      id="concepto"
                      placeholder="Ej: Compra de materiales dentales"
                      value={concepto_egreso}
                      onChange={(e) => setConceptoEgreso(e.target.value)}
                      rows={3}
                      className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha_egreso">Fecha</Label>
                      <Input
                        id="fecha_egreso"
                        type="datetime-local"
                        value={fecha_egreso}
                        onChange={(e) => setFechaEgreso(e.target.value)}
                        className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monto">Monto (Bs.)</Label>
                      <Input
                        id="monto"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={monto_egreso}
                        onChange={(e) => setMontoEgreso(e.target.value)}
                        className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogoEgresoAbierto(false)}
                    disabled={guardando_egreso}
                    className="hover:scale-105 transition-all duration-200"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={manejarRegistrarEgreso} 
                    disabled={guardando_egreso}
                    className="hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-200"
                  >
                    {guardando_egreso && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Registrar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                Filtrar por Fechas
              </CardTitle>
              <CardDescription>Selecciona un rango de fechas para filtrar el reporte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                  <Input
                    id="fecha_inicio"
                    type="date"
                    value={fecha_inicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="fecha_fin">Fecha Fin</Label>
                  <Input
                    id="fecha_fin"
                    type="date"
                    value={fecha_fin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                  />
                </div>
                <Button 
                  onClick={manejarFiltrarPorFechas}
                  className="hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-200"
                >
                  Filtrar
                </Button>
                {(fecha_inicio || fecha_fin) && (
                  <Button 
                    variant="outline" 
                    onClick={limpiarFiltros}
                    className="hover:scale-105 transition-all duration-200"
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Ingresos
                </CardTitle>
                <div className="bg-green-500/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">
                  {formatearMoneda(reporte?.total_ingresos || 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Egresos
                </CardTitle>
                <div className="bg-red-500/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">
                  {formatearMoneda(reporte?.total_egresos || 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Balance Total
                </CardTitle>
                <div className="bg-primary/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${
                  (reporte?.balance || 0) >= 0 ? 'text-primary' : 'text-destructive'
                }`}>
                  {formatearMoneda(reporte?.balance || 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Historial de Movimientos</CardTitle>
                  <CardDescription>
                    {reporte?.movimientos.length || 0} movimientos registrados
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!reporte?.movimientos.length ? (
                <div className="text-center py-12 space-y-4">
                  <div className="mx-auto w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-300">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      No hay movimientos registrados
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Los ingresos y egresos que registres aparecerán aquí
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {reporte.movimientos.map((movimiento, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg hover:scale-110 transition-transform duration-200 ${
                          movimiento.tipo === 'ingreso' 
                            ? 'bg-green-500/10' 
                            : 'bg-red-500/10'
                        }`}>
                          {movimiento.tipo === 'ingreso' ? (
                            <TrendingUp className="h-5 w-5 text-green-500" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {movimiento.concepto}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatearFecha(movimiento.fecha)}
                          </p>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${
                        movimiento.tipo === 'ingreso' 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {movimiento.tipo === 'ingreso' ? '+' : '-'}
                        {formatearMoneda(movimiento.monto)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}