const API_URL = 'http://localhost:3000/api';

interface ErrorRespuesta {
  message: string;
  statusCode?: number;
}

export class ErrorApi extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ErrorApi';
    this.status = status;
  }
}

async function manejarRespuesta<T>(respuesta: Response): Promise<T> {
  if (!respuesta.ok) {
    const error: ErrorRespuesta = await respuesta.json().catch(() => ({
      message: 'Error desconocido',
    }));
    throw new ErrorApi(
      respuesta.status,
      error.message || 'Error en la solicitud',
    );
  }
  return respuesta.json();
}

export async function peticionApi<T>(
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...opciones.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers,
  });

  return manejarRespuesta<T>(respuesta);
}