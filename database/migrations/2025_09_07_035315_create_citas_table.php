<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('paciente_id')->nullable()->constrained('pacientes')->onDelete('cascade');
            $table->foreignId('tratamiento_id')->nullable()->constrained('tratamientos')->onDelete('cascade');
            $table->string('titulo');
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin');
            $table->decimal('costo_estimado', 10, 2)->nullable();
            $table->string('estado')->default('Programada');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citas');
    }
};