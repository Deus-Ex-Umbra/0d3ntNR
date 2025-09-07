<?php

namespace App\Http\Controllers;

use App\Models\RedSocial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Traits\ManejoDeImagenes;

class RedSocialController extends Controller
{
    use ManejoDeImagenes;

    public function guardarNueva(Request $request)
    {
        $datos_validados = $request->validate([
            'nombre' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'icono' => 'required|image|mimes:svg,png|max:1024',
        ]);

        $ruta_icono = $this->procesarYGuardarImagen(
            $request->file('icono'),
            'iconos-redes',
            64,
            64
        );
        
        Auth::user()->redesSociales()->create([
            'nombre' => $datos_validados['nombre'],
            'url' => $datos_validados['url'],
            'ruta_imagen' => $ruta_icono,
        ]);

        return back()->with('exito', 'Red social agregada.');
    }

    public function eliminarRegistro(RedSocial $redSocial)
    {
        if ($redSocial->usuario_id !== Auth::id()) {
            abort(403);
        }
        
        $redSocial->delete();
        
        return back()->with('exito', 'Red social eliminada.');
    }
}