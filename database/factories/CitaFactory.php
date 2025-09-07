<?php

namespace Database\Factories;

use App\Models\Paciente;
use App\Models\Tratamiento;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

class CitaFactory extends Factory
{
    public function definition(): array
    {
        $fecha_inicio = $this->faker->dateTimeBetween('+1 day', '+1 month');
        return [
            'usuario_id' => Usuario::factory(),
            'paciente_id' => null,
            'tratamiento_id' => null,
            'titulo' => $this->faker->sentence(3),
            'fecha_inicio' => $fecha_inicio,
            'fecha_fin' => (clone $fecha_inicio)->modify('+1 hour'),
            'estado' => 'Programada',
        ];
    }
}