<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transacciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('paciente_id')->nullable()->constrained('pacientes')->onDelete('set null');
            $table->foreignId('tratamiento_id')->nullable()->constrained('tratamientos')->onDelete('set null');
            $table->foreignId('cita_id')->nullable()->constrained('citas')->onDelete('set null');
            $table->decimal('monto', 10, 2);
            $table->enum('tipo', ['Ingreso', 'Egreso']);
            $table->string('descripcion');
            $table->string('metodo_pago')->nullable();
            $table->date('fecha');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transacciones');
    }
};