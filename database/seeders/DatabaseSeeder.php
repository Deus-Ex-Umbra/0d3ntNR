<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UsuarioSeeder::class,
            PacienteSeeder::class,
            HorarioSeeder::class,
            TratamientoSeeder::class,
            CitaSeeder::class,
            TransaccionSeeder::class,
            NotificacionSeeder::class,
        ]);
    }
}