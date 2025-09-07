<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'nombre',
        'apellido',
        'fecha_nacimiento',
        'telefono',
        'email',
        'historial_medico_relevante',
    ];
    
    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function tratamientos()
    {
        return $this->hasMany(Tratamiento::class);
    }

    public function citas()
    {
        return $this->hasMany(Cita::class);
    }
}