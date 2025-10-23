import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ajustarFechaParaBackend(fecha: Date): Date {
  const anio = fecha.getFullYear();
  const mes = fecha.getMonth();
  const dia = fecha.getDate();
  const horas = fecha.getHours();
  const minutos = fecha.getMinutes();
  const segundos = fecha.getSeconds();
  
  return new Date(anio, mes, dia, horas, minutos, segundos);
}