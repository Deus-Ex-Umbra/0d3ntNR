import { useState, useEffect } from 'react';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { Textarea } from '@/componentes/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/componentes/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/componentes/ui/card';
import { FileText, Upload, Download, Trash2, Edit, Loader2, AlertCircle, Eye } from 'lucide-react';
import { archivosApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/componentes/ui/badge';

interface ArchivoAdjunto {
  id: number;
  nombre_archivo: string;
  tipo_mime: string;
  descripcion?: string;
  contenido_base64: string;
  fecha_subida: Date;
}

interface GestorArchivosProps {
  paciente_id: number;
  plan_tratamiento_id?: number;
  modo?: 'paciente' | 'plan';
}

export function GestorArchivos({ paciente_id, plan_tratamiento_id, modo = 'paciente' }: GestorArchivosProps) {
  const [archivos, setArchivos] = useState<ArchivoAdjunto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [dialogo_subir_abierto, setDialogoSubirAbierto] = useState(false);
  const [dialogo_editar_abierto, setDialogoEditarAbierto] = useState(false);
  const [dialogo_ver_abierto, setDialogoVerAbierto] = useState(false);
  const [archivo_seleccionado, setArchivoSeleccionado] = useState<ArchivoAdjunto | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre_archivo: '',
    descripcion: '',
    archivo: null as File | null,
  });

  const [formulario_editar, setFormularioEditar] = useState({
    nombre_archivo: '',
    descripcion: '',
  });

  useEffect(() => {
    cargarArchivos();
  }, [paciente_id, plan_tratamiento_id, modo]);

  const cargarArchivos = async () => {
    setCargando(true);
    try {
      let datos;
      if (modo === 'plan' && plan_tratamiento_id) {
        datos = await archivosApi.obtenerPorPlan(plan_tratamiento_id);
      } else {
        datos = await archivosApi.obtenerPorPaciente(paciente_id);
      }
      setArchivos(datos);
    } catch (error) {
      console.error('Error al cargar archivos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los archivos',
        variant: 'destructive',
      });
    } finally {
      setCargando(false);
    }
  };

  const manejarSeleccionArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      if (archivo.size > 10 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'El archivo no debe superar los 10MB',
          variant: 'destructive',
        });
        return;
      }
      setFormulario({
        ...formulario,
        archivo,
        nombre_archivo: archivo.name,
      });
    }
  };

  const manejarSubir = async () => {
    if (!formulario.archivo) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar un archivo',
        variant: 'destructive',
      });
      return;
    }

    setSubiendo(true);
    try {
      const lector = new FileReader();
      lector.onload = async () => {
        const base64 = (lector.result as string).split(',')[1];
        
        await archivosApi.subir({
          nombre_archivo: formulario.nombre_archivo,
          tipo_mime: formulario.archivo!.type,
          descripcion: formulario.descripcion || undefined,
          contenido_base64: base64,
          paciente_id,
          plan_tratamiento_id,
        });

        toast({
          title: 'Éxito',
          description: 'Archivo subido correctamente',
        });

        setDialogoSubirAbierto(false);
        setFormulario({
          nombre_archivo: '',
          descripcion: '',
          archivo: null,
        });
        cargarArchivos();
      };
      lector.readAsDataURL(formulario.archivo);
    } catch (error: any) {
      console.error('Error al subir archivo:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo subir el archivo',
        variant: 'destructive',
      });
    } finally {
      setSubiendo(false);
    }
  };

  const abrirDialogoEditar = (archivo: ArchivoAdjunto) => {
    setArchivoSeleccionado(archivo);
    setFormularioEditar({
      nombre_archivo: archivo.nombre_archivo,
      descripcion: archivo.descripcion || '',
    });
    setDialogoEditarAbierto(true);
  };

  const manejarEditar = async () => {
    if (!archivo_seleccionado) return;

    try {
      await archivosApi.actualizar(archivo_seleccionado.id, formulario_editar);
      toast({
        title: 'Éxito',
        description: 'Archivo actualizado correctamente',
      });
      setDialogoEditarAbierto(false);
      cargarArchivos();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el archivo',
        variant: 'destructive',
      });
    }
  };

  const manejarEliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return;

    try {
      await archivosApi.eliminar(id);
      toast({
        title: 'Éxito',
        description: 'Archivo eliminado correctamente',
      });
      cargarArchivos();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el archivo',
        variant: 'destructive',
      });
    }
  };

  const manejarDescargar = (archivo: ArchivoAdjunto) => {
    const link = document.createElement('a');
    link.href = `data:${archivo.tipo_mime};base64,${archivo.contenido_base64}`;
    link.download = archivo.nombre_archivo;
    link.click();
  };

  const verArchivo = (archivo: ArchivoAdjunto) => {
    setArchivoSeleccionado(archivo);
    setDialogoVerAbierto(true);
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

  const obtenerIconoTipo = (tipo_mime: string) => {
    if (tipo_mime.startsWith('image/')) return '🖼️';
    if (tipo_mime.startsWith('application/pdf')) return '📄';
    if (tipo_mime.startsWith('application/vnd')) return '📊';
    return '📎';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Archivos Adjuntos</h3>
            <p className="text-sm text-muted-foreground">{archivos.length} archivos</p>
          </div>
        </div>
        <Button
          onClick={() => setDialogoSubirAbierto(true)}
          size="sm"
          className="hover:scale-105 transition-all duration-200"
        >
          <Upload className="h-4 w-4 mr-2" />
          Subir Archivo
        </Button>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : archivos.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No hay archivos adjuntos
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {archivos.map((archivo) => (
            <Card key={archivo.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-3xl">{obtenerIconoTipo(archivo.tipo_mime)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{archivo.nombre_archivo}</p>
                      {archivo.descripcion && (
                        <p className="text-sm text-muted-foreground truncate">
                          {archivo.descripcion}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatearFecha(archivo.fecha_subida)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {archivo.tipo_mime.startsWith('image/') && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => verArchivo(archivo)}
                        className="hover:bg-primary/20 hover:text-primary"
                        title="Ver"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => manejarDescargar(archivo)}
                      className="hover:bg-blue-500/20 hover:text-blue-500"
                      title="Descargar"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => abrirDialogoEditar(archivo)}
                      className="hover:bg-yellow-500/20 hover:text-yellow-500"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => manejarEliminar(archivo.id, archivo.nombre_archivo)}
                      className="hover:bg-destructive/20 hover:text-destructive"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogo_subir_abierto} onOpenChange={setDialogoSubirAbierto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Subir Archivo</DialogTitle>
            <DialogDescription>
              Adjunta un archivo al {modo === 'plan' ? 'plan de tratamiento' : 'paciente'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="archivo">Archivo *</Label>
              <Input
                id="archivo"
                type="file"
                onChange={manejarSeleccionArchivo}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Tamaño máximo: 10MB
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del archivo *</Label>
              <Input
                id="nombre"
                value={formulario.nombre_archivo}
                onChange={(e) => setFormulario({ ...formulario, nombre_archivo: e.target.value })}
                placeholder="documento.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción (opcional)</Label>
              <Textarea
                id="descripcion"
                value={formulario.descripcion}
                onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
                placeholder="Radiografía panorámica..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogoSubirAbierto(false)}
              disabled={subiendo}
            >
              Cancelar
            </Button>
            <Button onClick={manejarSubir} disabled={subiendo}>
              {subiendo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Subir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogo_editar_abierto} onOpenChange={setDialogoEditarAbierto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Archivo</DialogTitle>
            <DialogDescription>
              Modifica los metadatos del archivo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre-editar">Nombre del archivo</Label>
              <Input
                id="nombre-editar"
                value={formulario_editar.nombre_archivo}
                onChange={(e) => setFormularioEditar({ ...formulario_editar, nombre_archivo: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion-editar">Descripción</Label>
              <Textarea
                id="descripcion-editar"
                value={formulario_editar.descripcion}
                onChange={(e) => setFormularioEditar({ ...formulario_editar, descripcion: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogoEditarAbierto(false)}
            >
              Cancelar
            </Button>
            <Button onClick={manejarEditar}>
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogo_ver_abierto} onOpenChange={setDialogoVerAbierto}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{archivo_seleccionado?.nombre_archivo}</DialogTitle>
          </DialogHeader>
          {archivo_seleccionado && archivo_seleccionado.tipo_mime.startsWith('image/') && (
            <div className="flex items-center justify-center p-4">
              <img
                src={`data:${archivo_seleccionado.tipo_mime};base64,${archivo_seleccionado.contenido_base64}`}
                alt={archivo_seleccionado.nombre_archivo}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}