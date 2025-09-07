@extends('layouts.app')

@section('title', 'Calendario - TailAdmin')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Calendario de Citas</h1>
        <button onclick="openCreateModal()" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Nueva Cita</span>
        </button>
    </div>

    <div class="bg-dark-card rounded-lg p-6 border border-gray-700">
        <div id="calendar"></div>
    </div>
</div>

<div id="citaModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-dark-card rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
            <h3 id="modalTitle" class="text-lg font-semibold">Nueva Cita</h3>
            <button onclick="closeModal()" class="text-dark-textSecondary hover:text-dark-text">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="citaForm" class="space-y-4">
            <input type="hidden" id="citaId" name="cita_id">
            
            <div>
                <label for="titulo" class="block text-sm font-medium text-dark-text mb-2">Título</label>
                <input type="text" id="titulo" name="titulo" required 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="fecha_inicio" class="block text-sm font-medium text-dark-text mb-2">Fecha Inicio</label>
                    <input type="datetime-local" id="fecha_inicio" name="fecha_inicio" required 
                           class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                </div>
                <div>
                    <label for="fecha_fin" class="block text-sm font-medium text-dark-text mb-2">Fecha Fin</label>
                    <input type="datetime-local" id="fecha_fin" name="fecha_fin" required 
                           class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                </div>
            </div>

            <div>
                <label for="paciente_id" class="block text-sm font-medium text-dark-text mb-2">Paciente</label>
                <div class="flex space-x-2">
                    <select id="paciente_id" name="paciente_id" 
                            class="flex-1 px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                        <option value="">Seleccionar paciente</option>
                    </select>
                    <button type="button" onclick="openPacienteModal()" 
                            class="bg-success hover:bg-green-600 text-white px-3 py-2 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div>
                <label for="tratamiento_id" class="block text-sm font-medium text-dark-text mb-2">Tratamiento</label>
                <div class="flex space-x-2">
                    <select id="tratamiento_id" name="tratamiento_id" 
                            class="flex-1 px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                        <option value="">Seleccionar tratamiento</option>
                    </select>
                    <button type="button" onclick="openTratamientoModal()" 
                            class="bg-success hover:bg-green-600 text-white px-3 py-2 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="flex space-x-3 pt-4">
                <button type="submit" class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg">
                    Guardar
                </button>
                <button type="button" onclick="closeModal()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
                    Cancelar
                </button>
                <button type="button" id="deleteBtn" onclick="deleteCita()" class="bg-danger hover:bg-red-600 text-white py-2 px-4 rounded-lg hidden">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        </form>
    </div>
</div>

<div id="pacienteModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-dark-card rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Nuevo Paciente</h3>
            <button onclick="closePacienteModal()" class="text-dark-textSecondary hover:text-dark-text">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="pacienteForm" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="paciente_nombre" class="block text-sm font-medium text-dark-text mb-2">Nombre</label>
                    <input type="text" id="paciente_nombre" name="nombre" required 
                           class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                </div>
                <div>
                    <label for="paciente_apellido" class="block text-sm font-medium text-dark-text mb-2">Apellido</label>
                    <input type="text" id="paciente_apellido" name="apellido" required 
                           class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                </div>
            </div>

            <div>
                <label for="paciente_telefono" class="block text-sm font-medium text-dark-text mb-2">Teléfono</label>
                <input type="tel" id="paciente_telefono" name="telefono" 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div>
                <label for="paciente_email" class="block text-sm font-medium text-dark-text mb-2">Email</label>
                <input type="email" id="paciente_email" name="email" 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div class="flex space-x-3 pt-4">
                <button type="submit" class="flex-1 bg-success hover:bg-green-600 text-white py-2 px-4 rounded-lg">
                    Crear Paciente
                </button>
                <button type="button" onclick="closePacienteModal()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</div>

<div id="tratamientoModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-dark-card rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Nuevo Tratamiento</h3>
            <button onclick="closeTratamientoModal()" class="text-dark-textSecondary hover:text-dark-text">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="tratamientoForm" class="space-y-4">
            <div>
                <label for="tratamiento_paciente" class="block text-sm font-medium text-dark-text mb-2">Paciente</label>
                <select id="tratamiento_paciente" name="paciente_id" required 
                        class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                    <option value="">Seleccionar paciente</option>
                </select>
            </div>

            <div>
                <label for="tratamiento_nombre" class="block text-sm font-medium text-dark-text mb-2">Nombre del Tratamiento</label>
                <input type="text" id="tratamiento_nombre" name="nombre" required 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div>
                <label for="tratamiento_costo" class="block text-sm font-medium text-dark-text mb-2">Costo Total</label>
                <input type="number" id="tratamiento_costo" name="costo_total" min="0" step="0.01" required 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div>
                <label for="tratamiento_descripcion" class="block text-sm font-medium text-dark-text mb-2">Descripción</label>
                <textarea id="tratamiento_descripcion" name="descripcion" rows="3" 
                          class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500"></textarea>
            </div>

            <div class="flex space-x-3 pt-4">
                <button type="submit" class="flex-1 bg-success hover:bg-green-600 text-white py-2 px-4 rounded-lg">
                    Crear Tratamiento
                </button>
                <button type="button" onclick="closeTratamientoModal()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

@push('scripts')
<script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script>
<script>
    let calendar;
    let currentEvent = null;

    document.addEventListener('DOMContentLoaded', function() {
        initializeCalendar();
        loadPacientes();
        loadTratamientos();
    });

    function initializeCalendar() {
        const calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día'
            },
            events: '/calendario/obtener',
            eventColor: '#3C50E0',
            eventTextColor: '#FFFFFF',
            selectable: true,
            editable: true,
            select: function(info) {
                openCreateModal(info.startStr, info.endStr);
            },
            eventClick: function(info) {
                openEditModal(info.event);
            },
            eventDrop: function(info) {
                updateEventDate(info.event);
            },
            eventResize: function(info) {
                updateEventDate(info.event);
            }
        });
        calendar.render();
    }

    function openCreateModal(start = null, end = null) {
        currentEvent = null;
        document.getElementById('modalTitle').textContent = 'Nueva Cita';
        document.getElementById('citaForm').reset();
        document.getElementById('citaId').value = '';
        document.getElementById('deleteBtn').classList.add('hidden');
        
        if (start) {
            document.getElementById('fecha_inicio').value = start.slice(0, 16);
        }
        if (end) {
            document.getElementById('fecha_fin').value = end.slice(0, 16);
        }
        
        document.getElementById('citaModal').classList.remove('hidden');
    }

    function openEditModal(event) {
        currentEvent = event;
        document.getElementById('modalTitle').textContent = 'Editar Cita';
        document.getElementById('citaId').value = event.id;
        document.getElementById('titulo').value = event.title;
        document.getElementById('fecha_inicio').value = event.start.toISOString().slice(0, 16);
        document.getElementById('fecha_fin').value = event.end ? event.end.toISOString().slice(0, 16) : '';
        document.getElementById('paciente_id').value = event.extendedProps.paciente_id || '';
        document.getElementById('tratamiento_id').value = event.extendedProps.tratamiento_id || '';
        document.getElementById('deleteBtn').classList.remove('hidden');
        document.getElementById('citaModal').classList.remove('hidden');
    }

    function closeModal() {
        document.getElementById('citaModal').classList.add('hidden');
        currentEvent = null;
    }

    document.getElementById('citaForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            const url = currentEvent ? `/calendario/${currentEvent.id}` : '/calendario';
            const method = currentEvent ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                calendar.refetchEvents();
                closeModal();
                showNotification('Cita guardada exitosamente', 'success');
            } else {
                showNotification('Error al guardar la cita', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al guardar la cita', 'error');
        }
    });

    async function deleteCita() {
        if (!currentEvent || !confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
            return;
        }

        try {
            const response = await fetch(`/calendario/${currentEvent.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });

            if (response.ok) {
                calendar.refetchEvents();
                closeModal();
                showNotification('Cita eliminada exitosamente', 'success');
            } else {
                showNotification('Error al eliminar la cita', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al eliminar la cita', 'error');
        }
    }

    async function updateEventDate(event) {
        try {
            const response = await fetch(`/calendario/${event.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    titulo: event.title,
                    fecha_inicio: event.start.toISOString(),
                    fecha_fin: event.end ? event.end.toISOString() : event.start.toISOString(),
                    paciente_id: event.extendedProps.paciente_id,
                    tratamiento_id: event.extendedProps.tratamiento_id
                })
            });

            if (!response.ok) {
                event.revert();
                showNotification('Error al actualizar la cita', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            event.revert();
            showNotification('Error al actualizar la cita', 'error');
        }
    }

    async function loadPacientes() {
        try {
            const response = await fetch('/pacientes');
            const pacientes = await response.json();
            
            const selects = [
                document.getElementById('paciente_id'),
                document.getElementById('tratamiento_paciente')
            ];
            
            selects.forEach(select => {
                const currentValue = select.value;
                select.innerHTML = '<option value="">Seleccionar paciente</option>';
                pacientes.forEach(paciente => {
                    const option = document.createElement('option');
                    option.value = paciente.id;
                    option.textContent = `${paciente.nombre} ${paciente.apellido}`;
                    select.appendChild(option);
                });
                select.value = currentValue;
            });
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
        }
    }

    async function loadTratamientos() {
        try {
            const response = await fetch('/tratamientos');
            const tratamientos = await response.json();
            
            const select = document.getElementById('tratamiento_id');
            const currentValue = select.value;
            select.innerHTML = '<option value="">Seleccionar tratamiento</option>';
            
            tratamientos.forEach(tratamiento => {
                const option = document.createElement('option');
                option.value = tratamiento.id;
                option.textContent = tratamiento.nombre;
                select.appendChild(option);
            });
            
            select.value = currentValue;
        } catch (error) {
            console.error('Error al cargar tratamientos:', error);
        }
    }

    function openPacienteModal() {
        document.getElementById('pacienteModal').classList.remove('hidden');
    }

    function closePacienteModal() {
        document.getElementById('pacienteModal').classList.add('hidden');
        document.getElementById('pacienteForm').reset();
    }

    document.getElementById('pacienteForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/pacientes/nuevo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                closePacienteModal();
                loadPacientes();
                showNotification('Paciente creado exitosamente', 'success');
            } else {
                showNotification('Error al crear el paciente', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al crear el paciente', 'error');
        }
    });

    function openTratamientoModal() {
        document.getElementById('tratamientoModal').classList.remove('hidden');
    }

    function closeTratamientoModal() {
        document.getElementById('tratamientoModal').classList.add('hidden');
        document.getElementById('tratamientoForm').reset();
    }

    document.getElementById('tratamientoForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`/pacientes/${data.paciente_id}/tratamientos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                closeTratamientoModal();
                loadTratamientos();
                showNotification('Tratamiento creado exitosamente', 'success');
            } else {
                showNotification('Error al crear el tratamiento', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al crear el tratamiento', 'error');
        }
    });

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