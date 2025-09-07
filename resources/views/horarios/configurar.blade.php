@extends('layouts.app')

@section('title', 'Configuración de Horarios - TailAdmin')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Configuración de Horarios</h1>
        <button onclick="aplicarHorarioTodos()" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"></path>
            </svg>
            <span>Aplicar a Todos</span>
        </button>
    </div>

    <div class="bg-dark-card rounded-lg border border-gray-700">
        <div class="p-6 border-b border-gray-700">
            <h2 class="text-lg font-semibold mb-2">Horarios de Atención</h2>
            <p class="text-dark-textSecondary">Define tus horarios de trabajo para cada día de la semana</p>
        </div>

        <form method="POST" action="{{ route('horarios.actualizar') }}" class="p-6">
            @csrf
            
            <div class="space-y-6">
                @php
                    $dias = [
                        1 => 'Lunes',
                        2 => 'Martes', 
                        3 => 'Miércoles',
                        4 => 'Jueves',
                        5 => 'Viernes',
                        6 => 'Sábado',
                        0 => 'Domingo'
                    ];
                    $horariosExistentes = $horarios->keyBy('dia_semana');
                @endphp

                @foreach($dias as $numeroDia => $nombreDia)
                    @php
                        $horarioExistente = $horariosExistentes->get($numeroDia);
                    @endphp
                    <div class="bg-dark-bg rounded-lg p-4 border border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-medium flex items-center">
                                <div class="w-3 h-3 rounded-full mr-3 
                                    {{ in_array($numeroDia, [0, 6]) ? 'bg-orange-400' : 'bg-primary-500' }}">
                                </div>
                                {{ $nombreDia }}
                            </h3>
                            <div class="flex items-center space-x-2">
                                <span class="text-sm text-dark-textSecondary">Abierto</span>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" 
                                           class="sr-only peer dia-activo" 
                                           data-dia="{{ $numeroDia }}"
                                           {{ $horarioExistente ? 'checked' : '' }}
                                           onchange="toggleDia({{ $numeroDia }})">
                                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                                </label>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 horario-inputs" 
                             id="inputs-{{ $numeroDia }}" 
                             style="{{ $horarioExistente ? '' : 'display: none;' }}">
                            <div>
                                <label class="block text-sm font-medium text-dark-text mb-2">Hora de Inicio</label>
                                <input type="time" 
                                       name="horarios[{{ $numeroDia }}][hora_inicio]" 
                                       value="{{ $horarioExistente ? $horarioExistente->hora_inicio : '09:00' }}"
                                       class="w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                                <input type="hidden" 
                                       name="horarios[{{ $numeroDia }}][dia_semana]" 
                                       value="{{ $numeroDia }}">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-dark-text mb-2">Hora de Fin</label>
                                <input type="time" 
                                       name="horarios[{{ $numeroDia }}][hora_fin]" 
                                       value="{{ $horarioExistente ? $horarioExistente->hora_fin : '18:00' }}"
                                       class="w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                            </div>
                            <div class="flex items-end">
                                <div class="w-full bg-dark-card border border-gray-600 rounded-lg p-2 text-center">
                                    <span class="text-sm text-dark-textSecondary">Duración:</span>
                                    <div class="font-medium" id="duracion-{{ $numeroDia }}">
                                        {{ $horarioExistente ? calculateDuration($horarioExistente->hora_inicio, $horarioExistente->hora_fin) : '9 horas' }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        @if(!$horarioExistente)
                        <div class="text-center py-4 text-dark-textSecondary" id="cerrado-{{ $numeroDia }}">
                            <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                            </svg>
                            Cerrado
                        </div>
                        @endif
                    </div>
                @endforeach
            </div>

            <div class="mt-8 pt-6 border-t border-gray-700">
                <div class="bg-dark-bg rounded-lg p-4 mb-6">
                    <h3 class="font-semibold mb-3 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Resumen de la Semana
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span class="text-dark-textSecondary">Días laborales:</span>
                            <span class="font-medium ml-1" id="dias-laborales">{{ $horarios->count() }}</span>
                        </div>
                        <div>
                            <span class="text-dark-textSecondary">Horas totales:</span>
                            <span class="font-medium ml-1" id="horas-totales">
                                {{ $horarios->sum(function($h) { return calculateHours($h->hora_inicio, $h->hora_fin); }) }} hrs
                            </span>
                        </div>
                        <div>
                            <span class="text-dark-textSecondary">Promedio diario:</span>
                            <span class="font-medium ml-1" id="promedio-diario">
                                {{ $horarios->count() > 0 ? round($horarios->sum(function($h) { return calculateHours($h->hora_inicio, $h->hora_fin); }) / $horarios->count(), 1) : 0 }} hrs
                            </span>
                        </div>
                        <div>
                            <span class="text-dark-textSecondary">Estado:</span>
                            <span class="font-medium ml-1 text-success" id="estado-horario">
                                {{ $horarios->count() > 0 ? 'Configurado' : 'Sin configurar' }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                    <button type="submit" 
                            class="flex-1 sm:flex-none bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Guardar Horarios</span>
                    </button>
                    <button type="button" 
                            onclick="presetHorarios('comercial')" 
                            class="flex-1 sm:flex-none bg-success hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>Horario Comercial</span>
                    </button>
                    <button type="button" 
                            onclick="presetHorarios('extendido')" 
                            class="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"></path>
                        </svg>
                        <span>Horario Extendido</span>
                    </button>
                    <button type="button" 
                            onclick="limpiarHorarios()" 
                            class="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        <span>Limpiar Todo</span>
                    </button>
                </div>
            </div>
        </form>
    </div>

    <div class="bg-dark-card rounded-lg border border-gray-700">
        <div class="p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Consejos para Configurar Horarios
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-dark-bg rounded-lg p-4">
                    <h4 class="font-medium text-primary-500 mb-2">Horario Comercial</h4>
                    <p class="text-sm text-dark-textSecondary">Lunes a Viernes de 9:00 AM a 6:00 PM. Ideal para consultorios tradicionales.</p>
                </div>
                <div class="bg-dark-bg rounded-lg p-4">
                    <h4 class="font-medium text-success mb-2">Horario Extendido</h4>
                    <p class="text-sm text-dark-textSecondary">Lunes a Sábado de 8:00 AM a 8:00 PM. Para mayor flexibilidad con pacientes.</p>
                </div>
                <div class="bg-dark-bg rounded-lg p-4">
                    <h4 class="font-medium text-orange-400 mb-2">Bloques de Tiempo</h4>
                    <p class="text-sm text-dark-textSecondary">Considera breaks para almuerzo y descansos en tu programación diaria.</p>
                </div>
                <div class="bg-dark-bg rounded-lg p-4">
                    <h4 class="font-medium text-purple-400 mb-2">Emergencias</h4>
                    <p class="text-sm text-dark-textSecondary">Deja espacios libres para atender emergencias dentales.</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    function toggleDia(dia) {
        const checkbox = document.querySelector(`input[data-dia="${dia}"]`);
        const inputs = document.getElementById(`inputs-${dia}`);
        const cerrado = document.getElementById(`cerrado-${dia}`);
        
        if (checkbox.checked) {
            inputs.style.display = 'grid';
            if (cerrado) cerrado.style.display = 'none';
        } else {
            inputs.style.display = 'none';
            if (cerrado) cerrado.style.display = 'block';
            
            const horaInicio = inputs.querySelector('input[type="time"]:first-of-type');
            const horaFin = inputs.querySelector('input[type="time"]:last-of-type');
            horaInicio.removeAttribute('name');
            horaFin.removeAttribute('name');
        }
        
        actualizarResumen();
    }

    function calcularDuracion(inicio, fin) {
        if (!inicio || !fin) return '0 horas';
        
        const [horaInicio, minInicio] = inicio.split(':').map(Number);
        const [horaFin, minFin] = fin.split(':').map(Number);
        
        let minutosTotales = (horaFin * 60 + minFin) - (horaInicio * 60 + minInicio);
        if (minutosTotales < 0) minutosTotales += 24 * 60;
        
        const horas = Math.floor(minutosTotales / 60);
        const minutos = minutosTotales % 60;
        
        if (minutos === 0) {
            return `${horas} hora${horas !== 1 ? 's' : ''}`;
        } else {
            return `${horas}h ${minutos}m`;
        }
    }

    function actualizarDuracion(dia) {
        const inputs = document.getElementById(`inputs-${dia}`);
        const horaInicio = inputs.querySelector('input[type="time"]:first-of-type').value;
        const horaFin = inputs.querySelector('input[type="time"]:last-of-type').value;
        const duracionElement = document.getElementById(`duracion-${dia}`);
        
        duracionElement.textContent = calcularDuracion(horaInicio, horaFin);
        actualizarResumen();
    }

    function actualizarResumen() {
        let diasLaborales = 0;
        let horasTotales = 0;
        
        for (let dia = 0; dia <= 6; dia++) {
            const checkbox = document.querySelector(`input[data-dia="${dia}"]`);
            if (checkbox && checkbox.checked) {
                diasLaborales++;
                const inputs = document.getElementById(`inputs-${dia}`);
                const horaInicio = inputs.querySelector('input[type="time"]:first-of-type').value;
                const horaFin = inputs.querySelector('input[type="time"]:last-of-type').value;
                
                if (horaInicio && horaFin) {
                    const [hi, mi] = horaInicio.split(':').map(Number);
                    const [hf, mf] = horaFin.split(':').map(Number);
                    let minutos = (hf * 60 + mf) - (hi * 60 + mi);
                    if (minutos < 0) minutos += 24 * 60;
                    horasTotales += minutos / 60;
                }
            }
        }
        
        document.getElementById('dias-laborales').textContent = diasLaborales;
        document.getElementById('horas-totales').textContent = Math.round(horasTotales * 10) / 10 + ' hrs';
        document.getElementById('promedio-diario').textContent = diasLaborales > 0 ? Math.round((horasTotales / diasLaborales) * 10) / 10 + ' hrs' : '0 hrs';
        document.getElementById('estado-horario').textContent = diasLaborales > 0 ? 'Configurado' : 'Sin configurar';
        document.getElementById('estado-horario').className = `font-medium ml-1 ${diasLaborales > 0 ? 'text-success' : 'text-orange-400'}`;
    }

    function presetHorarios(tipo) {
        const presets = {
            comercial: {
                dias: [1, 2, 3, 4, 5],
                inicio: '09:00',
                fin: '18:00'
            },
            extendido: {
                dias: [1, 2, 3, 4, 5, 6],
                inicio: '08:00',
                fin: '20:00'
            }
        };
        
        const preset = presets[tipo];
        
        for (let dia = 0; dia <= 6; dia++) {
            const checkbox = document.querySelector(`input[data-dia="${dia}"]`);
            const inputs = document.getElementById(`inputs-${dia}`);
            const cerrado = document.getElementById(`cerrado-${dia}`);
            
            if (preset.dias.includes(dia)) {
                checkbox.checked = true;
                inputs.style.display = 'grid';
                if (cerrado) cerrado.style.display = 'none';
                
                const horaInicio = inputs.querySelector('input[type="time"]:first-of-type');
                const horaFin = inputs.querySelector('input[type="time"]:last-of-type');
                horaInicio.value = preset.inicio;
                horaFin.value = preset.fin;
                horaInicio.setAttribute('name', `horarios[${dia}][hora_inicio]`);
                horaFin.setAttribute('name', `horarios[${dia}][hora_fin]`);
                
                actualizarDuracion(dia);
            } else {
                checkbox.checked = false;
                inputs.style.display = 'none';
                if (cerrado) cerrado.style.display = 'block';
            }
        }
        
        actualizarResumen();
    }

    function limpiarHorarios() {
        if (!confirm('¿Estás seguro de que quieres limpiar todos los horarios?')) {
            return;
        }
        
        for (let dia = 0; dia <= 6; dia++) {
            const checkbox = document.querySelector(`input[data-dia="${dia}"]`);
            checkbox.checked = false;
            toggleDia(dia);
        }
        
        actualizarResumen();
    }

    function aplicarHorarioTodos() {
        const diaReferencia = prompt('¿Qué día quieres usar como referencia? (1=Lunes, 2=Martes, etc.)', '1');
        if (!diaReferencia || diaReferencia < 0 || diaReferencia > 6) return;
        
        const checkboxRef = document.querySelector(`input[data-dia="${diaReferencia}"]`);
        if (!checkboxRef.checked) {
            alert('El día de referencia debe estar activo');
            return;
        }
        
        const inputsRef = document.getElementById(`inputs-${diaReferencia}`);
        const horaInicioRef = inputsRef.querySelector('input[type="time"]:first-of-type').value;
        const horaFinRef = inputsRef.querySelector('input[type="time"]:last-of-type').value;
        
        for (let dia = 0; dia <= 6; dia++) {
            if (dia == diaReferencia) continue;
            
            const checkbox = document.querySelector(`input[data-dia="${dia}"]`);
            const inputs = document.getElementById(`inputs-${dia}`);
            const cerrado = document.getElementById(`cerrado-${dia}`);
            
            checkbox.checked = true;
            inputs.style.display = 'grid';
            if (cerrado) cerrado.style.display = 'none';
            
            const horaInicio = inputs.querySelector('input[type="time"]:first-of-type');
            const horaFin = inputs.querySelector('input[type="time"]:last-of-type');
            horaInicio.value = horaInicioRef;
            horaFin.value = horaFinRef;
            horaInicio.setAttribute('name', `horarios[${dia}][hora_inicio]`);
            horaFin.setAttribute('name', `horarios[${dia}][hora_fin]`);
            
            actualizarDuracion(dia);
        }
        
        actualizarResumen();
    }

    document.addEventListener('DOMContentLoaded', function() {
        for (let dia = 0; dia <= 6; dia++) {
            const inputs = document.getElementById(`inputs-${dia}`);
            if (inputs.style.display !== 'none') {
                const horaInicio = inputs.querySelector('input[type="time"]:first-of-type');
                const horaFin = inputs.querySelector('input[type="time"]:last-of-type');
                
                horaInicio.addEventListener('change', () => actualizarDuracion(dia));
                horaFin.addEventListener('change', () => actualizarDuracion(dia));
            }
        }
        
        actualizarResumen();
    });
</script>

@php
function calculateDuration($inicio, $fin) {
    if (!$inicio || !$fin) return '0 horas';
    
    $horaInicio = new DateTime($inicio);
    $horaFin = new DateTime($fin);
    
    if ($horaFin < $horaInicio) {
        $horaFin->add(new DateInterval('P1D'));
    }
    
    $diff = $horaInicio->diff($horaFin);
    $horas = $diff->h + ($diff->days * 24);
    $minutos = $diff->i;
    
    if ($minutos === 0) {
        return $horas . ' hora' . ($horas !== 1 ? 's' : '');
    } else {
        return $horas . 'h ' . $minutos . 'm';
    }
}

function calculateHours($inicio, $fin) {
    if (!$inicio || !$fin) return 0;
    
    $horaInicio = new DateTime($inicio);
    $horaFin = new DateTime($fin);
    
    if ($horaFin < $horaInicio) {
        $horaFin->add(new DateInterval('P1D'));
    }
    
    $diff = $horaInicio->diff($horaFin);
    return $diff->h + ($diff->i / 60) + ($diff->days * 24);
}
@endphp
@endpush