<?php

namespace Database\Factories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

class PacienteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'usuario_id' => Usuario::factory(),
            'nombre' => $this->faker->firstName,
            'apellido' => $this->faker->lastName,
            'fecha_nacimiento' => $this->faker->date(),
            'telefono' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'historial_medico_relevante' => $this->faker->sentence,
        ];
    }
}