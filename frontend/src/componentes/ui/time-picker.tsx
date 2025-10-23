import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utilidades"
import { Button } from "@/componentes/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/componentes/ui/popover"
import { Input } from "@/componentes/ui/input"
import { Label } from "@/componentes/ui/label"

interface TimePickerProps {
  valor?: string
  onChange: (hora: string) => void
  placeholder?: string
  className?: string
}

export function TimePicker({
  valor,
  onChange,
  placeholder = "Selecciona una hora",
  className,
}: TimePickerProps) {
  const [hora_interna, setHoraInterna] = React.useState<string>(valor || "09:00")

  React.useEffect(() => {
    if (valor) {
      setHoraInterna(valor)
    }
  }, [valor])

  const manejarCambioHora = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nueva_hora = e.target.value
    setHoraInterna(nueva_hora)
    onChange(nueva_hora)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal hover:border-primary/50 transition-all duration-200",
            !hora_interna && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {hora_interna ? <span>{hora_interna}</span> : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-2">
          <Label htmlFor="hora" className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Selecciona la hora
          </Label>
          <Input
            id="hora"
            type="time"
            value={hora_interna}
            onChange={manejarCambioHora}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}