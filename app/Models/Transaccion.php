<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaccion extends Model
{
    use HasFactory;

    protected $table = 'transacciones';

    protected $fillable = [
        'usuario_id',
        'paciente_id',
        'tratamiento_id',
        'cita_id',
        'monto',
        'tipo',
        'descripcion',
        'metodo_pago',
        'fecha',
    ];
    
    protected $casts = [
        'fecha' => 'date',
    ];

    public function usuario() { return $this->belongsTo(Usuario::class); }
    public function paciente() { return $this->belongsTo(Paciente::class); }
    public function tratamiento() { return $this->belongsTo(Tratamiento::class); }
    public function cita() { return $this->belongsTo(Cita::class); }
}