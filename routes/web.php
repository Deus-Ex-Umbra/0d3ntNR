<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AutenticacionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\EstudioController;
use App\Http\Controllers\RedSocialController;
use App\Http\Controllers\ConsultorioController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\TratamientoController;
use App\Http\Controllers\TransaccionController;
use App\Http\Controllers\HorarioController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\GeminiController;
use App\Http\Controllers\ApiController;

Route::get('/iniciar-sesion', [AutenticacionController::class, 'mostrarInicioSesion'])->name('login');
Route::post('/iniciar-sesion', [AutenticacionController::class, 'iniciarSesion']);
Route::get('/registrar', [AutenticacionController::class, 'mostrarRegistro'])->name('register');
Route::post('/registrar', [AutenticacionController::class, 'registrarUsuario']);

Route::middleware('auth')->group(function () {
    
    Route::get('/', [DashboardController::class, 'mostrarDashboard'])->name('dashboard');
    Route::post('/cerrar-sesion', [AutenticacionController::class, 'cerrarSesion'])->name('logout');

    Route::prefix('pacientes')->name('pacientes.')->group(function () {
        Route::get('/', [PacienteController::class, 'mostrarTodos'])->name('todos');
        Route::get('/nuevo', [PacienteController::class, 'mostrarFormularioCreacion'])->name('crear');
        Route::post('/nuevo', [PacienteController::class, 'guardarNuevo'])->name('guardar');
        Route::get('/{paciente}', [PacienteController::class, 'mostrarDetalle'])->name('detalle');
        Route::put('/{paciente}', [PacienteController::class, 'actualizarExistente'])->name('actualizar');
        Route::delete('/{paciente}', [PacienteController::class, 'eliminarRegistro'])->name('eliminar');
        Route::get('/{paciente}/tratamientos', [TratamientoController::class, 'mostrarTodos'])->name('tratamientos.todos');
        Route::post('/{paciente}/tratamientos', [TratamientoController::class, 'guardarNuevo'])->name('tratamientos.guardar');
    });

    Route::put('/tratamientos/{tratamiento}', [TratamientoController::class, 'actualizarExistente'])->name('tratamientos.actualizar');
    Route::delete('/tratamientos/{tratamiento}', [TratamientoController::class, 'eliminarRegistro'])->name('tratamientos.eliminar');

    Route::prefix('calendario')->name('citas.')->group(function () {
        Route::get('/', [CitaController::class, 'mostrarCalendario'])->name('calendario');
        Route::get('/obtener', [CitaController::class, 'obtenerCitas'])->name('obtener');
        Route::post('/', [CitaController::class, 'guardarNueva'])->name('guardar');
        Route::put('/{cita}', [CitaController::class, 'actualizarExistente'])->name('actualizar');
        Route::delete('/{cita}', [CitaController::class, 'eliminarRegistro'])->name('eliminar');
    });

    Route::prefix('transacciones')->name('transacciones.')->group(function () {
        Route::get('/', [TransaccionController::class, 'mostrarTodas'])->name('todas');
        Route::post('/', [TransaccionController::class, 'guardarNueva'])->name('guardar');
        Route::delete('/{transaccion}', [TransaccionController::class, 'eliminarRegistro'])->name('eliminar');
    });

    Route::prefix('horario')->name('horarios.')->group(function () {
        Route::get('/', [HorarioController::class, 'mostrarHorario'])->name('mostrar');
        Route::post('/', [HorarioController::class, 'actualizarHorario'])->name('actualizar');
    });

    Route::prefix('notificaciones')->name('notificaciones.')->group(function () {
        Route::get('/', [NotificacionController::class, 'obtenerNoLeidas'])->name('obtener');
        Route::post('/{notificacion}/leer', [NotificacionController::class, 'marcarComoLeida'])->name('leer');
        Route::post('/leer-todas', [NotificacionController::class, 'marcarTodasComoLeidas'])->name('leer-todas');
    });

    Route::prefix('perfil')->name('perfil.')->group(function () {
        Route::get('/', [AutenticacionController::class, 'mostrarPerfil'])->name('mostrar');
        Route::put('/actualizar', [AutenticacionController::class, 'actualizarPerfil'])->name('actualizar');
        
        Route::post('/estudios', [EstudioController::class, 'guardarNuevo'])->name('estudios.guardar');
        Route::delete('/estudios/{estudio}', [EstudioController::class, 'eliminarRegistro'])->name('estudios.eliminar');
        
        Route::post('/redes-sociales', [RedSocialController::class, 'guardarNueva'])->name('redes.guardar');
        Route::delete('/redes-sociales/{redSocial}', [RedSocialController::class, 'eliminarRegistro'])->name('redes.eliminar');

        Route::post('/consultorios', [ConsultorioController::class, 'guardarNuevo'])->name('consultorios.guardar');
        Route::delete('/consultorios/{consultorio}', [ConsultorioController::class, 'eliminarRegistro'])->name('consultorios.eliminar');
    });

    Route::prefix('gemini')->name('gemini.')->group(function () {
        Route::post('/generar-imagen', [GeminiController::class, 'generarImagen'])->name('generar-imagen');
        Route::post('/generar-respuesta', [GeminiController::class, 'generarRespuesta'])->name('generar-respuesta');
    });

    Route::prefix('api')->name('api.')->group(function () {
        Route::get('/pacientes', [ApiController::class, 'pacientes'])->name('pacientes');
        Route::get('/pacientes/{id}', [ApiController::class, 'paciente'])->name('paciente');
        Route::get('/tratamientos', [ApiController::class, 'tratamientos'])->name('tratamientos');
        Route::get('/tratamientos/{id}', [ApiController::class, 'tratamiento'])->name('tratamiento');
        Route::get('/dashboard/stats', [ApiController::class, 'estadisticasDashboard'])->name('dashboard.stats');
    });
});