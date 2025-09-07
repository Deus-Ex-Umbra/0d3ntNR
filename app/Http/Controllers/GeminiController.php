<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiController extends Controller
{
    public function generarImagen(Request $request)
    {
        $datos_validados = $request->validate([
            'prompt' => 'required|string|max:1000',
            'sampleCount' => 'nullable|integer|min:1|max:4',
        ]);

        $api_key = config('services.gemini.api_key');
        if (!$api_key) {
            return response()->json(['error' => 'La API Key de Gemini no está configurada.'], 500);
        }
        
        $url = "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key={$api_key}";

        try {
            $response = Http::withHeaders([
                'x-goog-api-key' => $api_key,
                'Content-Type' => 'application/json',
            ])->timeout(90)->post($url, [
                'instances' => [
                    ['prompt' => $datos_validados['prompt']]
                ],
                'parameters' => [
                    'sampleCount' => $datos_validados['sampleCount'] ?? 1,
                ]
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }
            
            Log::error('Error en API Gemini Imagen: ' . $response->body());
            return response()->json(['error' => 'Error al generar la imagen.'], $response->status());

        } catch (\Exception $e) {
            Log::error('Excepción en API Gemini Imagen: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function generarRespuesta(Request $request)
    {
        $request->validate(['prompt' => 'required|string']);

        $api_key = config('services.gemini.api_key');
        if (!$api_key) {
            return response()->json(['error' => 'La API Key de Gemini no está configurada.'], 500);
        }
        
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={$api_key}";

        try {
            $response = Http::timeout(45)->post($url, [
                'contents' => [['parts' => [['text' => $request->prompt]]]]
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            Log::error('Error en API Gemini Texto: ' . $response->body());
            return response()->json(['error' => 'Error al generar la respuesta.'], $response->status());

        } catch (\Exception $e) {
            Log::error('Excepción en API Gemini Texto: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}