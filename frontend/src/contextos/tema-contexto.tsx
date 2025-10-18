import { createContext, useContext, useEffect, useState } from 'react';

type Tema = 'claro' | 'oscuro' | 'azul' | 'sistema';

interface ContextoTema {
  tema: Tema;
  cambiarTema: (tema: Tema) => void;
  tema_efectivo: 'claro' | 'oscuro' | 'azul';
}

const ContextoTema = createContext<ContextoTema | undefined>(undefined);

export function ProveedorTema({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>(() => {
    const tema_guardado = localStorage.getItem('tema');
    return (tema_guardado as Tema) || 'oscuro';
  });

  const [tema_efectivo, setTemaEfectivo] = useState<'claro' | 'oscuro' | 'azul'>('oscuro');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remover todas las clases de tema
    root.classList.remove('dark', 'blue');
    
    let tema_aplicar: 'claro' | 'oscuro' | 'azul' = 'oscuro';
    
    if (tema === 'sistema') {
      const es_oscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
      tema_aplicar = es_oscuro ? 'oscuro' : 'claro';
    } else {
      tema_aplicar = tema;
    }
    
    setTemaEfectivo(tema_aplicar);
    
    // Aplicar clase al root (claro no necesita clase, usa :root)
    if (tema_aplicar === 'oscuro') {
      root.classList.add('dark');
    } else if (tema_aplicar === 'azul') {
      root.classList.add('blue');
    }
    // Si es claro, no agregamos clase, usa las variables de :root
    
    // Guardar en localStorage
    localStorage.setItem('tema', tema);
  }, [tema]);

  // Escuchar cambios en preferencias del sistema
  useEffect(() => {
    if (tema !== 'sistema') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const manejarCambio = () => {
      const es_oscuro = mediaQuery.matches;
      const nuevo_tema = es_oscuro ? 'oscuro' : 'claro';
      setTemaEfectivo(nuevo_tema);
      
      const root = window.document.documentElement;
      root.classList.remove('dark', 'blue');
      if (nuevo_tema === 'oscuro') {
        root.classList.add('dark');
      }
    };
    
    mediaQuery.addEventListener('change', manejarCambio);
    return () => mediaQuery.removeEventListener('change', manejarCambio);
  }, [tema]);

  const cambiarTema = (nuevo_tema: Tema) => {
    setTema(nuevo_tema);
  };

  return (
    <ContextoTema.Provider value={{ tema, cambiarTema, tema_efectivo }}>
      {children}
    </ContextoTema.Provider>
  );
}

export function useTema() {
  const contexto = useContext(ContextoTema);
  if (contexto === undefined) {
    throw new Error('useTema debe ser usado dentro de un ProveedorTema');
  }
  return contexto;
}