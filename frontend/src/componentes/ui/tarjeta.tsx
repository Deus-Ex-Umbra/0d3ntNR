import * as React from "react"
import { cn } from "@/lib/utilidades"

const Tarjeta = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Tarjeta.displayName = "Tarjeta"

const EncabezadoTarjeta = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
EncabezadoTarjeta.displayName = "EncabezadoTarjeta"

const TituloTarjeta = React.forwardRef
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
TituloTarjeta.displayName = "TituloTarjeta"

const DescripcionTarjeta = React.forwardRef
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DescripcionTarjeta.displayName = "DescripcionTarjeta"

const ContenidoTarjeta = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
ContenidoTarjeta.displayName = "ContenidoTarjeta"

const PieTarjeta = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
PieTarjeta.displayName = "PieTarjeta"

export {
  Tarjeta,
  EncabezadoTarjeta,
  PieTarjeta,
  TituloTarjeta,
  DescripcionTarjeta,
  ContenidoTarjeta,
}