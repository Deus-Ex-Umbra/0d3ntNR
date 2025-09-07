<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultorio extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'nombre',
        'direccion',
        'url_mapa',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}