import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utilidades"
import { Button } from "@/componentes/ui/button"
import { Calendar } from "@/componentes/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/componentes/ui/popover"
import { Input } from "@/componentes/ui/input"
import { Label } from "@/componentes/ui/label"

interface DateTimePickerProps {
  valor?: Date
  onChange: (fecha: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DateTimePicker({
  valor,
  onChange,
  placeholder = "Selecciona fecha y hora",
  className,
}: DateTimePickerProps) {
  const [fecha_seleccionada, setFechaSeleccionada] = React.useState<Date | undefined>(valor)
  const [hora, setHora] = React.useState<string>(
    valor ? format(valor, "HH:mm") : "09:00"
  )

  React.useEffect(() => {
    if (valor) {
      setFechaSeleccionada(valor)
      setHora(format(valor, "HH:mm"))
    }
  }, [valor])

  const manejarCambioFecha = (nueva_fecha: Date | undefined) => {
    if (nueva_fecha) {
      const [horas, minutos] = hora.split(':').map(Number)
      nueva_fecha.setHours(horas, minutos, 0, 0)
      setFechaSeleccionada(nueva_fecha)
      onChange(nueva_fecha)
    } else {
      setFechaSeleccionada(undefined)
      onChange(undefined)
    }
  }

  const manejarCambioHora = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nueva_hora = e.target.value
    setHora(nueva_hora)
    
    if (fecha_seleccionada && nueva_hora) {
      const [horas, minutos] = nueva_hora.split(':').map(Number)
      const nueva_fecha = new Date(fecha_seleccionada)
      nueva_fecha.setHours(horas, minutos, 0, 0)
      onChange(nueva_fecha)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal hover:border-primary/50 transition-all duration-200",
            !fecha_seleccionada && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {fecha_seleccionada ? (
            <>
              {format(fecha_seleccionada, "PPP", { locale: es })} - {hora}
            </>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={fecha_seleccionada}
          onSelect={manejarCambioFecha}
          initialFocus
          locale={es}
        />
        <div className="p-3 border-t border-border">
          <Label htmlFor="hora" className="text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Hora
          </Label>
          <Input
            id="hora"
            type="time"
            value={hora}
            onChange={manejarCambioHora}
            className="mt-2"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}