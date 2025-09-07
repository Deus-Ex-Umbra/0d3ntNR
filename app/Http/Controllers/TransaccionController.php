<?php

namespace App\Http\Controllers;

use App\Models\Transaccion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransaccionController extends Controller
{
    public function mostrarTodas()
    {
        $transacciones = Auth::user()->transacciones()->orderBy('fecha', 'desc')->get();
        return view('transacciones.lista', compact('transacciones'));
    }

    public function guardarNueva(Request $request)
    {
        $datos_validados = $request->validate([
            'descripcion' => 'required|string|max:255',
            'monto' => 'required|numeric|min:0.01',
            'tipo' => 'required|string|in:Ingreso,Egreso',
            'fecha' => 'required|date',
            'paciente_id' => 'nullable|exists:pacientes,id',
            'tratamiento_id' => 'nullable|exists:tratamientos,id',
            'metodo_pago' => 'nullable|string',
        ]);

        Auth::user()->transacciones()->create($datos_validados);

        return back()->with('exito', 'Transacción registrada.');
    }

    public function eliminarRegistro(Transaccion $transaccion)
    {
        if ($transaccion->usuario_id !== Auth::id()) {
            abort(403);
        }

        $transaccion->delete();
        
        return back()->with('exito', 'Transacción eliminada.');
    }
}