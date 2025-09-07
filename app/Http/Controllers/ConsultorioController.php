<?php

namespace App\Http\Controllers;

use App\Models\Consultorio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class ConsultorioController extends Controller
{
    public function guardarNuevo(Request $request)
    {
        $datos_validados = $request->validate([
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
        ]);

        $url_mapa = $this->obtenerUrlDeMapa($datos_validados['direccion']);

        Auth::user()->consultorios()->create([
            'nombre' => $datos_validados['nombre'],
            'direccion' => $datos_validados['direccion'],
            'url_mapa' => $url_mapa,
        ]);

        return back()->with('exito', 'Consultorio agregado.');
    }

    public function eliminarRegistro(Consultorio $consultorio)
    {
        if ($consultorio->usuario_id !== Auth::id()) {
            abort(403);
        }
        
        $consultorio->delete();
        
        return back()->with('exito', 'Consultorio eliminado.');
    }

    private function obtenerUrlDeMapa(string $direccion)
    {
        $api_key = config('services.google_maps.api_key');
        if (!$api_key) {
            return null;
        }

        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $direccion,
            'key' => $api_key,
        ]);

        if ($response->successful() && isset($response->json()['results'][0])) {
            $location = $response->json()['results'][0]['geometry']['location'];
            return "https://www.google.com/maps?q={$location['lat']},{$location['lng']}";
        }

        return null;
    }
}