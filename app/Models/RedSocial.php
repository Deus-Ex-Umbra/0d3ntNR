<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RedSocial extends Model
{
    use HasFactory;

    protected $table = 'redes_sociales';

    protected $fillable = [
        'usuario_id',
        'nombre',
        'url',
        'ruta_imagen',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}