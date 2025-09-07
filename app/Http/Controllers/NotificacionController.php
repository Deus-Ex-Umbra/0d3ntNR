<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificacionController extends Controller
{
    public function obtenerNoLeidas()
    {
        $notificaciones = Auth::user()->notificaciones()->where('leido', false)->orderBy('created_at', 'desc')->get();
        return response()->json($notificaciones);
    }

    public function marcarComoLeida(Notificacion $notificacion)
    {
        if ($notificacion->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }
        
        $notificacion->update(['leido' => true]);
        
        return response()->json(['status' => 'success']);
    }

    public function marcarTodasComoLeidas()
    {
        Auth::user()->notificaciones()->where('leido', false)->update(['leido' => true]);
        
        return response()->json(['status' => 'success']);
    }
}