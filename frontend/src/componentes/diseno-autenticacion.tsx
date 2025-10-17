import { ReactNode } from 'react';

interface DisenaAutenticacionProps {
  children: ReactNode;
  titulo: string;
  subtitulo: string;
}

export function DisenoAutenticacion({ children, titulo, subtitulo }: DisenaAutenticacionProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mb-4 inline-block rounded-2xl bg-slate-800 p-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600"></div>
          </div>
          <h1 className="text-3xl font-bold text-slate-100">{titulo}</h1>
          <p className="mt-2 text-sm text-slate-400">{subtitulo}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-8 shadow-2xl backdrop-blur">
          {children}
        </div>
      </div>
    </div>
  );
}