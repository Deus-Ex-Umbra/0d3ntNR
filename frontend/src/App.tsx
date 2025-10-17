import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorAutenticacion, useAutenticacion } from './contextos/autenticacion-contexto';
import InicioSesion from './paginas/InicioSesion';
import Registro from './paginas/Registro';
import Inicio from './paginas/Inicio';
import { Loader2 } from 'lucide-react';

function RutaProtegida({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/inicio-sesion" replace />;
  }

  return <>{children}</>;
}

function RutaPublica({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (usuario) {
    return <Navigate to="/inicio" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ProveedorAutenticacion>
      <BrowserRouter>
        <Routes>
          <Route
            path="/inicio-sesion"
            element={
              <RutaPublica>
                <InicioSesion />
              </RutaPublica>
            }
          />
          <Route
            path="/registro"
            element={
              <RutaPublica>
                <Registro />
              </RutaPublica>
            }
          />
          <Route
            path="/inicio"
            element={
              <RutaProtegida>
                <Inicio />
              </RutaProtegida>
            }
          />
          <Route path="/" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </BrowserRouter>
    </ProveedorAutenticacion>
  );
}

export default App;