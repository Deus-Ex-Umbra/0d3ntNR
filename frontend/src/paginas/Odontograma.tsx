import { useState, useEffect } from 'react';
import { MenuLateral } from '@/componentes/MenuLateral';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Smile, Search, Plus, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import { Input } from '@/componentes/ui/input';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/componentes/ui/toaster';

export default function Odontograma() {
  const [mostrar_cpp, setMostrarCpp] = useState(false);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (clicks >= 5) {
      setMostrarCpp(true);
      toast({
        title: '🎉 Easter Egg Encontrado!',
        description: '¡Has descubierto el secreto de C++!',
      });
    }
  }, [clicks]);

  const manejarClickSecreto = () => {
    setClicks(prev => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
      <MenuLateral />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 
                className="text-4xl font-bold text-foreground tracking-tight hover:text-primary transition-colors duration-200 cursor-pointer select-none"
                onClick={manejarClickSecreto}
              >
                Odontogramas
              </h1>
              <p className="text-lg text-muted-foreground">
                Visualiza y gestiona el estado dental de tus pacientes
              </p>
            </div>

            <Button size="lg" className="shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-200">
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Odontograma
            </Button>
          </div>

          {mostrar_cpp && (
            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-blue-500/30 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-xl hover:scale-110 hover:rotate-12 transition-all duration-300">
                  <img 
                    src="/cpp.svg" 
                    alt="C++" 
                    className="h-12 w-12 animate-pulse"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                    ¡Secreto Desbloqueado!
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    "La perfección se alcanza no cuando no hay nada más que agregar, sino cuando no hay nada más que quitar." - C++
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMostrarCpp(false)}
                  className="hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
                >
                  ×
                </Button>
              </div>
            </div>
          )}

          <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Buscar Paciente</CardTitle>
                  <CardDescription>Busca un paciente para ver su odontograma</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Buscar por nombre, apellidos o ID..."
                className="h-11 hover:border-primary/50 focus:border-primary transition-all duration-200"
              />
            </CardContent>
          </Card>

          <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg hover:scale-110 transition-transform duration-200">
                  <Smile className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Visor de Odontogramas</CardTitle>
                  <CardDescription>Funcionalidad en desarrollo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 space-y-4">
                <div className="mx-auto w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-300">
                  <Smile className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Vista de Odontograma Interactiva
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Aquí podrás visualizar y editar el odontograma del paciente seleccionado.
                    Esta funcionalidad estará disponible próximamente.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
                  <Calendar className="h-4 w-4" />
                  <span>Pista: Haz clic 5 veces en el título para descubrir algo especial</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="bg-green-500/10 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-500" />
                  </div>
                  Versionado de Odontogramas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Guarda múltiples versiones del odontograma para comparar la evolución del tratamiento a lo largo del tiempo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <Smile className="h-4 w-4 text-blue-500" />
                  </div>
                  Simbología Estándar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Marca cada pieza dental con simbología estándar: caries, ausente, restauración, endodoncia y más.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}