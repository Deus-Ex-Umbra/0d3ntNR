import { useState, useEffect } from "react";
import { MenuLateral } from "@/componentes/MenuLateral";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { Button } from "@/componentes/ui/button";
import { Input } from "@/componentes/ui/input";
import { Label } from "@/componentes/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/componentes/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/componentes/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/componentes/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentes/ui/select";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Calendar,
  DollarSign,
  Clock,
  User,
  CheckCircle,
} from "lucide-react";
import { tratamientosApi, planesTratamientoApi, pacientesApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/componentes/ui/toaster";
import { Badge } from "@/componentes/ui/badge";

interface Tratamiento {
  id: number;
  nombre: string;
  numero_citas: number;
  costo_total: number;
}

interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
}

interface PlanTratamiento {
  id: number;
  costo_total: number;
  total_abonado: number;
  paciente: {
    id: number;
    nombre: string;
    apellidos: string;
  };
  tratamiento: {
    id: number;
    nombre: string;
    numero_citas: number;
  };
  citas: Array<{
    id: number;
    fecha: Date;
    descripcion: string;
  }>;
  pagos: Array<{
    id: number;
    fecha: Date;
    monto: number;
  }>;
}

export default function Tratamientos() {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [planes, setPlanes] = useState<PlanTratamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargando_planes, setCargandoPlanes] = useState(false);
  const [dialogo_plantilla_abierto, setDialogoPlantillaAbierto] =
    useState(false);
  const [dialogo_asignar_abierto, setDialogoAsignarAbierto] = useState(false);
  const [dialogo_detalle_plan_abierto, setDialogoDetallePlanAbierto] =
    useState(false);
  const [modo_edicion, setModoEdicion] = useState(false);
  const [tratamiento_seleccionado, setTratamientoSeleccionado] =
    useState<Tratamiento | null>(null);
  const [plan_seleccionado, setPlanSeleccionado] =
    useState<PlanTratamiento | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [paciente_filtro, setPacienteFiltro] = useState<string>("todos");

  const [formulario_plantilla, setFormularioPlantilla] = useState({
    nombre: "",
    numero_citas: "",
    costo_total: "",
  });

  const [formulario_asignar, setFormularioAsignar] = useState({
    paciente_id: "",
    tratamiento_id: "",
    fecha_inicio: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [datos_tratamientos, datos_pacientes] = await Promise.all([
        tratamientosApi.obtenerTodos(),
        pacientesApi.obtenerTodos(),
      ]);
      setTratamientos(datos_tratamientos);
      setPacientes(datos_pacientes);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  const cargarPlanes = async () => {
    setCargandoPlanes(true);
    try {
      const planes_totales: PlanTratamiento[] = [];

      for (const paciente of pacientes) {
        const planes_paciente = await planesTratamientoApi.obtenerPorPaciente(
          paciente.id
        );
        planes_totales.push(...planes_paciente);
      }

      setPlanes(planes_totales);
    } catch (error) {
      console.error("Error al cargar planes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los planes de tratamiento",
        variant: "destructive",
      });
    } finally {
      setCargandoPlanes(false);
    }
  };

  const abrirDialogoNuevo = () => {
    setFormularioPlantilla({
      nombre: "",
      numero_citas: "",
      costo_total: "",
    });
    setModoEdicion(false);
    setDialogoPlantillaAbierto(true);
  };

  const abrirDialogoEditar = (tratamiento: Tratamiento) => {
    setFormularioPlantilla({
      nombre: tratamiento.nombre,
      numero_citas: tratamiento.numero_citas.toString(),
      costo_total: tratamiento.costo_total.toString(),
    });
    setTratamientoSeleccionado(tratamiento);
    setModoEdicion(true);
    setDialogoPlantillaAbierto(true);
  };

  const manejarGuardarPlantilla = async () => {
    if (
      !formulario_plantilla.nombre ||
      !formulario_plantilla.numero_citas ||
      !formulario_plantilla.costo_total
    ) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    const numero_citas = parseInt(formulario_plantilla.numero_citas);
    const costo_total = parseFloat(formulario_plantilla.costo_total);

    if (
      isNaN(numero_citas) ||
      numero_citas <= 0 ||
      isNaN(costo_total) ||
      costo_total <= 0
    ) {
      toast({
        title: "Error",
        description: "Los valores numéricos deben ser mayores a 0",
        variant: "destructive",
      });
      return;
    }

    setGuardando(true);
    try {
      const datos = {
        nombre: formulario_plantilla.nombre,
        numero_citas,
        costo_total,
      };

      if (modo_edicion && tratamiento_seleccionado) {
        await tratamientosApi.actualizar(tratamiento_seleccionado.id, datos);
        toast({
          title: "Éxito",
          description: "Tratamiento actualizado correctamente",
        });
      } else {
        await tratamientosApi.crear(datos);
        toast({
          title: "Éxito",
          description: "Tratamiento creado correctamente",
        });
      }
      setDialogoPlantillaAbierto(false);
      cargarDatos();
    } catch (error: any) {
      console.error("Error al guardar tratamiento:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "No se pudo guardar el tratamiento",
        variant: "destructive",
      });
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta plantilla de tratamiento?"))
      return;

    try {
      await tratamientosApi.eliminar(id);
      toast({
        title: "Éxito",
        description: "Tratamiento eliminado correctamente",
      });
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar tratamiento:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el tratamiento",
        variant: "destructive",
      });
    }
  };

  const abrirDialogoAsignar = (tratamiento: Tratamiento) => {
    setFormularioAsignar({
      paciente_id: "",
      tratamiento_id: tratamiento.id.toString(),
      fecha_inicio: new Date().toISOString().split("T")[0],
    });
    setTratamientoSeleccionado(tratamiento);
    setDialogoAsignarAbierto(true);
  };

  const manejarAsignarTratamiento = async () => {
    if (
      !formulario_asignar.paciente_id ||
      !formulario_asignar.tratamiento_id ||
      !formulario_asignar.fecha_inicio
    ) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    setGuardando(true);
    try {
      await planesTratamientoApi.asignar({
        paciente_id: parseInt(formulario_asignar.paciente_id),
        tratamiento_id: parseInt(formulario_asignar.tratamiento_id),
        fecha_inicio: formulario_asignar.fecha_inicio,
      });
      toast({
        title: "Éxito",
        description: "Plan de tratamiento asignado correctamente",
      });
      setDialogoAsignarAbierto(false);
      cargarPlanes();
    } catch (error: any) {
      console.error("Error al asignar tratamiento:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "No se pudo asignar el tratamiento",
        variant: "destructive",
      });
    } finally {
      setGuardando(false);
    }
  };

  const verDetallePlan = (plan: PlanTratamiento) => {
    setPlanSeleccionado(plan);
    setDialogoDetallePlanAbierto(true);
  };

  const formatearMoneda = (monto: number): string => {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
    }).format(monto);
  };

  const formatearFecha = (fecha: Date): string => {
    return new Date(fecha).toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calcularProgreso = (plan: PlanTratamiento): number => {
    if (plan.costo_total === 0) return 0;
    return (plan.total_abonado / plan.costo_total) * 100;
  };

const planes_filtrados = paciente_filtro === 'todos' 
  ? planes.filter(p => p.paciente && p.tratamiento)
  : planes.filter(p => p.paciente?.id.toString() === paciente_filtro);

  if (cargando) {
    return (
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
        <MenuLateral />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Cargando tratamientos...</p>
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
                Tratamientos
              </h1>
              <p className="text-lg text-muted-foreground">
                Gestiona plantillas y planes de tratamiento
              </p>
            </div>

            <Button
              size="lg"
              className="shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-200"
              onClick={abrirDialogoNuevo}
            >
              <Plus className="h-5 w-5 mr-2" />
              Nueva Plantilla
            </Button>
          </div>

          <Tabs
            defaultValue="plantillas"
            className="w-full"
            onValueChange={(value) => {
              if (value === "planes") {
                cargarPlanes();
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-2 h-11">
              <TabsTrigger value="plantillas" className="text-base">
                Plantillas de Tratamiento
              </TabsTrigger>
              <TabsTrigger value="planes" className="text-base">
                Planes Asignados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plantillas" className="space-y-6 mt-6">
              <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        Plantillas de Tratamiento
                      </CardTitle>
                      <CardDescription>
                        {tratamientos.length} plantillas registradas
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {tratamientos.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="mx-auto w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          No hay plantillas registradas
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Crea plantillas de tratamientos comunes para agilizar
                          tu trabajo
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre del Tratamiento</TableHead>
                          <TableHead>Número de Citas</TableHead>
                          <TableHead>Costo Total</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tratamientos.map((tratamiento) => (
                          <TableRow
                            key={tratamiento.id}
                            className="hover:bg-secondary/50 transition-colors duration-200"
                          >
                            <TableCell className="font-medium">
                              {tratamiento.nombre}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {tratamiento.numero_citas} citas
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-green-500 font-semibold">
                                <DollarSign className="h-4 w-4" />
                                {formatearMoneda(tratamiento.costo_total)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => abrirDialogoAsignar(tratamiento)}
                                className="hover:bg-green-500/20 hover:text-green-500 hover:scale-110 transition-all duration-200"
                                title="Asignar a paciente"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => abrirDialogoEditar(tratamiento)}
                                className="hover:bg-primary/20 hover:text-primary hover:scale-110 transition-all duration-200"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => manejarEliminar(tratamiento.id)}
                                className="hover:bg-destructive/20 hover:text-destructive hover:scale-110 transition-all duration-200"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planes" className="space-y-6 mt-6">
              <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          Planes de Tratamiento Asignados
                        </CardTitle>
                        <CardDescription>
                          {planes_filtrados.length} planes activos
                        </CardDescription>
                      </div>
                    </div>
                    <div className="w-64">
                      <Select
                        value={paciente_filtro}
                        onValueChange={setPacienteFiltro}
                      >
                        <SelectTrigger className="hover:border-primary/50 transition-all duration-200">
                          <SelectValue placeholder="Filtrar por paciente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">
                            Todos los pacientes
                          </SelectItem>
                          {pacientes.map((paciente) => (
                            <SelectItem
                              key={paciente.id}
                              value={paciente.id.toString()}
                            >
                              {paciente.nombre} {paciente.apellidos}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {cargando_planes ? (
                    <div className="text-center py-12 space-y-4">
                      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                      <p className="text-muted-foreground">
                        Cargando planes...
                      </p>
                    </div>
                  ) : planes_filtrados.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="mx-auto w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-300">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          No hay planes de tratamiento asignados
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Asigna plantillas de tratamiento a tus pacientes desde
                          la pestaña de Plantillas
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {planes_filtrados.map((plan) => {
                        const progreso = calcularProgreso(plan);
                        const saldo_pendiente =
                          plan.costo_total - plan.total_abonado;

                        // Validación defensiva
                        if (!plan.paciente || !plan.tratamiento) {
                          console.warn("Plan con datos incompletos:", plan);
                          return null;
                        }

                        return (
                          <div
                            key={plan.id}
                            className="p-6 rounded-lg border-2 border-border bg-secondary/30 hover:bg-secondary/50 hover:scale-[1.02] hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => verDetallePlan(plan)}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <User className="h-5 w-5 text-primary" />
                                  <h3 className="text-lg font-bold text-foreground">
                                    {plan.paciente.nombre}{" "}
                                    {plan.paciente.apellidos}
                                  </h3>
                                </div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  {plan.tratamiento.nombre}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  progreso === 100 ? "default" : "secondary"
                                }
                                className="text-sm hover:scale-110 transition-transform duration-200"
                              >
                                {progreso === 100 ? (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                ) : null}
                                {progreso.toFixed(0)}% pagado
                              </Badge>
                            </div>

                            <div className="space-y-3">
                              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                                  style={{ width: `${progreso}%` }}
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">
                                    Costo Total
                                  </p>
                                  <p className="font-semibold text-foreground">
                                    {formatearMoneda(plan.costo_total)}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">
                                    Abonado
                                  </p>
                                  <p className="font-semibold text-green-500">
                                    {formatearMoneda(plan.total_abonado)}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">Saldo</p>
                                  <p
                                    className={`font-semibold ${saldo_pendiente > 0 ? "text-red-500" : "text-green-500"}`}
                                  >
                                    {formatearMoneda(saldo_pendiente)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {plan.citas?.length || 0} citas programadas
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {plan.pagos?.length || 0} pagos registrados
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog
        open={dialogo_plantilla_abierto}
        onOpenChange={setDialogoPlantillaAbierto}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {modo_edicion
                ? "Editar Plantilla de Tratamiento"
                : "Nueva Plantilla de Tratamiento"}
            </DialogTitle>
            <DialogDescription>
              {modo_edicion
                ? "Modifica la información de la plantilla"
                : "Crea una plantilla para tratamientos comunes"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Tratamiento *</Label>
              <Input
                id="nombre"
                value={formulario_plantilla.nombre}
                onChange={(e) =>
                  setFormularioPlantilla({
                    ...formulario_plantilla,
                    nombre: e.target.value,
                  })
                }
                placeholder="Ej: Endodoncia, Ortodoncia, Blanqueamiento"
                className="hover:border-primary/50 focus:border-primary transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero_citas">Número de Citas *</Label>
                <Input
                  id="numero_citas"
                  type="number"
                  min="1"
                  value={formulario_plantilla.numero_citas}
                  onChange={(e) =>
                    setFormularioPlantilla({
                      ...formulario_plantilla,
                      numero_citas: e.target.value,
                    })
                  }
                  placeholder="Ej: 25"
                  className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costo_total">Costo Total (Bs.) *</Label>
                <Input
                  id="costo_total"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formulario_plantilla.costo_total}
                  onChange={(e) =>
                    setFormularioPlantilla({
                      ...formulario_plantilla,
                      costo_total: e.target.value,
                    })
                  }
                  placeholder="Ej: 5000.00"
                  className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogoPlantillaAbierto(false)}
              disabled={guardando}
              className="hover:scale-105 transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button
              onClick={manejarGuardarPlantilla}
              disabled={guardando}
              className="hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-200"
            >
              {guardando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {modo_edicion ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogo_asignar_abierto}
        onOpenChange={setDialogoAsignarAbierto}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Asignar Plan de Tratamiento</DialogTitle>
            <DialogDescription>
              {tratamiento_seleccionado &&
                `Asignar "${tratamiento_seleccionado.nombre}" a un paciente`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paciente">Paciente *</Label>
              <Select
                value={formulario_asignar.paciente_id}
                onValueChange={(value) =>
                  setFormularioAsignar({
                    ...formulario_asignar,
                    paciente_id: value,
                  })
                }
              >
                <SelectTrigger className="hover:border-primary/50 focus:border-primary transition-all duration-200">
                  <SelectValue placeholder="Selecciona un paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((paciente) => (
                    <SelectItem
                      key={paciente.id}
                      value={paciente.id.toString()}
                    >
                      {paciente.nombre} {paciente.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formulario_asignar.fecha_inicio}
                onChange={(e) =>
                  setFormularioAsignar({
                    ...formulario_asignar,
                    fecha_inicio: e.target.value,
                  })
                }
                className="hover:border-primary/50 focus:border-primary transition-all duration-200"
              />
            </div>

            {tratamiento_seleccionado && (
              <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-2">
                <h4 className="font-semibold text-sm text-foreground">
                  Detalles del Tratamiento:
                </h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {tratamiento_seleccionado.numero_citas} citas programadas (1
                    por semana)
                  </p>
                  <p className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Costo total:{" "}
                    {formatearMoneda(tratamiento_seleccionado.costo_total)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogoAsignarAbierto(false)}
              disabled={guardando}
              className="hover:scale-105 transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button
              onClick={manejarAsignarTratamiento}
              disabled={guardando}
              className="hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-200"
            >
              {guardando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Asignar Tratamiento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogo_detalle_plan_abierto}
        onOpenChange={setDialogoDetallePlanAbierto}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle del Plan de Tratamiento</DialogTitle>
          </DialogHeader>

          {plan_seleccionado && (
            <div className="space-y-6">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {plan_seleccionado.paciente.nombre}{" "}
                  {plan_seleccionado.paciente.apellidos}
                </h3>
                <p className="text-muted-foreground">
                  {plan_seleccionado.tratamiento.nombre}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">
                      Costo Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {formatearMoneda(plan_seleccionado.costo_total)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">
                      Abonado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-500">
                      {formatearMoneda(plan_seleccionado.total_abonado)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">
                      Saldo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-500">
                      {formatearMoneda(
                        plan_seleccionado.costo_total -
                          plan_seleccionado.total_abonado
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="citas" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="citas">
                    Citas ({plan_seleccionado.citas.length})
                  </TabsTrigger>
                  <TabsTrigger value="pagos">
                    Pagos ({plan_seleccionado.pagos.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="citas" className="space-y-3 mt-4">
                  {plan_seleccionado.citas.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hay citas programadas
                    </p>
                  ) : (
                    plan_seleccionado.citas.map((cita) => (
                      <div
                        key={cita.id}
                        className="p-3 rounded-lg bg-secondary/30 border border-border"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{cita.descripcion}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatearFecha(cita.fecha)}
                            </p>
                          </div>
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="pagos" className="space-y-3 mt-4">
                  {plan_seleccionado.pagos.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hay pagos registrados
                    </p>
                  ) : (
                    plan_seleccionado.pagos.map((pago) => (
                      <div
                        key={pago.id}
                        className="p-3 rounded-lg bg-secondary/30 border border-border"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-green-500">
                              {formatearMoneda(pago.monto)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatearFecha(pago.fecha)}
                            </p>
                          </div>
                          <DollarSign className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
