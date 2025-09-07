<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'dia_semana',
        'hora_inicio',
        'hora_fin',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}