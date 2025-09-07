<?php

namespace Database\Factories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransaccionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'usuario_id' => Usuario::factory(),
            'monto' => $this->faker->randomFloat(2, 20, 500),
            'tipo' => 'Ingreso',
            'descripcion' => $this->faker->sentence,
            'metodo_pago' => $this->faker->randomElement(['Efectivo', 'Tarjeta', 'Transferencia']),
            'fecha' => $this->faker->dateTimeThisYear(),
        ];
    }
}