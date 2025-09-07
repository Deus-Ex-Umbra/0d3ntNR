<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use App\Models\Notificacion;

class NotificacionSeeder extends Seeder
{
    public function run(): void
    {
        $usuarios = Usuario::all();
        foreach($usuarios as $usuario) {
            Notificacion::factory(5)->create(['usuario_id' => $usuario->id]);
        }
    }
}