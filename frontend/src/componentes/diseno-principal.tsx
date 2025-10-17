import { ReactNode } from 'react';
import { BarraLateral } from './barra-lateral';

interface PropiedadesDiseñoPrincipal {
  children: ReactNode;
}

export function DiseñoPrincipal({ children }: PropiedadesDiseñoPrincipal) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <BarraLateral />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}