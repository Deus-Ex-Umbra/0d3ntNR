<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Tratamiento extends Model
{
    use HasFactory;

    protected $fillable = [
        'paciente_id',
        'usuario_id',
        'nombre',
        'descripcion',
        'costo_total',
        'estado',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }

    public function citas()
    {
        return $this->hasMany(Cita::class);
    }

    public function transacciones()
    {
        return $this->hasMany(Transaccion::class);
    }

    protected function saldoPendiente(): Attribute
    {
        return Attribute::make(
            get: function () {
                $total_abonado = $this->transacciones()->where('tipo', 'Ingreso')->sum('monto');
                return $this->costo_total - $total_abonado;
            }
        );
    }
}