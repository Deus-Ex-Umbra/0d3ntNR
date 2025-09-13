@extends('layouts.app')

@section('title', 'Paciente: ' . $paciente->nombre . ' ' . $paciente->apellido . ' - TailAdmin')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
            <a href="{{ route('pacientes.todos') }}" class="text-dark-textSecondary hover:text-dark-text">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </a>
            <h1 class="text-2xl font-bold">{{ $paciente->nombre }} {{ $paciente->apellido }}</h1>
        </div>
        <div class="flex space-x-2">
            <button onclick="editarPaciente()" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span>Editar</span>
            </button>
            <button onclick="nuevaCita()" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"></path>
                </svg>
                <span>Nueva Cita</span>
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
            <div class="bg-dark-card rounded-lg border border-gray-700">
                <div class="p-6">
                    <div class="text-center">
                        <div class="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-2xl font-bold text-white">
                                {{ substr($paciente->nombre, 0, 1) }}{{ substr($paciente->apellido, 0, 1) }}
                            </span>
                        </div>
                        <h2 class="text-xl font-semibold">{{ $paciente->nombre }} {{ $paciente->apellido }}</h2>
                        <p class="text-dark-textSecondary">ID: #{{ str_pad($paciente->id, 4, '0', STR_PAD_LEFT) }}</p>
                    </div>

                    <div class="mt-6 space-y-4">
                        <div class="flex items-center space-x-3">
                            <svg class="w-5 h-5 text-dark-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"></path>
                            </svg>
                            <div>
                                <p class="text-sm text-dark-textSecondary">Edad</p>
                                <p class="font-medium">
                                    @if($paciente->fecha_nacimiento)
                                        {{ \Carbon\Carbon::parse($paciente->fecha_nacimiento)->age }} años
                                    @else
                                        No especificada
                                    @endif
                                </p>
                            </div>
                        </div>

                        @if($paciente->telefono)
                        <div class="flex items-center space-x-3">
                            <svg class="w-5 h-5 text-dark-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <div>
                                <p class="text-sm text-dark-textSecondary">Teléfono</p>
                                <a href="tel:{{ $paciente->telefono }}" class="font-medium text-primary-500 hover:text-primary-600">{{ $paciente->telefono }}</a>
                            </div>
                        </div>
                        @endif

                        @if($paciente->email)
                        <div class="flex items-center space-x-3">
                            <svg class="w-5 h-5 text-dark-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <div>
                                <p class="text-sm text-dark-textSecondary">Email</p>
                                <a href="mailto:{{ $paciente->email }}" class="font-medium text-primary-500 hover:text-primary-600">{{ $paciente->email }}</a>
                            </div>
                        </div>
                        @endif

                        <div class="flex items-center space-x-3">
                            <svg class="w-5 h-5 text-dark-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <p class="text-sm text-dark-textSecondary">Registrado</p>
                                <p class="font-medium">{{ $paciente->created_at->format('d/m/Y') }}</p>
                            </div>
                        </div>
                    </div>

                    @if($paciente->historial_medico_relevante)
                    <div class="mt-6 pt-6 border-t border-gray-700">
                        <h3 class="font-semibold mb-2 flex items-center">
                            <svg class="w-4 h-4 mr-2 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                            Historial Médico
                        </h3>
                        <p class="text-sm text-dark-textSecondary bg-dark-bg rounded-lg p-3">{{ $paciente->historial_medico_relevante }}</p>
                    </div>
                    @endif
                </div>
            </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
            <div class="bg-dark-card rounded-lg border border-gray-700">
                <div class="p-6 border-b border-gray-700">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">Tratamientos</h3>
                        <button onclick="nuevoTratamiento()" class="bg-success hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            <span>Nuevo</span>
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    @if($paciente->tratamientos->count() > 0)
                        <div class="space-y-4">
                            @foreach($paciente->tratamientos as $tratamiento)
                            <div class="bg-dark-bg rounded-lg p-4 border border-gray-700">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <div class="flex items-center space-x-3 mb-2">
                                            <h4 class="font-medium">{{ $tratamiento->nombre }}</h4>
                                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                                @if($tratamiento->estado == 'En Progreso') bg-success bg-opacity-20 text-success
                                                @elseif($tratamiento->estado == 'Finalizado') bg-primary-500 bg-opacity-20 text-primary-500
                                                @elseif($tratamiento->estado == 'Planificado') bg-orange-500 bg-opacity-20 text-orange-400
                                                @else bg-gray-600 bg-opacity-20 text-gray-400
                                                @endif">
                                                {{ $tratamiento->estado }}
                                            </span>
                                        </div>
                                        @if($tratamiento->descripcion)
                                            <p class="text-sm text-dark-textSecondary mb-2">{{ $tratamiento->descripcion }}</p>
                                        @endif
                                        <div class="flex items-center space-x-4 text-sm">
                                            <span class="text-dark-textSecondary">Costo: <span class="font-medium text-dark-text">${{ number_format($tratamiento->costo_total, 2) }}</span></span>
                                            <span class="text-dark-textSecondary">Saldo: <span class="font-medium text-orange-400">${{ number_format($tratamiento->saldo_pendiente, 2) }}</span></span>
                                        </div>
                                    </div>
                                    <div class="flex space-x-1 ml-4">
                                        <button onclick="editarTratamiento({{ $tratamiento->id }})" class="text-orange-400 hover:text-orange-500 p-1 rounded">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </button>
                                        <button onclick="eliminarTratamiento({{ $tratamiento->id }})" class="text-danger hover:text-red-600 p-1 rounded">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            @endforeach
                        </div>
                    @else
                        <div class="text-center py-8">
                            <svg class="mx-auto h-12 w-12 text-dark-textSecondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <p class="text-dark-textSecondary mb-4">No hay tratamientos registrados</p>
                            <button onclick="nuevoTratamiento()" class="bg-success hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                                Crear Primer Tratamiento
                            </button>
                        </div>
                    @endif
                </div>
            </div>

            <div class="bg-dark-card rounded-lg border border-gray-700">
                <div class="p-6 border-b border-gray-700">
                    <h3 class="text-lg font-semibold">Historial de Citas</h3>
                </div>
                <div class="p-6">
                    @if($paciente->citas->count() > 0)
                        <div class="space-y-3">
                            @foreach($paciente->citas()->orderBy('fecha_inicio', 'desc')->take(5)->get() as $cita)
                            <div class="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center">
                                        <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ $cita->titulo }}</p>
                                        <p class="text-sm text-dark-textSecondary">{{ $cita->fecha_inicio->format('d/m/Y H:i') }}</p>
                                    </div>
                                </div>
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                    @if($cita->fecha_inicio->isPast()) bg-success bg-opacity-20 text-success
                                    @else bg-orange-500 bg-opacity-20 text-orange-400
                                    @endif">
                                    {{ $cita->fecha_inicio->isPast() ? 'Completada' : 'Programada' }}
                                </span>
                            </div>
                            @endforeach
                        </div>
                        @if($paciente->citas->count() > 5)
                            <div class="text-center mt-4">
                                <a href="{{ route('citas.calendario') }}" class="text-primary-500 hover:text-primary-600 text-sm">
                                    Ver todas las citas ({{ $paciente->citas->count() }})
                                </a>
                            </div>
                        @endif
                    @else
                        <div class="text-center py-8">
                            <svg class="mx-auto h-12 w-12 text-dark-textSecondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"></path>
                            </svg>
                            <p class="text-dark-textSecondary mb-4">No hay citas registradas</p>
                            <button onclick="nuevaCita()" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg">
                                Agendar Primera Cita
                            </button>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>

<div id="editModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-dark-card rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Editar Paciente</h3>
            <button onclick="closeEditModal()" class="text-dark-textSecondary hover:text-dark-text">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="editForm" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="edit_nombre" class="block text-sm font-medium text-dark-text mb-2">Nombre</label>
                    <input type="text" id="edit_nombre" name="nombre" value="{{ $paciente->nombre ?? '' }}" required 
                           class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                </div>
                <div>
                    <label for="edit_apellido" class="block text-sm font-medium text-dark-text mb-2">Apellido</label>
                    <input type="text" id="edit_apellido" name="apellido" value="{{ $paciente->apellido ?? '' }}" required 
                           class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                </div>
            </div>

            <div>
                <label for="edit_fecha_nacimiento" class="block text-sm font-medium text-dark-text mb-2">Fecha de Nacimiento</label>
                <input type="date" id="edit_fecha_nacimiento" name="fecha_nacimiento" value="{{ $paciente->fecha_nacimiento }}" 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div>
                <label for="edit_telefono" class="block text-sm font-medium text-dark-text mb-2">Teléfono</label>
                <input type="tel" id="edit_telefono" name="telefono" value="{{ $paciente->telefono }}" 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div>
                <label for="edit_email" class="block text-sm font-medium text-dark-text mb-2">Email</label>
                <input type="email" id="edit_email" name="email" value="{{ $paciente->email }}" 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div>
                <label for="edit_historial" class="block text-sm font-medium text-dark-text mb-2">Historial Médico</label>
                <textarea id="edit_historial" name="historial_medico_relevante" rows="3" 
                          class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">{{ $paciente->historial_medico_relevante }}</textarea>
            </div>

            <div class="flex space-x-3 pt-4">
                <button type="submit" class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg">
                    Actualizar
                </button>
                <button type="button" onclick="closeEditModal()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</div>

<div id="treatmentModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-dark-card rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
            <h3 id="treatmentModalTitle" class="text-lg font-semibold">Nuevo Tratamiento</h3>
            <button onclick="closeTreatmentModal()" class="text-dark-textSecondary hover:text-dark-text">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="treatmentForm" class="space-y-4">
            <input type="hidden" id="treatment_id" name="treatment_id">
            
            <div>
                <label for="treatment_nombre" class="block text-sm font-medium text-dark-text mb-2">Nombre del Tratamiento</label>
                <input type="text" id="treatment_nombre" name="nombre" required 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div>
                <label for="treatment_costo" class="block text-sm font-medium text-dark-text mb-2">Costo Total</label>
                <input type="number" id="treatment_costo" name="costo_total" min="0" step="0.01" required 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div>
                <label for="treatment_estado" class="block text-sm font-medium text-dark-text mb-2">Estado</label>
                <select id="treatment_estado" name="estado" required 
                        class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                    <option value="Planificado">Planificado</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
            </div>

            <div>
                <label for="treatment_descripcion" class="block text-sm font-medium text-dark-text mb-2">Descripción</label>
                <textarea id="treatment_descripcion" name="descripcion" rows="3" 
                          class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500"></textarea>
            </div>

            <div class="flex space-x-3 pt-4">
                <button type="submit" class="flex-1 bg-success hover:bg-green-600 text-white py-2 px-4 rounded-lg">
                    Guardar
                </button>
                <button type="button" onclick="closeTreatmentModal()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

@push('scripts')
<script>
    function editarPaciente() {
        document.getElementById('editModal').classList.remove('hidden');
    }

    function closeEditModal() {
        document.getElementById('editModal').classList.add('hidden');
    }

    document.getElementById('editForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`/pacientes/{{ $paciente->id }}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                location.reload();
            } else {
                showNotification('Error al actualizar el paciente', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al actualizar el paciente', 'error');
        }
    });

    function nuevoTratamiento() {
        document.getElementById('treatmentModalTitle').textContent = 'Nuevo Tratamiento';
        document.getElementById('treatmentForm').reset();
        document.getElementById('treatment_id').value = '';
        document.getElementById('treatmentModal').classList.remove('hidden');
    }

    function editarTratamiento(id) {
        fetch(`/tratamientos/${id}`)
            .then(response => response.json())
            .then(tratamiento => {
                document.getElementById('treatmentModalTitle').textContent = 'Editar Tratamiento';
                document.getElementById('treatment_id').value = tratamiento.id;
                document.getElementById('treatment_nombre').value = tratamiento.nombre;
                document.getElementById('treatment_costo').value = tratamiento.costo_total;
                document.getElementById('treatment_estado').value = tratamiento.estado;
                document.getElementById('treatment_descripcion').value = tratamiento.descripcion || '';
                document.getElementById('treatmentModal').classList.remove('hidden');
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error al cargar el tratamiento', 'error');
            });
    }

    function closeTreatmentModal() {
        document.getElementById('treatmentModal').classList.add('hidden');
    }

    document.getElementById('treatmentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        const treatmentId = document.getElementById('treatment_id').value;
        
        try {
            let url, method;
            if (treatmentId) {
                url = `/tratamientos/${treatmentId}`;
                method = 'PUT';
            } else {
                url = `/pacientes/{{ $paciente->id }}/tratamientos`;
                method = 'POST';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                location.reload();
            } else {
                showNotification('Error al guardar el tratamiento', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al guardar el tratamiento', 'error');
        }
    });

    async function eliminarTratamiento(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este tratamiento?')) {
            return;
        }

        try {
            const response = await fetch(`/tratamientos/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });

            if (response.ok) {
                location.reload();
            } else {
                showNotification('Error al eliminar el tratamiento', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al eliminar el tratamiento', 'error');
        }
    }

    function nuevaCita() {
        window.location.href = '{{ route("citas.calendario") }}';
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-success' : 'bg-danger'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
</script>
@endpush