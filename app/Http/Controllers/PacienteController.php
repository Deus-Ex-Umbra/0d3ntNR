<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class PacienteController extends Controller
{
    public function mostrarTodos()
    {
        $pacientes = Auth::user()->pacientes()->orderBy('apellido')->orderBy('nombre')->get();
        return view('pacientes.lista', compact('pacientes'));
    }

    public function mostrarFormularioCreacion()
    {
        return view('pacientes.crear');
    }

    public function guardarNuevo(Request $request)
    {
        $datos_validados = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'fecha_nacimiento' => 'nullable|date',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'historial_medico_relevante' => 'nullable|string',
        ]);

        Auth::user()->pacientes()->create($datos_validados);

        return redirect()->route('pacientes.todos')->with('exito', 'Paciente registrado correctamente.');
    }

    public function mostrarDetalle(Paciente $paciente)
    {
        if ($paciente->usuario_id !== Auth::id()) {
            abort(403);
        }
        return view('pacientes.detalle', compact('paciente'));
    }

    public function actualizarExistente(Request $request, Paciente $paciente)
    {
        if ($paciente->usuario_id !== Auth::id()) {
            abort(403);
        }

        $datos_validados = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'fecha_nacimiento' => 'nullable|date',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'historial_medico_relevante' => 'nullable|string',
        ]);

        $paciente->update($datos_validados);

        return redirect()->route('pacientes.detalle', $paciente)->with('exito', 'Paciente actualizado.');
    }

    public function eliminarRegistro(Paciente $paciente)
    {
        if ($paciente->usuario_id !== Auth::id()) {
            abort(403);
        }
        
        $paciente->delete();

        return redirect()->route('pacientes.todos')->with('exito', 'Paciente eliminado.');
    }
}