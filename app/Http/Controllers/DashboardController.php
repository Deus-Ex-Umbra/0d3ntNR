<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function mostrarDashboard()
    {
        $stats = [
            'total_pacientes' => Auth::user()->pacientes()->count(),
            'citas_hoy' => Auth::user()->citas()->whereDate('fecha_inicio', today())->count(),
        ];
        return view('dashboard', compact('stats'));
    }
}