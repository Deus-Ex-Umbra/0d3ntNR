<?php

namespace Database\Factories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

class HorarioFactory extends Factory
{
    public function definition(): array
    {
        return [
            'usuario_id' => Usuario::factory(),
            'dia_semana' => $this->faker->numberBetween(1, 5),
            'hora_inicio' => '09:00:00',
            'hora_fin' => '17:00:00',
        ];
    }
}