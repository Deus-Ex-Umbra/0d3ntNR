import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"

type PropiedadesProveedorTema = {
  children: ReactNode
  tema_por_defecto?: string
  clave_almacenamiento?: string
}

type EstadoProveedorTema = {
  tema: string
  establecerTema: (tema: string) => void
}

const estado_inicial: EstadoProveedorTema = {
  tema: "system",
  establecerTema: () => null,
}

const ContextoProveedorTema = createContext<EstadoProveedorTema>(estado_inicial)

export function ProveedorTema({
  children,
  tema_por_defecto = "system",
  clave_almacenamiento = "vite-ui-theme",
  ...props
}: PropiedadesProveedorTema) {
  const [tema, setTema] = useState(
    () => localStorage.getItem(clave_almacenamiento) || tema_por_defecto
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    if (tema === "system") {
      const tema_sistema = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.add(tema_sistema)
      return
    }
    root.classList.add(tema)
  }, [tema])

  const valor = {
    tema,
    establecerTema: (tema: string) => {
      localStorage.setItem(clave_almacenamiento, tema)
      setTema(tema)
    },
  }

  return (
    <ContextoProveedorTema.Provider {...props} value={valor}>
      {children}
    </ContextoProveedorTema.Provider>
  )
}

export const usarTema = () => {
  const contexto = useContext(ContextoProveedorTema)
  if (contexto === undefined)
    throw new Error("usarTema debe ser usado dentro de ProveedorTema")
  return contexto
}