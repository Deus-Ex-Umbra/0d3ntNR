<?php

namespace App\Http\Controllers;

use App\Models\Horario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HorarioController extends Controller
{
    public function mostrarHorario()
    {
        $horarios = Auth::user()->horarios()->orderBy('dia_semana')->get();
        return view('horarios.configurar', compact('horarios'));
    }

    public function actualizarHorario(Request $request)
    {
        $request->validate([
            'horarios' => 'present|array',
            'horarios.*.dia_semana' => 'required|integer|between:0,6',
            'horarios.*.hora_inicio' => 'required|date_format:H:i',
            'horarios.*.hora_fin' => 'required|date_format:H:i|after:horarios.*.hora_inicio',
        ]);
    
        Auth::user()->horarios()->delete();
    
        foreach ($request->horarios as $horario) {
            Auth::user()->horarios()->create($horario);
        }

        return redirect()->route('horarios.mostrar')->with('exito', 'Horario actualizado correctamente.');
    }
}