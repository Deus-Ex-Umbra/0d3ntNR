import { useState, useEffect } from 'react';
import { MenuLateral } from '@/componentes/MenuLateral';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { Textarea } from '@/componentes/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/componentes/ui/dialog';
import { DollarSign, TrendingUp, TrendingDown, Plus, Calendar, FileText, Loader2, AlertCircle, Edit, Trash2, X } from 'lucide-react';
import { finanzasApi, planesTratamientoApi, agendaApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/componentes/ui/toaster';
import { Combobox, OpcionCombobox } from '@/componentes/ui/combobox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/componentes/ui/tabs';
import { Badge } from '@/componentes/ui/badge';

interface Movimiento {
  id: number;
  tipo: 'ingreso' | 'egreso';
  fecha: Date;
  monto: number;
  concepto: string;
  cita_id?: number;
  plan_tratamiento_id?: number;
}

interface ReporteFinanzas {
  total_ingresos: number;
  total_egresos: number;
  balance: number;
  movimientos: Movimiento[];
}

interface PlanTratamiento {
  id: number;
  paciente: {
    nombre: string;
    apellidos: string;
  };
  tratamiento: {
    nombre: string;
  };
}

interface Cita {
  id: number;
  fecha: Date;
  descripcion: string;
  paciente?: {
    nombre: string;
    apellidos: string;
  };
  plan_tratamiento?: {
    id: number;
  };
}

export default function Finanzas() {
  const [reporte, setReporte] = useState<ReporteFinanzas | null>(null);
  const [cargando, setCargando] = useState(true);
  const [fecha_inicio, setFechaInicio] = useState('');
  const [fecha_fin, setFechaFin] = useState('');
  
  const [dialogo_ingreso_abierto, setDialogoIngresoAbierto] = useState(false);
  const [dialogo_egreso_abierto, setDialogoEgresoAbierto] = useState(false);
  const [dialogo_confirmar_eliminar_abierto, setDialogoConfirmarEliminarAbierto] = useState(false);
  const [guardando_ingreso, setGuardandoIngreso] = useState(false);
  const [guardando_egreso, setGuardandoEgreso] = useState(false);
  const [modo_edicion_ingreso, setModoEdicionIngreso] = useState(false);
  const [modo_edicion_egreso, setModoEdicionEgreso] = useState(false);
  const [movimiento_seleccionado, setMovimientoSeleccionado] = useState<Movimiento | null>(null);
  const [movimiento_a_eliminar, setMovimientoAEliminar] = useState<Movimiento | null>(null);
  
  const [planes_tratamiento, setPlanesTratamiento] = useState<PlanTratamiento[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando_datos, setCargandoDatos] = useState(false);

  const [formulario_ingreso, setFormularioIngreso] = useState({
    plan_tratamiento_id: '',
    cita_id: '',
    concepto: '',
    fecha: '',
    monto: '',
  });

  const [formulario_egreso, setFormularioEgreso] = useState({
    concepto: '',
    fecha: '',
    monto: '',
    cita_id: '',
  });

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

  const cargarDatosAdicionales = async () => {
    setCargandoDatos(true);
    try {
      const fecha_actual = new Date();
      const [datos_planes, datos_citas] = await Promise.all([
        planesTratamientoApi.obtenerTodos(),
        agendaApi.obtenerPorMes(fecha_actual.getMonth() + 1, fecha_actual.getFullYear()),
      ]);
      setPlanesTratamiento(datos_planes.filter((p: PlanTratamiento) => p.paciente && p.tratamiento));
      setCitas(datos_citas);
    } catch (error) {
      console.error('Error al cargar datos adicionales:', error);
    } finally {
      setCargandoDatos(false);
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

  const abrirDialogoIngreso = () => {
    setFormularioIngreso({
      plan_tratamiento_id: '',
      cita_id: '',
      concepto: '',
      fecha: new Date().toISOString().split('T')[0],
      monto: '',
    });
    setModoEdicionIngreso(false);
    setMovimientoSeleccionado(null);
    cargarDatosAdicionales();
    setDialogoIngresoAbierto(true);
  };

  const abrirDialogoEgreso = () => {
    setFormularioEgreso({
      concepto: '',
      fecha: new Date().toISOString().split('T')[0],
      monto: '',
      cita_id: '',
    });
    setModoEdicionEgreso(false);
    setMovimientoSeleccionado(null);
    cargarDatosAdicionales();
    setDialogoEgresoAbierto(true);
  };

  const abrirEditarIngreso = (movimiento: Movimiento) => {
    setFormularioIngreso({
      plan_tratamiento_id: movimiento.plan_tratamiento_id?.toString() || '',
      cita_id: movimiento.cita_id?.toString() || '',
      concepto: movimiento.concepto || '',
      fecha: new Date(movimiento.fecha).toISOString().split('T')[0],
      monto: movimiento.monto.toString(),
    });
    setModoEdicionIngreso(true);
    setMovimientoSeleccionado(movimiento);
    cargarDatosAdicionales();
    setDialogoIngresoAbierto(true);
  };

  const abrirEditarEgreso = (movimiento: Movimiento) => {
    setFormularioEgreso({
      concepto: movimiento.concepto || '',
      fecha: new Date(movimiento.fecha).toISOString().split('T')[0],
      monto: movimiento.monto.toString(),
      cita_id: movimiento.cita_id?.toString() || '',
    });
    setModoEdicionEgreso(true);
    setMovimientoSeleccionado(movimiento);
    cargarDatosAdicionales();
    setDialogoEgresoAbierto(true);
  };

  const manejarRegistrarIngreso = async () => {
    if (!formulario_ingreso.fecha || !formulario_ingreso.monto) {
      toast({
        title: 'Error',
        description: 'Fecha y monto son obligatorios',
        variant: 'destructive',
      });
      return;
    }

    const monto = parseFloat(formulario_ingreso.monto);
    if (isNaN(monto) || monto <= 0) {
      toast({
        title: 'Error',
        description: 'El monto debe ser un número positivo',
        variant: 'destructive',
      });
      return;
    }

    setGuardandoIngreso(true);
    try {
      if (modo_edicion_ingreso && movimiento_seleccionado) {
        const datos: any = {
          fecha: new Date(formulario_ingreso.fecha),
          monto,
          concepto: formulario_ingreso.concepto || 'Ingreso general',
        };

        await finanzasApi.actualizarPago(movimiento_seleccionado.id, datos);
        toast({
          title: 'Éxito',
          description: 'Ingreso actualizado correctamente',
        });
      } else {
        const datos: any = {
          fecha: new Date(formulario_ingreso.fecha),
          monto,
          concepto: formulario_ingreso.concepto || 'Ingreso general',
        };

        if (formulario_ingreso.plan_tratamiento_id) {
          datos.plan_tratamiento_id = parseInt(formulario_ingreso.plan_tratamiento_id);
        }

        if (formulario_ingreso.cita_id) {
          datos.cita_id = parseInt(formulario_ingreso.cita_id);
        }

        await finanzasApi.registrarPago(datos);
        toast({
          title: 'Éxito',
          description: 'Ingreso registrado correctamente',
        });
      }

      setDialogoIngresoAbierto(false);
      cargarReporte(fecha_inicio || undefined, fecha_fin || undefined);
    } catch (error: any) {
      console.error('Error al registrar ingreso:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo registrar el ingreso',
        variant: 'destructive',
      });
    } finally {
      setGuardandoIngreso(false);
    }
  };

  const manejarRegistrarEgreso = async () => {
    if (!formulario_egreso.concepto || !formulario_egreso.fecha || !formulario_egreso.monto) {
      toast({
        title: 'Error',
        description: 'Todos los campos son obligatorios',
        variant: 'destructive',
      });
      return;
    }

    const monto = parseFloat(formulario_egreso.monto);
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
      if (modo_edicion_egreso && movimiento_seleccionado) {
        const datos: any = {
          concepto: formulario_egreso.concepto,
          fecha: new Date(formulario_egreso.fecha),
          monto,
        };

        if (formulario_egreso.cita_id) {
          datos.cita_id = parseInt(formulario_egreso.cita_id);
        }

        await finanzasApi.actualizarEgreso(movimiento_seleccionado.id, datos);
        toast({
          title: 'Éxito',
          description: 'Egreso actualizado correctamente',
        });
      } else {
        const datos: any = {
          concepto: formulario_egreso.concepto,
          fecha: new Date(formulario_egreso.fecha),
          monto,
        };

        if (formulario_egreso.cita_id) {
          datos.cita_id = parseInt(formulario_egreso.cita_id);
        }

        await finanzasApi.registrarEgreso(datos);
        toast({
          title: 'Éxito',
          description: 'Egreso registrado correctamente',
        });
      }

      setDialogoEgresoAbierto(false);
      cargarReporte(fecha_inicio || undefined, fecha_fin || undefined);
    } catch (error: any) {
      console.error('Error al registrar egreso:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo registrar el egreso',
        variant: 'destructive',
      });
    } finally {
      setGuardandoEgreso(false);
    }
  };

  const abrirDialogoConfirmarEliminar = (movimiento: Movimiento) => {
    setMovimientoAEliminar(movimiento);
    setDialogoConfirmarEliminarAbierto(true);
  };

  const confirmarEliminarMovimiento = async () => {
    if (!movimiento_a_eliminar) return;

    try {
      if (movimiento_a_eliminar.tipo === 'ingreso') {
        await finanzasApi.eliminarPago(movimiento_a_eliminar.id);
      } else {
        await finanzasApi.eliminarEgreso(movimiento_a_eliminar.id);
      }

      toast({
        title: 'Éxito',
        description: `${movimiento_a_eliminar.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} eliminado correctamente`,
      });

      setDialogoConfirmarEliminarAbierto(false);
      setMovimientoAEliminar(null);
      cargarReporte(fecha_inicio || undefined, fecha_fin || undefined);
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el movimiento',
        variant: 'destructive',
      });
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

  const opciones_planes: OpcionCombobox[] = [
    { valor: '', etiqueta: 'Sin plan de tratamiento' },
    ...planes_tratamiento.map(p => ({
      valor: p.id.toString(),
      etiqueta: `${p.paciente.nombre} ${p.paciente.apellidos} - ${p.tratamiento.nombre}`
    }))
  ];

  const opciones_citas: OpcionCombobox[] = [
    { valor: '', etiqueta: 'Sin cita asociada' },
    ...citas.map(c => ({
      valor: c.id.toString(),
      etiqueta: `${formatearFecha(c.fecha)} - ${c.paciente ? `${c.paciente.nombre} ${c.paciente.apellidos}` : c.descripcion}`
    }))
  ];

  const opciones_citas_sin_plan: OpcionCombobox[] = [
    { valor: '', etiqueta: 'Sin cita asociada' },
    ...citas.filter(c => !c.plan_tratamiento).map(c => ({
      valor: c.id.toString(),
      etiqueta: `${formatearFecha(c.fecha)} - ${c.paciente ? `${c.paciente.nombre} ${c.paciente.apellidos}` : c.descripcion}`
    }))
  ];

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

            <div className="flex gap-2">
              <Dialog open={dialogo_ingreso_abierto} onOpenChange={setDialogoIngresoAbierto}>
                <DialogTrigger asChild>
                  <Button size="lg" onClick={abrirDialogoIngreso} className="shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transition-all duration-200 bg-green-600 hover:bg-green-700">
                    <Plus className="h-5 w-5 mr-2" />
                    Registrar Ingreso
                  </Button>
                </DialogTrigger>
              </Dialog>

              <Dialog open={dialogo_egreso_abierto} onOpenChange={setDialogoEgresoAbierto}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="destructive" onClick={abrirDialogoEgreso} className="shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105 transition-all duration-200">
                    <Plus className="h-5 w-5 mr-2" />
                    Registrar Egreso
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
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
                  {reporte.movimientos.map((movimiento) => (
                    <div
                      key={`${movimiento.tipo}-${movimiento.id}`}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
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
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {movimiento.concepto}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatearFecha(movimiento.fecha)}
                          </p>
                          {(movimiento.cita_id || movimiento.plan_tratamiento_id) && (
                            <div className="flex gap-2 mt-1">
                              {movimiento.cita_id && (
                                <Badge variant="outline" className="text-xs">
                                  Cita #{movimiento.cita_id}
                                </Badge>
                              )}
                              {movimiento.plan_tratamiento_id && (
                                <Badge variant="outline" className="text-xs">
                                  Plan #{movimiento.plan_tratamiento_id}
                                </Badge>
                              )}
                            </div>
                          )}
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
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => movimiento.tipo === 'ingreso' 
                            ? abrirEditarIngreso(movimiento) 
                            : abrirEditarEgreso(movimiento)
                          }
                          className="hover:bg-primary/20 hover:text-primary hover:scale-110 transition-all duration-200"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => abrirDialogoConfirmarEliminar(movimiento)}
                          className="hover:bg-destructive/20 hover:text-destructive hover:scale-110 transition-all duration-200"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={dialogo_ingreso_abierto} onOpenChange={setDialogoIngresoAbierto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {modo_edicion_ingreso ? 'Editar Ingreso' : 'Registrar Ingreso'}
            </DialogTitle>
            <DialogDescription>
              {modo_edicion_ingreso 
                ? 'Modifica los datos del ingreso'
                : 'Registra un pago o ingreso a tu consultorio'
              }
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="relacion" disabled={modo_edicion_ingreso}>
                Relación
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="concepto_ingreso">Concepto</Label>
                <Input
                  id="concepto_ingreso"
                  placeholder="Ej: Pago de consulta, Tratamiento completado"
                  value={formulario_ingreso.concepto}
                  onChange={(e) => setFormularioIngreso({ ...formulario_ingreso, concepto: e.target.value })}
                  className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha_ingreso">Fecha *</Label>
                  <Input
                    id="fecha_ingreso"
                    type="date"
                    value={formulario_ingreso.fecha}
                    onChange={(e) => setFormularioIngreso({ ...formulario_ingreso, fecha: e.target.value })}
                    className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monto_ingreso">Monto (Bs.) *</Label>
                  <Input
                    id="monto_ingreso"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formulario_ingreso.monto}
                    onChange={(e) => setFormularioIngreso({ ...formulario_ingreso, monto: e.target.value })}
                    className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              {modo_edicion_ingreso && movimiento_seleccionado && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    ⚠️ No se pueden cambiar las relaciones de un ingreso existente
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="relacion" className="space-y-4 mt-4">
              {cargando_datos ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Plan de Tratamiento (opcional)</Label>
                    <Combobox
                      opciones={opciones_planes}
                      valor={formulario_ingreso.plan_tratamiento_id}
                      onChange={(valor) => setFormularioIngreso({ ...formulario_ingreso, plan_tratamiento_id: valor })}
                      placeholder="Selecciona un plan"
                    />
                    <p className="text-xs text-muted-foreground">
                      Vincula este ingreso a un plan de tratamiento específico
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Cita Asociada (opcional)</Label>
                    <Combobox
                      opciones={opciones_citas}
                      valor={formulario_ingreso.cita_id}
                      onChange={(valor) => setFormularioIngreso({ ...formulario_ingreso, cita_id: valor })}
                      placeholder="Selecciona una cita"
                    />
                    <p className="text-xs text-muted-foreground">
                      Vincula este ingreso a una cita (se marcará como pagada automáticamente)
                    </p>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogoIngresoAbierto(false)}
              disabled={guardando_ingreso}
              className="hover:scale-105 transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button 
              onClick={manejarRegistrarIngreso} 
              disabled={guardando_ingreso}
              className="bg-green-600 hover:bg-green-700 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:scale-105 transition-all duration-200"
            >
              {guardando_ingreso && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {modo_edicion_ingreso ? 'Actualizar' : 'Registrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogo_egreso_abierto} onOpenChange={setDialogoEgresoAbierto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {modo_edicion_egreso ? 'Editar Egreso' : 'Registrar Egreso'}
            </DialogTitle>
            <DialogDescription>
              {modo_edicion_egreso 
                ? 'Modifica los datos del egreso'
                : 'Registra un gasto o egreso de tu consultorio'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="concepto_egreso">Concepto *</Label>
              <Textarea
                id="concepto_egreso"
                placeholder="Ej: Compra de materiales dentales"
                value={formulario_egreso.concepto}
                onChange={(e) => setFormularioEgreso({ ...formulario_egreso, concepto: e.target.value })}
                rows={3}
                className="hover:border-primary/50 focus:border-primary transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_egreso">Fecha *</Label>
                <Input
                  id="fecha_egreso"
                  type="date"
                  value={formulario_egreso.fecha}
                  onChange={(e) => setFormularioEgreso({ ...formulario_egreso, fecha: e.target.value })}
                  className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto_egreso">Monto (Bs.) *</Label>
                <Input
                  id="monto_egreso"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formulario_egreso.monto}
                  onChange={(e) => setFormularioEgreso({ ...formulario_egreso, monto: e.target.value })}
                  className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            {cargando_datos ? (
              <div className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Cita Asociada (opcional)</Label>
                <Combobox
                  opciones={opciones_citas_sin_plan}
                  valor={formulario_egreso.cita_id}
                  onChange={(valor) => setFormularioEgreso({ ...formulario_egreso, cita_id: valor })}
                  placeholder="Selecciona una cita"
                  disabled={modo_edicion_egreso}
                />
                <p className="text-xs text-muted-foreground">
                  Solo citas sin plan de tratamiento (se marcarán como canceladas)
                </p>
                {modo_edicion_egreso && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    ⚠️ No se puede cambiar la cita asociada de un egreso existente
                  </p>
                )}
              </div>
            )}
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
              variant="destructive"
              className="hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:scale-105 transition-all duration-200"
            >
              {guardando_egreso && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {modo_edicion_egreso ? 'Actualizar' : 'Registrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogo_confirmar_eliminar_abierto} onOpenChange={setDialogoConfirmarEliminarAbierto}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este {movimiento_a_eliminar?.tipo === 'ingreso' ? 'ingreso' : 'egreso'}?
            </DialogDescription>
          </DialogHeader>
          
          {movimiento_a_eliminar && (
            <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-2">
              <p className="font-semibold text-foreground">{movimiento_a_eliminar.concepto}</p>
              <p className="text-sm text-muted-foreground">
                {formatearFecha(movimiento_a_eliminar.fecha)}
              </p>
              <p className={`text-lg font-bold ${
                movimiento_a_eliminar.tipo === 'ingreso' ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatearMoneda(movimiento_a_eliminar.monto)}
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">
              Esta acción no se puede deshacer.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogoConfirmarEliminarAbierto(false);
                setMovimientoAEliminar(null);
              }}
              className="hover:scale-105 transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmarEliminarMovimiento}
              className="hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:scale-105 transition-all duration-200"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}