<?php

namespace Database\Factories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificacionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'usuario_id' => Usuario::factory(),
            'mensaje' => 'Esta es una nueva notificación de prueba.',
            'link' => '#',
            'leido' => false,
        ];
    }
}