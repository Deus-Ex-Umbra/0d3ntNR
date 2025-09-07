<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use App\Models\Tratamiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApiController extends Controller
{
    public function pacientes()
    {
        $pacientes = Auth::user()->pacientes()
            ->orderBy('apellido')
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'apellido']);
        
        return response()->json($pacientes);
    }

    public function tratamientos()
    {
        $tratamientos = Auth::user()->tratamientos()
            ->with('paciente:id,nombre,apellido')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'nombre', 'paciente_id', 'estado']);
        
        return response()->json($tratamientos);
    }

    public function tratamiento($id)
    {
        $tratamiento = Auth::user()->tratamientos()
            ->findOrFail($id);
        
        return response()->json($tratamiento);
    }

    public function paciente($id)
    {
        $paciente = Auth::user()->pacientes()
            ->findOrFail($id);
        
        return response()->json($paciente);
    }

    public function estadisticasDashboard()
    {
        $usuario = Auth::user();
        
        $stats = [
            'total_pacientes' => $usuario->pacientes()->count(),
            'citas_hoy' => $usuario->citas()->whereDate('fecha_inicio', today())->count(),
            'ingresos_mes' => $usuario->transacciones()
                ->where('tipo', 'Ingreso')
                ->whereMonth('fecha', now()->month)
                ->whereYear('fecha', now()->year)
                ->sum('monto'),
            'tratamientos_activos' => $usuario->tratamientos()
                ->where('estado', 'En Progreso')
                ->count(),
            'proximas_citas' => $usuario->citas()
                ->with('paciente:id,nombre,apellido')
                ->where('fecha_inicio', '>=', now())
                ->orderBy('fecha_inicio')
                ->take(5)
                ->get(),
            'transacciones_recientes' => $usuario->transacciones()
                ->with('paciente:id,nombre,apellido')
                ->orderBy('fecha', 'desc')
                ->take(5)
                ->get()
        ];
        
        return response()->json($stats);
    }
}