<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function pacientes()
    {
        return $this->hasMany(Paciente::class);
    }

    public function horarios()
    {
        return $this->hasMany(Horario::class);
    }

    public function tratamientos()
    {
        return $this->hasMany(Tratamiento::class);
    }

    public function citas()
    {
        return $this->hasMany(Cita::class);
    }

    public function transacciones()
    {
        return $this->hasMany(Transaccion::class);
    }

    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class);
    }

    public function consultorios()
    {
        return $this->hasMany(Consultorio::class);
    }
    
    public function redesSociales()
    {
        return $this->hasMany(RedSocial::class);
    }
}