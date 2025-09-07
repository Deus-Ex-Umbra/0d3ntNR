<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Paciente;
use App\Models\Usuario;

class PacienteSeeder extends Seeder
{
    public function run(): void
    {
        $usuarios = Usuario::all();
        if ($usuarios->isEmpty()) {
            return;
        }

        foreach ($usuarios as $usuario) {
            Paciente::factory(5)->create(['usuario_id' => $usuario->id]);
        }
    }
}