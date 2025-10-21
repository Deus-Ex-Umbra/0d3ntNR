import { useState, useEffect } from 'react';
import { MenuLateral } from '@/componentes/MenuLateral';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { Textarea } from '@/componentes/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/componentes/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/componentes/ui/tabs';
import { Badge } from '@/componentes/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/componentes/ui/table';
import { Users, Plus, Search, Edit, Trash2, Eye, Loader2, AlertCircle, UserCircle, Palette, MessageCircle } from 'lucide-react';
import { pacientesApi, catalogoApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/componentes/ui/toaster';
import { SelectConAgregar } from '@/componentes/ui/select-with-add';
import { GestorArchivos } from '@/componentes/archivos/gestor-archivos';
import { PhoneInput, formatearTelefonoCompleto, separarTelefono } from '@/componentes/ui/phone-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/componentes/ui/select';

interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  notas_generales?: string;
  alergias?: number[];
  enfermedades?: number[];
  medicamentos?: number[];
  notas_medicas?: string;
  color_categoria?: string;
}

interface ItemCatalogo {
  id: number;
  nombre: string;
  descripcion?: string;
  color?: string;
  activo: boolean;
}

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [dialogo_abierto, setDialogoAbierto] = useState(false);
  const [dialogo_ver_abierto, setDialogoVerAbierto] = useState(false);
  const [paciente_seleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [modo_edicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [catalogos, setCatalogos] = useState({
    alergias: [] as ItemCatalogo[],
    enfermedades: [] as ItemCatalogo[],
    medicamentos: [] as ItemCatalogo[],
    colores: [] as ItemCatalogo[],
  });

  const [formulario, setFormulario] = useState({
    nombre: '',
    apellidos: '',
    codigo_pais: '+591',
    numero_telefono: '',
    correo: '',
    direccion: '',
    notas_generales: '',
    alergias_ids: [] as number[],
    enfermedades_ids: [] as number[],
    medicamentos_ids: [] as number[],
    notas_medicas: '',
    color_categoria: '',
  });

  useEffect(() => {
    cargarDatos();
    cargarCatalogos();
  }, [busqueda]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const datos = await pacientesApi.obtenerTodos(busqueda);
      setPacientes(datos);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los pacientes',
        variant: 'destructive',
      });
    } finally {
      setCargando(false);
    }
  };

  const cargarCatalogos = async () => {
    try {
      const [alergias, enfermedades, medicamentos, colores] = await Promise.all([
        catalogoApi.obtenerAlergias(),
        catalogoApi.obtenerEnfermedades(),
        catalogoApi.obtenerMedicamentos(),
        catalogoApi.obtenerColores(),
      ]);
      setCatalogos({ alergias, enfermedades, medicamentos, colores });
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  };

  const abrirDialogoNuevo = () => {
    setFormulario({
      nombre: '',
      apellidos: '',
      codigo_pais: '+591',
      numero_telefono: '',
      correo: '',
      direccion: '',
      notas_generales: '',
      alergias_ids: [],
      enfermedades_ids: [],
      medicamentos_ids: [],
      notas_medicas: '',
      color_categoria: '',
    });
    setModoEdicion(false);
    setDialogoAbierto(true);
  };

  const abrirDialogoEditar = async (paciente: Paciente) => {
    try {
      const datos_completos = await pacientesApi.obtenerPorId(paciente.id);
      const { codigo_pais, numero } = separarTelefono(datos_completos.telefono || '');
      
      setFormulario({
        nombre: datos_completos.nombre,
        apellidos: datos_completos.apellidos,
        codigo_pais,
        numero_telefono: numero,
        correo: datos_completos.correo || '',
        direccion: datos_completos.direccion || '',
        notas_generales: datos_completos.notas_generales || '',
        alergias_ids: Array.isArray(datos_completos.alergias) ? datos_completos.alergias : [],
        enfermedades_ids: Array.isArray(datos_completos.enfermedades) ? datos_completos.enfermedades : [],
        medicamentos_ids: Array.isArray(datos_completos.medicamentos) ? datos_completos.medicamentos : [],
        notas_medicas: datos_completos.notas_medicas || '',
        color_categoria: datos_completos.color_categoria || '',
      });
      setPacienteSeleccionado(datos_completos);
      setModoEdicion(true);
      setDialogoAbierto(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar la información del paciente',
        variant: 'destructive',
      });
    }
  };

  const manejarGuardar = async () => {
    if (!formulario.nombre || !formulario.apellidos) {
      toast({
        title: 'Error',
        description: 'Nombre y apellidos son obligatorios',
        variant: 'destructive',
      });
      return;
    }

    setGuardando(true);
    try {
      const telefono_completo = formulario.numero_telefono 
        ? formatearTelefonoCompleto(formulario.codigo_pais, formulario.numero_telefono)
        : undefined;

      const datos: any = {
        nombre: formulario.nombre,
        apellidos: formulario.apellidos,
        telefono: telefono_completo,
        correo: formulario.correo || undefined,
        direccion: formulario.direccion || undefined,
        notas_generales: formulario.notas_generales || undefined,
        alergias_ids: formulario.alergias_ids,
        enfermedades_ids: formulario.enfermedades_ids,
        medicamentos_ids: formulario.medicamentos_ids,
        notas_medicas: formulario.notas_medicas || undefined,
        color_categoria: formulario.color_categoria || undefined,
      };

      if (modo_edicion && paciente_seleccionado) {
        await pacientesApi.actualizar(paciente_seleccionado.id, datos);
        toast({
          title: 'Éxito',
          description: 'Paciente actualizado correctamente',
        });
      } else {
        await pacientesApi.crear(datos);
        toast({
          title: 'Éxito',
          description: 'Paciente creado correctamente',
        });
      }
      setDialogoAbierto(false);
      cargarDatos();
    } catch (error: any) {
      console.error('Error al guardar paciente:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo guardar el paciente',
        variant: 'destructive',
      });
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este paciente?')) return;

    try {
      await pacientesApi.eliminar(id);
      toast({
        title: 'Éxito',
        description: 'Paciente eliminado correctamente',
      });
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el paciente',
        variant: 'destructive',
      });
    }
  };

  const verDetallePaciente = async (id: number) => {
    try {
      const datos = await pacientesApi.obtenerPorId(id);
      setPacienteSeleccionado(datos);
      setDialogoVerAbierto(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar el paciente',
        variant: 'destructive',
      });
    }
  };

  const obtenerColorInfo = (color_id: string) => {
    const color = catalogos.colores.find(c => c.color === color_id);
    return color || { nombre: 'Sin categoría', descripcion: '', color: color_id };
  };

  const abrirWhatsApp = (telefono: string) => {
    const telefono_limpio = telefono.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${telefono_limpio}`, '_blank');
  };

  const agregarAlergia = async (nombre: string) => {
    try {
      const nueva_alergia = await catalogoApi.crearAlergia({ nombre });
      await cargarCatalogos();
      setFormulario({
        ...formulario,
        alergias_ids: [...formulario.alergias_ids, nueva_alergia.id]
      });
      toast({
        title: 'Éxito',
        description: 'Alergia agregada al catálogo',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar la alergia',
        variant: 'destructive',
      });
    }
  };

  const agregarEnfermedad = async (nombre: string) => {
    try {
      const nueva_enfermedad = await catalogoApi.crearEnfermedad({ nombre });
      await cargarCatalogos();
      setFormulario({
        ...formulario,
        enfermedades_ids: [...formulario.enfermedades_ids, nueva_enfermedad.id]
      });
      toast({
        title: 'Éxito',
        description: 'Enfermedad agregada al catálogo',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar la enfermedad',
        variant: 'destructive',
      });
    }
  };

  const agregarMedicamento = async (nombre: string) => {
    try {
      const nuevo_medicamento = await catalogoApi.crearMedicamento({ nombre });
      await cargarCatalogos();
      setFormulario({
        ...formulario,
        medicamentos_ids: [...formulario.medicamentos_ids, nuevo_medicamento.id]
      });
      toast({
        title: 'Éxito',
        description: 'Medicamento agregado al catálogo',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar el medicamento',
        variant: 'destructive',
      });
    }
  };

  const toggleAlergia = (id: number) => {
    setFormulario(prev => ({
      ...prev,
      alergias_ids: prev.alergias_ids.includes(id)
        ? prev.alergias_ids.filter(a => a !== id)
        : [...prev.alergias_ids, id]
    }));
  };

  const toggleEnfermedad = (id: number) => {
    setFormulario(prev => ({
      ...prev,
      enfermedades_ids: prev.enfermedades_ids.includes(id)
        ? prev.enfermedades_ids.filter(e => e !== id)
        : [...prev.enfermedades_ids, id]
    }));
  };

  const toggleMedicamento = (id: number) => {
    setFormulario(prev => ({
      ...prev,
      medicamentos_ids: prev.medicamentos_ids.includes(id)
        ? prev.medicamentos_ids.filter(m => m !== id)
        : [...prev.medicamentos_ids, id]
    }));
  };

  const obtenerAlergiasPorIds = (ids: number[]) => {
    if (!Array.isArray(ids)) return [];
    return ids.map(id => catalogos.alergias.find(a => a.id === id)).filter(Boolean) as ItemCatalogo[];
  };

  const obtenerEnfermedadesPorIds = (ids: number[]) => {
    if (!Array.isArray(ids)) return [];
    return ids.map(id => catalogos.enfermedades.find(e => e.id === id)).filter(Boolean) as ItemCatalogo[];
  };

  const obtenerMedicamentosPorIds = (ids: number[]) => {
    if (!Array.isArray(ids)) return [];
    return ids.map(id => catalogos.medicamentos.find(m => m.id === id)).filter(Boolean) as ItemCatalogo[];
  };

  if (cargando && pacientes.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
        <MenuLateral />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Cargando pacientes...</p>
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
                Pacientes
              </h1>
              <p className="text-lg text-muted-foreground">
                Gestiona la información de tus pacientes
              </p>
            </div>

            <Button size="lg" className="shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-200" onClick={abrirDialogoNuevo}>
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Paciente
            </Button>
          </div>

          <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Búsqueda de Pacientes</CardTitle>
                  <CardDescription>Busca por nombre, apellidos o ID</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Buscar paciente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="h-11 hover:border-primary/50 focus:border-primary transition-all duration-200"
              />
            </CardContent>
          </Card>

          <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Lista de Pacientes</CardTitle>
                  <CardDescription>{pacientes.length} pacientes registrados</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {pacientes.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="mx-auto w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-300">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      No hay pacientes registrados
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Comienza creando tu primer paciente usando el botón "Nuevo Paciente"
                    </p>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Nombre Completo</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pacientes.map((paciente) => (
                      <TableRow key={paciente.id} className="hover:bg-secondary/50 transition-colors duration-200">
                        <TableCell>
                          {paciente.color_categoria && (
                            <div
                              className="w-4 h-4 rounded-full hover:scale-125 transition-transform duration-200 cursor-help"
                              style={{ backgroundColor: paciente.color_categoria }}
                              title={obtenerColorInfo(paciente.color_categoria).descripcion || obtenerColorInfo(paciente.color_categoria).nombre}
                            />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {paciente.nombre} {paciente.apellidos}
                        </TableCell>
                        <TableCell>
                          {paciente.telefono ? (
                            <div className="flex items-center gap-2">
                              <span>{paciente.telefono}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-green-500/20 hover:text-green-500 transition-all"
                                onClick={() => abrirWhatsApp(paciente.telefono!)}
                                title="Abrir WhatsApp"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>{paciente.correo || '-'}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => verDetallePaciente(paciente.id)}
                            className="hover:bg-primary/20 hover:text-primary hover:scale-110 transition-all duration-200"
                            title="Ver detalle"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => abrirDialogoEditar(paciente)}
                            className="hover:bg-blue-500/20 hover:text-blue-500 hover:scale-110 transition-all duration-200"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => manejarEliminar(paciente.id)}
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
        </div>
      </div>

      <Dialog open={dialogo_abierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modo_edicion ? 'Editar Paciente' : 'Nuevo Paciente'}
            </DialogTitle>
            <DialogDescription>
              {modo_edicion 
                ? 'Modifica la información del paciente' 
                : 'Completa los datos del nuevo paciente'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="datos-generales" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="datos-generales">Datos Generales</TabsTrigger>
              <TabsTrigger value="anamnesis">Anamnesis</TabsTrigger>
            </TabsList>

            <TabsContent value="datos-generales" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formulario.nombre}
                    onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                    placeholder="Juan"
                    className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    value={formulario.apellidos}
                    onChange={(e) => setFormulario({ ...formulario, apellidos: e.target.value })}
                    placeholder="Pérez López"
                    className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <PhoneInput
                  codigo_pais={formulario.codigo_pais}
                  numero={formulario.numero_telefono}
                  onCodigoPaisChange={(codigo) => setFormulario({ ...formulario, codigo_pais: codigo })}
                  onNumeroChange={(numero) => setFormulario({ ...formulario, numero_telefono: numero })}
                  placeholder="70123456"
                />

                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Electrónico</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={formulario.correo}
                    onChange={(e) => setFormulario({ ...formulario, correo: e.target.value })}
                    placeholder="paciente@email.com"
                    className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formulario.direccion}
                  onChange={(e) => setFormulario({ ...formulario, direccion: e.target.value })}
                  placeholder="Calle Principal #123"
                  className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas_generales">Notas Generales</Label>
                <Textarea
                  id="notas_generales"
                  value={formulario.notas_generales}
                  onChange={(e) => setFormulario({ ...formulario, notas_generales: e.target.value })}
                  placeholder="Notas adicionales sobre el paciente..."
                  rows={3}
                  className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label>Color de Categoría</Label>
                <Select
                  value={formulario.color_categoria}
                  onValueChange={(valor) => setFormulario({ ...formulario, color_categoria: valor })}
                >
                  <SelectTrigger className="hover:border-primary/50 focus:border-primary transition-all duration-200">
                    <SelectValue placeholder="Seleccionar color de categoría">
                      {formulario.color_categoria && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: formulario.color_categoria }}
                          />
                          <span>{obtenerColorInfo(formulario.color_categoria).nombre}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      <span className="text-muted-foreground">Sin categoría</span>
                    </SelectItem>
                    {catalogos.colores.filter(c => c.color).map((color) => (
                      <SelectItem key={color.id} value={color.color!}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color.color! }}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{color.nombre}</p>
                            {color.descripcion && (
                              <p className="text-xs text-muted-foreground">{color.descripcion}</p>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Puedes agregar más colores en Configuración → Catálogos
                </p>
              </div>
            </TabsContent>

            <TabsContent value="anamnesis" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Alergias</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formulario.alergias_ids.map((id) => {
                    const alergia = catalogos.alergias.find(a => a.id === id);
                    return alergia ? (
                      <Badge
                        key={id}
                        variant="destructive"
                        className="cursor-pointer hover:bg-destructive/80 transition-all duration-200"
                        onClick={() => toggleAlergia(id)}
                      >
                        {alergia.nombre} ×
                      </Badge>
                    ) : null;
                  })}
                </div>
                <SelectConAgregar
                  opciones={catalogos.alergias.map(a => ({ valor: a.id.toString(), etiqueta: a.nombre }))}
                  valor=""
                  onChange={(valor) => {
                    if (valor) toggleAlergia(parseInt(valor));
                  }}
                  onAgregarNuevo={agregarAlergia}
                  placeholder="Seleccionar alergia"
                  textoAgregar="+ Agregar nueva alergia"
                  tituloModal="Agregar Nueva Alergia"
                  descripcionModal="Ingresa el nombre de la alergia"
                  placeholderInput="Ej: Penicilina"
                />
              </div>

              <div className="space-y-2">
                <Label>Enfermedades Preexistentes</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formulario.enfermedades_ids.map((id) => {
                    const enfermedad = catalogos.enfermedades.find(e => e.id === id);
                    return enfermedad ? (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80 hover:text-destructive transition-all duration-200"
                        onClick={() => toggleEnfermedad(id)}
                      >
                        {enfermedad.nombre} ×
                      </Badge>
                    ) : null;
                  })}
                </div>
                <SelectConAgregar
                  opciones={catalogos.enfermedades.map(e => ({ valor: e.id.toString(), etiqueta: e.nombre }))}
                  valor=""
                  onChange={(valor) => {
                    if (valor) toggleEnfermedad(parseInt(valor));
                  }}
                  onAgregarNuevo={agregarEnfermedad}
                  placeholder="Seleccionar enfermedad"
                  textoAgregar="+ Agregar nueva enfermedad"
                  tituloModal="Agregar Nueva Enfermedad"
                  descripcionModal="Ingresa el nombre de la enfermedad"
                  placeholderInput="Ej: Diabetes"
                />
              </div>

              <div className="space-y-2">
                <Label>Medicamentos Actuales</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formulario.medicamentos_ids.map((id) => {
                    const medicamento = catalogos.medicamentos.find(m => m.id === id);
                    return medicamento ? (
                      <Badge
                        key={id}
                        className="cursor-pointer hover:bg-primary/80 transition-all duration-200"
                        onClick={() => toggleMedicamento(id)}
                      >
                        {medicamento.nombre} ×
                      </Badge>
                    ) : null;
                  })}
                </div>
                <SelectConAgregar
                  opciones={catalogos.medicamentos.map(m => ({ valor: m.id.toString(), etiqueta: m.nombre }))}
                  valor=""
                  onChange={(valor) => {
                    if (valor) toggleMedicamento(parseInt(valor));
                  }}
                  onAgregarNuevo={agregarMedicamento}
                  placeholder="Seleccionar medicamento"
                  textoAgregar="+ Agregar nuevo medicamento"
                  tituloModal="Agregar Nuevo Medicamento"
                  descripcionModal="Ingresa el nombre del medicamento"
                  placeholderInput="Ej: Aspirina"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas_medicas">Notas Médicas Importantes</Label>
                <Textarea
                  id="notas_medicas"
                  value={formulario.notas_medicas}
                  onChange={(e) => setFormulario({ ...formulario, notas_medicas: e.target.value })}
                  placeholder="Otras notas médicas relevantes..."
                  rows={3}
                  className="hover:border-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogoAbierto(false)}
              disabled={guardando}
              className="hover:scale-105 transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button 
              onClick={manejarGuardar} 
              disabled={guardando}
              className="hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-200"
            >
              {guardando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {modo_edicion ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogo_ver_abierto} onOpenChange={setDialogoVerAbierto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="h-6 w-6" />
              Detalle del Paciente
            </DialogTitle>
          </DialogHeader>

          {paciente_seleccionado && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors duration-200">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {paciente_seleccionado.nombre.charAt(0)}{paciente_seleccionado.apellidos.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground">
                    {paciente_seleccionado.nombre} {paciente_seleccionado.apellidos}
                  </h3>
                  {paciente_seleccionado.color_categoria && (
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: paciente_seleccionado.color_categoria }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {obtenerColorInfo(paciente_seleccionado.color_categoria).nombre}
                        {obtenerColorInfo(paciente_seleccionado.color_categoria).descripcion && 
                          ` • ${obtenerColorInfo(paciente_seleccionado.color_categoria).descripcion}`
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Tabs defaultValue="contacto" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="contacto">Contacto</TabsTrigger>
                  <TabsTrigger value="medico">Información Médica</TabsTrigger>
                  <TabsTrigger value="archivos">Archivos</TabsTrigger>
                </TabsList>

                <TabsContent value="contacto" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground">Teléfono</Label>
                      {paciente_seleccionado.telefono ? (
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-foreground font-medium">
                            {paciente_seleccionado.telefono}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => abrirWhatsApp(paciente_seleccionado.telefono!)}
                            className="h-8 hover:bg-green-500/20 hover:text-green-500 transition-all"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                        </div>
                      ) : (
                        <p className="text-foreground font-medium">No registrado</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Correo</Label>
                      <p className="text-foreground font-medium">
                        {paciente_seleccionado.correo || 'No registrado'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Dirección</Label>
                      <p className="text-foreground font-medium">
                        {paciente_seleccionado.direccion || 'No registrada'}
                      </p>
                    </div>
                    {paciente_seleccionado.notas_generales && (
                      <div>
                        <Label className="text-muted-foreground">Notas Generales</Label>
                        <p className="text-foreground font-medium whitespace-pre-wrap">
                          {paciente_seleccionado.notas_generales}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="medico" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    {paciente_seleccionado.alergias && paciente_seleccionado.alergias.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Alergias</Label>
                        <div className="flex flex-wrap gap-2">
                          {obtenerAlergiasPorIds(paciente_seleccionado.alergias).map((alergia) => (
                            <Badge key={alergia.id} variant="destructive">
                              {alergia.nombre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {paciente_seleccionado.enfermedades && paciente_seleccionado.enfermedades.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Enfermedades Preexistentes</Label>
                        <div className="flex flex-wrap gap-2">
                          {obtenerEnfermedadesPorIds(paciente_seleccionado.enfermedades).map((enfermedad) => (
                            <Badge key={enfermedad.id} variant="secondary">
                              {enfermedad.nombre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {paciente_seleccionado.medicamentos && paciente_seleccionado.medicamentos.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Medicamentos Actuales</Label>
                        <div className="flex flex-wrap gap-2">
                          {obtenerMedicamentosPorIds(paciente_seleccionado.medicamentos).map((medicamento) => (
                            <Badge key={medicamento.id}>
                              {medicamento.nombre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {paciente_seleccionado.notas_medicas && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Notas Médicas</Label>
                        <div className="p-3 rounded-lg bg-secondary/30">
                          <p className="text-foreground font-medium whitespace-pre-wrap">
                            {paciente_seleccionado.notas_medicas}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {(!paciente_seleccionado.alergias || paciente_seleccionado.alergias.length === 0) &&
                     (!paciente_seleccionado.enfermedades || paciente_seleccionado.enfermedades.length === 0) &&
                     (!paciente_seleccionado.medicamentos || paciente_seleccionado.medicamentos.length === 0) &&
                     !paciente_seleccionado.notas_medicas && (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center mb-3">
                          <AlertCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">
                          No hay información médica registrada
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="archivos" className="space-y-4 mt-4">
                  <GestorArchivos 
                    paciente_id={paciente_seleccionado.id} 
                    modo="paciente"
                  />
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