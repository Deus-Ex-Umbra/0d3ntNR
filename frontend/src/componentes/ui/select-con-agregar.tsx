import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/componentes/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/componentes/ui/dialog';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { Plus } from 'lucide-react';

interface OpcionSelect {
  valor: string;
  etiqueta: string;
}

interface PropiedadesSelectConAgregar {
  opciones: OpcionSelect[];
  valor?: string;
  placeholder?: string;
  etiqueta?: string;
  alCambiar: (valor: string) => void;
  alAgregarNuevo: (etiqueta: string) => Promise<string>;
  titulo_modal?: string;
  descripcion_modal?: string;
  placeholder_input?: string;
  etiqueta_input?: string;
}

export function SelectConAgregar({
  opciones,
  valor,
  placeholder = 'Selecciona una opción',
  etiqueta,
  alCambiar,
  alAgregarNuevo,
  titulo_modal = 'Agregar nueva opción',
  descripcion_modal = 'Ingresa el nombre de la nueva opción',
  placeholder_input = 'Nombre',
  etiqueta_input = 'Nombre',
}: PropiedadesSelectConAgregar) {
  const [modal_abierto, setModalAbierto] = useState(false);
  const [nuevo_valor, setNuevoValor] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function manejarGuardar() {
    if (!nuevo_valor.trim()) return;

    setGuardando(true);
    try {
      const id = await alAgregarNuevo(nuevo_valor.trim());
      alCambiar(id);
      setModalAbierto(false);
      setNuevoValor('');
    } catch (error) {
      console.error('Error al agregar opción:', error);
    } finally {
      setGuardando(false);
    }
  }

  function manejarCambioSelect(nuevo_valor: string) {
    if (nuevo_valor === '__agregar_nuevo__') {
      setModalAbierto(true);
    } else {
      alCambiar(nuevo_valor);
    }
  }

  return (
    <>
      <div className="space-y-2">
        {etiqueta && (
          <Label className="text-sm font-medium">{etiqueta}</Label>
        )}
        <Select value={valor} onValueChange={manejarCambioSelect}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {opciones.map((opcion) => (
              <SelectItem key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </SelectItem>
            ))}
            <SelectItem
              value="__agregar_nuevo__"
              className="text-blue-600 font-medium"
            >
              <div className="flex items-center gap-2">
                <Plus size={16} />
                <span>Agregar nuevo...</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog open={modal_abierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{titulo_modal}</DialogTitle>
            <DialogDescription>{descripcion_modal}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nuevo_valor">{etiqueta_input}</Label>
              <Input
                id="nuevo_valor"
                value={nuevo_valor}
                onChange={(e) => setNuevoValor(e.target.value)}
                placeholder={placeholder_input}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    manejarGuardar();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setModalAbierto(false);
                setNuevoValor('');
              }}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button onClick={manejarGuardar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}