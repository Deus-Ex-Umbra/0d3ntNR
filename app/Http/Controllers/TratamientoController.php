<?php

namespace App\Http\Controllers;

use App\Models\Tratamiento;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TratamientoController extends Controller
{
    public function mostrarTodos(Paciente $paciente)
    {
        if ($paciente->usuario_id !== Auth::id()) {
            abort(403);
        }
        $tratamientos = $paciente->tratamientos()->get();
        return view('tratamientos.lista', compact('paciente', 'tratamientos'));
    }
    
    public function guardarNuevo(Request $request, Paciente $paciente)
    {
        if ($paciente->usuario_id !== Auth::id()) {
            abort(403);
        }
        
        $datos_validados = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'costo_total' => 'required|numeric|min:0',
            'estado' => 'required|string|in:Planificado,En Progreso,Finalizado,Cancelado',
        ]);
        
        $paciente->tratamientos()->create($datos_validados + ['usuario_id' => Auth::id()]);
        
        return back()->with('exito', 'Tratamiento creado.');
    }

    public function actualizarExistente(Request $request, Tratamiento $tratamiento)
    {
        if ($tratamiento->usuario_id !== Auth::id()) {
            abort(403);
        }

        $datos_validados = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'costo_total' => 'required|numeric|min:0',
            'estado' => 'required|string|in:Planificado,En Progreso,Finalizado,Cancelado',
        ]);
        
        $tratamiento->update($datos_validados);

        return back()->with('exito', 'Tratamiento actualizado.');
    }

    public function eliminarRegistro(Tratamiento $tratamiento)
    {
        if ($tratamiento->usuario_id !== Auth::id()) {
            abort(403);
        }
        
        $tratamiento->delete();
        
        return back()->with('exito', 'Tratamiento eliminado.');
    }
}