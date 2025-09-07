<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaccion;
use App\Models\Tratamiento;

class TransaccionSeeder extends Seeder
{
    public function run(): void
    {
        $tratamientos = Tratamiento::all();
        foreach($tratamientos as $tratamiento) {
            Transaccion::factory(3)->create([
                'usuario_id' => $tratamiento->usuario_id,
                'paciente_id' => $tratamiento->paciente_id,
                'tratamiento_id' => $tratamiento->id,
                'monto' => $tratamiento->costo_total / 4,
            ]);
        }
    }
}