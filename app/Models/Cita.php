<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'paciente_id',
        'tratamiento_id',
        'titulo',
        'fecha_inicio',
        'fecha_fin',
        'costo_estimado',
        'estado',
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
    ];

    public function usuario() { return $this->belongsTo(Usuario::class); }
    public function paciente() { return $this->belongsTo(Paciente::class); }
    public function tratamiento() { return $this->belongsTo(Tratamiento::class); }
}