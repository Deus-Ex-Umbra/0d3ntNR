<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use App\Models\Horario;

class HorarioSeeder extends Seeder
{
    public function run(): void
    {
        $usuarios = Usuario::all();
        foreach ($usuarios as $usuario) {
            for ($i = 1; $i <= 5; $i++) { 
                Horario::factory()->create([
                    'usuario_id' => $usuario->id,
                    'dia_semana' => $i,
                    'hora_inicio' => '09:00',
                    'hora_fin' => '18:00',
                ]);
            }
        }
    }
}