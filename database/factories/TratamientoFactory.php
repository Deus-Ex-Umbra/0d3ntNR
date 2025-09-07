<?php

namespace Database\Factories;

use App\Models\Paciente;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

class TratamientoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'paciente_id' => Paciente::factory(),
            'usuario_id' => Usuario::factory(),
            'nombre' => $this->faker->randomElement(['Ortodoncia Completa', 'Blanqueamiento Dental', 'Set de Implantes']),
            'descripcion' => $this->faker->paragraph,
            'costo_total' => $this->faker->randomFloat(2, 500, 3000),
            'estado' => 'En Progreso',
        ];
    }
}