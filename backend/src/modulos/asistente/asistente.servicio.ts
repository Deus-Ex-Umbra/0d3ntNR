import { Injectable } from '@nestjs/common';
import { GeminiServicio } from '../gemini/gemini.servicio';
import { NotasServicio } from '../notas/notas.servicio';

@Injectable()
export class AsistenteServicio {
  constructor(
    private readonly gemini_servicio: GeminiServicio,
    private readonly notas_servicio: NotasServicio,
  ) {}

  async digitalizarCitasDesdeImagen(imagen_base64: string): Promise<any> {
    const prompt = `
      Extrae la información de las citas de esta imagen de un cuaderno.
      Para cada cita, necesito el nombre del paciente, la fecha y la hora.
      Devuelve la información en un formato JSON estricto, como un array de objetos.
      Cada objeto debe tener las claves: "paciente", "fecha", "hora".
      Si no puedes determinar un valor, déjalo como null.
      Ejemplo de salida: [{"paciente": "Juan Pérez", "fecha": "2024-10-28", "hora": "15:30"}]
    `;
    const resultado_texto = await this.gemini_servicio.analizarImagen(imagen_base64, prompt);
    
    try {
        const json_limpio = resultado_texto.replace(/```json\n?|\n?```/g, '');
        return JSON.parse(json_limpio);
    } catch(error) {
        throw new Error("La respuesta del OCR no pudo ser procesada como JSON.")
    }
  }

  async generarFraseMotivacional(usuario_id: number, dias: number): Promise<string> {
    const notas = await this.notas_servicio.obtenerUltimasNotas(usuario_id, dias);
    const hora_actual = new Date().getHours();
    
    let momento_dia = 'día';
    if (hora_actual < 12) momento_dia = 'mañana';
    else if (hora_actual < 18) momento_dia = 'tarde';
    else momento_dia = 'noche';

    if (notas.length === 0) {
      const prompt = `Genera una frase motivacional corta y positiva para un dentista en la ${momento_dia}. Máximo 2 líneas.`;
      return this.gemini_servicio.generarContenido(prompt);
    }

    const contenido_notas = notas.map(n => n.contenido).join('\n---\n');
    const prompt = `
      Basado en estas notas de un dentista sobre sus últimos ${dias} días, genera una frase motivacional corta (máximo 2 líneas).
      Es ${momento_dia}, considera el momento del día en tu mensaje.
      El objetivo es animarlo a seguir adelante. No resumas las notas, solo úsalas como contexto emocional.
      Notas:
      ${contenido_notas}
    `;

    return this.gemini_servicio.generarContenido(prompt);
  }
}