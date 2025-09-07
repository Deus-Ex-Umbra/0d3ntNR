@extends('layouts.app')

@section('title', 'Pacientes - TailAdmin')

@section('content')
<div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-bold">Gestión de Pacientes</h1>
        <a href="{{ route('pacientes.crear') }}" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-fit">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Nuevo Paciente</span>
        </a>
    </div>

    <div class="bg-dark-card rounded-lg border border-gray-700">
        <div class="p-6 border-b border-gray-700">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1">
                    <div class="relative">
                        <input type="text" id="buscarPaciente" placeholder="Buscar pacientes..." 
                               class="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-primary-500">
                        <svg class="w-4 h-4 absolute left-3 top-3 text-dark-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
                <div class="flex gap-2">
                    <select id="filtroEdad" class="bg-dark-bg border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500">
                        <option value="">Todas las edades</option>
                        <option value="menor-18">Menor de 18</option>
                        <option value="18-30">18-30 años</option>
                        <option value="31-50">31-50 años</option>
                        <option value="mayor-50">Mayor de 50</option>
                    </select>
                    <button onclick="exportarPacientes()" class="bg-success hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>Exportar</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-dark-bg">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                            Paciente
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                            Contacto
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                            Edad
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                            Última Cita
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                            Estado
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700" id="tablaPacientes">
                    @foreach($pacientes as $paciente)
                    <tr class="hover:bg-dark-bg transition-colors paciente-row" 
                        data-nombre="{{ strtolower($paciente->nombre . ' ' . $paciente->apellido) }}"
                        data-edad="{{ $paciente->fecha_nacimiento ? \Carbon\Carbon::parse($paciente->fecha_nacimiento)->age : 0 }}">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                                    <span class="text-sm font-semibold text-white">
                                        {{ substr($paciente->nombre, 0, 1) }}{{ substr($paciente->apellido, 0, 1) }}
                                    </span>
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-dark-text">
                                        {{ $paciente->nombre }} {{ $paciente->apellido }}
                                    </div>
                                    <div class="text-sm text-dark-textSecondary">
                                        ID: #{{ str_pad($paciente->id, 4, '0', STR_PAD_LEFT) }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-dark-text">{{ $paciente->telefono ?: 'N/A' }}</div>
                            <div class="text-sm text-dark-textSecondary">{{ $paciente->email ?: 'N/A' }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                            @if($paciente->fecha_nacimiento)
                                {{ \Carbon\Carbon::parse($paciente->fecha_nacimiento)->age }} años
                            @else
                                N/A
                            @endif
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-textSecondary">
                            {{ $paciente->citas()->latest()->first()?->fecha_inicio?->format('d/m/Y') ?: 'Sin citas' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            @if($paciente->tratamientos()->where('estado', 'En Progreso')->exists())
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success bg-opacity-20 text-success">
                                    Activo
                                </span>
                            @else
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-600 bg-opacity-20 text-gray-400">
                                    Inactivo
                                </span>
                            @endif
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex items-center justify-end space-x-2">
                                <a href="{{ route('pacientes.detalle', $paciente) }}" 
                                   class="text-primary-500 hover:text-primary-600 p-1 rounded">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </a>
                                <button onclick="editarPaciente({{ $paciente->id }})" 
                                        class="text-orange-400 hover:text-orange-500 p-1 rounded">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </button>
                                <button onclick="eliminarPaciente({{ $paciente->id }})" 
                                        class="text-danger hover:text-red-600 p-1 rounded">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        @if($pacientes->isEmpty())
        <div class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-dark-textSecondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 class="text-lg font-medium text-dark-text mb-2">No hay pacientes registrados</h3>
            <p class="text-dark-textSecondary mb-4">Comienza agregando tu primer paciente al sistema</p>
            <a href="{{ route('pacientes.crear') }}" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Agregar Paciente</span>
            </a>
        </div>
        @endif
    </div>

    <div class="bg-dark-card rounded-lg p-6 border border-gray-700">
        <h3 class="text-lg font-semibold mb-4">Estadísticas de Pacientes</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-dark-bg rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-dark-textSecondary">Total de Pacientes</p>
                        <p class="text-2xl font-bold">{{ $pacientes->count() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="bg-dark-bg rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-dark-textSecondary">Pacientes Activos</p>
                        <p class="text-2xl font-bold">{{ $pacientes->filter(fn($p) => $p->tratamientos()->where('estado', 'En Progreso')->exists())->count() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-success bg-opacity-20 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="bg-dark-bg rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-dark-textSecondary">Nuevos Este Mes</p>
                        <p class="text-2xl font-bold">{{ $pacientes->filter(fn($p) => $p->created_at->isCurrentMonth())->count() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-orange-500 bg-opacity-20 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                        </svg>
                    </div>
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
            <input type="hidden" id="edit_paciente_id">
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="edit_nombre" class="block text-sm font-medium text-dark-text mb-2">Nombre</label>
                    <input type="text" id="edit_nombre" name="nombre" required 
                           class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                </div>
                <div>
                    <label for="edit_apellido" class="block text-sm font-medium text-dark-text mb-2">Apellido</label>
                    <input type="text" id="edit_apellido" name="apellido" required 
                           class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                </div>
            </div>

            <div>
                <label for="edit_fecha_nacimiento" class="block text-sm font-medium text-dark-text mb-2">Fecha de Nacimiento</label>
                <input type="date" id="edit_fecha_nacimiento" name="fecha_nacimiento" 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div>
                <label for="edit_telefono" class="block text-sm font-medium text-dark-text mb-2">Teléfono</label>
                <input type="tel" id="edit_telefono" name="telefono" 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div>
                <label for="edit_email" class="block text-sm font-medium text-dark-text mb-2">Email</label>
                <input type="email" id="edit_email" name="email" 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
            </div>

            <div>
                <label for="edit_historial" class="block text-sm font-medium text-dark-text mb-2">Historial Médico</label>
                <textarea id="edit_historial" name="historial_medico_relevante" rows="3" 
                          class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500"></textarea>
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
@endsection

@push('scripts')
<script>
    document.getElementById('buscarPaciente').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.paciente-row');
        
        rows.forEach(row => {
            const nombre = row.getAttribute('data-nombre');
            if (nombre.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    document.getElementById('filtroEdad').addEventListener('change', function(e) {
        const filtro = e.target.value;
        const rows = document.querySelectorAll('.paciente-row');
        
        rows.forEach(row => {
            const edad = parseInt(row.getAttribute('data-edad')) || 0;
            let mostrar = true;
            
            switch(filtro) {
                case 'menor-18':
                    mostrar = edad < 18;
                    break;
                case '18-30':
                    mostrar = edad >= 18 && edad <= 30;
                    break;
                case '31-50':
                    mostrar = edad >= 31 && edad <= 50;
                    break;
                case 'mayor-50':
                    mostrar = edad > 50;
                    break;
                default:
                    mostrar = true;
            }
            
            row.style.display = mostrar ? '' : 'none';
        });
    });

    async function editarPaciente(id) {
        try {
            const response = await fetch(`/pacientes/${id}`);
            const paciente = await response.json();
            
            document.getElementById('edit_paciente_id').value = paciente.id;
            document.getElementById('edit_nombre').value = paciente.nombre;
            document.getElementById('edit_apellido').value = paciente.apellido;
            document.getElementById('edit_fecha_nacimiento').value = paciente.fecha_nacimiento;
            document.getElementById('edit_telefono').value = paciente.telefono || '';
            document.getElementById('edit_email').value = paciente.email || '';
            document.getElementById('edit_historial').value = paciente.historial_medico_relevante || '';
            
            document.getElementById('editModal').classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al cargar los datos del paciente', 'error');
        }
    }

    function closeEditModal() {
        document.getElementById('editModal').classList.add('hidden');
    }

    document.getElementById('editForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const id = document.getElementById('edit_paciente_id').value;
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`/pacientes/${id}`, {
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

    async function eliminarPaciente(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este paciente? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const response = await fetch(`/pacientes/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });

            if (response.ok) {
                location.reload();
            } else {
                showNotification('Error al eliminar el paciente', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al eliminar el paciente', 'error');
        }
    }

    function exportarPacientes() {
        const data = [];
        const rows = document.querySelectorAll('.paciente-row');
        
        rows.forEach(row => {
            if (row.style.display !== 'none') {
                const cells = row.querySelectorAll('td');
                data.push({
                    nombre: cells[0].textContent.trim().split('\n')[0].trim(),
                    telefono: cells[1].textContent.trim().split('\n')[0].trim(),
                    email: cells[1].textContent.trim().split('\n')[1].trim(),
                    edad: cells[2].textContent.trim(),
                    ultima_cita: cells[3].textContent.trim(),
                    estado: cells[4].textContent.trim()
                });
            }
        });
        
        const csv = convertToCSV(data);
        downloadCSV(csv, 'pacientes.csv');
    }

    function convertToCSV(data) {
        const headers = ['Nombre', 'Teléfono', 'Email', 'Edad', 'Última Cita', 'Estado'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
        ].join('\n');
        
        return csvContent;
    }

    function downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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