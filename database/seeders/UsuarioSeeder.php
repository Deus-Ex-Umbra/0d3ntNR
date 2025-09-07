<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        Usuario::create([
            'nombre' => 'Doctor',
            'apellido' => 'Prueba',
            'email' => 'admin@test.com',
            'password' => Hash::make('12345678')
        ]);

        Usuario::factory(10)->create();
    }
}