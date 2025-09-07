<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Paciente;
use App\Models\Tratamiento;

class TratamientoSeeder extends Seeder
{
    public function run(): void
    {
        $pacientes = Paciente::all();
        foreach ($pacientes as $paciente) {
            Tratamiento::factory(2)->create([
                'paciente_id' => $paciente->id,
                'usuario_id' => $paciente->usuario_id,
            ]);
        }
    }
}