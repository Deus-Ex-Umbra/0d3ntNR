<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CitaController extends Controller
{
    public function mostrarCalendario()
    {
        return view('citas.calendario');
    }

    public function obtenerCitas(Request $request)
    {
        $request->validate([
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
        ]);
    
        $citas = Auth::user()->citas()
            ->whereBetween('fecha_inicio', [$request->start, $request->end])
            ->get();
    
        return response()->json($citas);
    }
    
    public function guardarNueva(Request $request)
    {
        $datos_validados = $request->validate([
            'titulo' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'paciente_id' => 'nullable|exists:pacientes,id',
            'tratamiento_id' => 'nullable|exists:tratamientos,id',
        ]);

        $cita = Auth::user()->citas()->create($datos_validados);

        return response()->json($cita);
    }

    public function actualizarExistente(Request $request, Cita $cita)
    {
        if ($cita->usuario_id !== Auth::id()) {
            abort(403);
        }

        $datos_validados = $request->validate([
            'titulo' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'paciente_id' => 'nullable|exists:pacientes,id',
            'tratamiento_id' => 'nullable|exists:tratamientos,id',
        ]);

        $cita->update($datos_validados);

        return response()->json($cita);
    }

    public function eliminarRegistro(Cita $cita)
    {
        if ($cita->usuario_id !== Auth::id()) {
            abort(403);
        }
        
        $cita->delete();
        
        return response()->json(['status' => 'success']);
    }
}