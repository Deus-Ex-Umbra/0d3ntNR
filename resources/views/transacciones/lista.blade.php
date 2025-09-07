@extends('layouts.app')

@section('title', 'Transacciones - TailAdmin')

@section('content')
<div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-bold">Gestión Financiera</h1>
        <button onclick="openTransactionModal()" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-fit">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Nueva Transacción</span>
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-dark-card rounded-lg p-6 border border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-textSecondary text-sm font-medium">Ingresos del Mes</p>
                    <p class="text-2xl font-bold text-success">
                        ${{ number_format($transacciones->where('tipo', 'Ingreso')->where('fecha', '>=', now()->startOfMonth())->sum('monto'), 2) }}
                    </p>
                </div>
                <div class="bg-success bg-opacity-20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-dark-card rounded-lg p-6 border border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-textSecondary text-sm font-medium">Egresos del Mes</p>
                    <p class="text-2xl font-bold text-danger">
                        ${{ number_format($transacciones->where('tipo', 'Egreso')->where('fecha', '>=', now()->startOfMonth())->sum('monto'), 2) }}
                    </p>
                </div>
                <div class="bg-danger bg-opacity-20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-dark-card rounded-lg p-6 border border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-textSecondary text-sm font-medium">Balance del Mes</p>
                    @php
                        $ingresos = $transacciones->where('tipo', 'Ingreso')->where('fecha', '>=', now()->startOfMonth())->sum('monto');
                        $egresos = $transacciones->where('tipo', 'Egreso')->where('fecha', '>=', now()->startOfMonth())->sum('monto');
                        $balance = $ingresos - $egresos;
                    @endphp
                    <p class="text-2xl font-bold {{ $balance >= 0 ? 'text-success' : 'text-danger' }}">
                        ${{ number_format($balance, 2) }}
                    </p>
                </div>
                <div class="bg-{{ $balance >= 0 ? 'success' : 'danger' }} bg-opacity-20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-{{ $balance >= 0 ? 'success' : 'danger' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-dark-card rounded-lg p-6 border border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-textSecondary text-sm font-medium">Total Transacciones</p>
                    <p class="text-2xl font-bold">{{ $transacciones->count() }}</p>
                </div>
                <div class="bg-primary-500 bg-opacity-20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <div class="bg-dark-card rounded-lg border border-gray-700">
        <div class="p-6 border-b border-gray-700">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1">
                    <div class="relative">
                        <input type="text" id="buscarTransaccion" placeholder="Buscar transacciones..." 
                               class="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-primary-500">
                        <svg class="w-4 h-4 absolute left-3 top-3 text-dark-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
                <div class="flex gap-2">
                    <select id="filtroTipo" class="bg-dark-bg border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500">
                        <option value="">Todos los tipos</option>
                        <option value="Ingreso">Ingresos</option>
                        <option value="Egreso">Egresos</option>
                    </select>
                    <select id="filtroMes" class="bg-dark-bg border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500">
                        <option value="">Todos los meses</option>
                        <option value="este-mes">Este mes</option>
                        <option value="mes-anterior">Mes anterior</option>
                        <option value="ultimos-3-meses">Últimos 3 meses</option>
                    </select>
                    <button onclick="exportarTransacciones()" class="bg-success hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
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
                            Fecha
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                            Descripción
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                            Paciente
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                            Método de Pago
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                            Tipo
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                            Monto
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700" id="tablaTransacciones">
                    @foreach($transacciones as $transaccion)
                    <tr class="hover:bg-dark-bg transition-colors transaccion-row" 
                        data-descripcion="{{ strtolower($transaccion->descripcion) }}"
                        data-tipo="{{ $transaccion->tipo }}"
                        data-fecha="{{ $transaccion->fecha->format('Y-m') }}">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                            {{ $transaccion->fecha->format('d/m/Y') }}
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-dark-text">{{ $transaccion->descripcion }}</div>
                            @if($transaccion->tratamiento)
                                <div class="text-sm text-dark-textSecondary">{{ $transaccion->tratamiento->nombre }}</div>
                            @endif
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                            @if($transaccion->paciente)
                                {{ $transaccion->paciente->nombre }} {{ $transaccion->paciente->apellido }}
                            @else
                                <span class="text-dark-textSecondary">N/A</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                            {{ $transaccion->metodo_pago ?: 'N/A' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                {{ $transaccion->tipo == 'Ingreso' ? 'bg-success bg-opacity-20 text-success' : 'bg-danger bg-opacity-20 text-danger' }}">
                                {{ $transaccion->tipo }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium
                            {{ $transaccion->tipo == 'Ingreso' ? 'text-success' : 'text-danger' }}">
                            {{ $transaccion->tipo == 'Ingreso' ? '+' : '-' }}${{ number_format($transaccion->monto, 2) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onclick="eliminarTransaccion({{ $transaccion->id }})" 
                                    class="text-danger hover:text-red-600 p-1 rounded">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        @if($transacciones->isEmpty())
        <div class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-dark-textSecondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
            <h3 class="text-lg font-medium text-dark-text mb-2">No hay transacciones registradas</h3>
            <p class="text-dark-textSecondary mb-4">Comienza registrando tu primera transacción</p>
            <button onclick="openTransactionModal()" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Nueva Transacción</span>
            </button>
        </div>
        @endif
    </div>
</div>

<div id="transactionModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-dark-card rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Nueva Transacción</h3>
            <button onclick="closeTransactionModal()" class="text-dark-textSecondary hover:text-dark-text">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="transactionForm" class="space-y-4">
            <div>
                <label for="descripcion" class="block text-sm font-medium text-dark-text mb-2">
                    Descripción <span class="text-danger">*</span>
                </label>
                <input type="text" id="descripcion" name="descripcion" required 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500"
                       placeholder="Descripción de la transacción">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="monto" class="block text-sm font-medium text-dark-text mb-2">
                        Monto <span class="text-danger">*</span>
                    </label>
                    <input type="number" id="monto" name="monto" min="0" step="0.01" required 
                           class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                </div>
                <div>
                    <label for="tipo" class="block text-sm font-medium text-dark-text mb-2">
                        Tipo <span class="text-danger">*</span>
                    </label>
                    <select id="tipo" name="tipo" required 
                            class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                        <option value="">Seleccionar</option>
                        <option value="Ingreso">Ingreso</option>
                        <option value="Egreso">Egreso</option>
                    </select>
                </div>
            </div>

            <div>
                <label for="fecha" class="block text-sm font-medium text-dark-text mb-2">
                    Fecha <span class="text-danger">*</span>
                </label>
                <input type="date" id="fecha" name="fecha" required 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
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
                <label for="metodo_pago" class="block text-sm font-medium text-dark-text mb-2">Método de Pago</label>
                <div class="flex space-x-2">
                    <select id="metodo_pago" name="metodo_pago" 
                            class="flex-1 px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                        <option value="">Seleccionar método</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                        <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Cheque">Cheque</option>
                    </select>
                    <button type="button" onclick="addMetodoPago()" 
                            class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="flex space-x-3 pt-4">
                <button type="submit" class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg">
                    Guardar Transacción
                </button>
                <button type="button" onclick="closeTransactionModal()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        loadPacientes();
        document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    });

    document.getElementById('buscarTransaccion').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.transaccion-row');
        
        rows.forEach(row => {
            const descripcion = row.getAttribute('data-descripcion');
            if (descripcion.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    document.getElementById('filtroTipo').addEventListener('change', function(e) {
        const filtro = e.target.value;
        const rows = document.querySelectorAll('.transaccion-row');
        
        rows.forEach(row => {
            const tipo = row.getAttribute('data-tipo');
            if (!filtro || tipo === filtro) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    document.getElementById('filtroMes').addEventListener('change', function(e) {
        const filtro = e.target.value;
        const rows = document.querySelectorAll('.transaccion-row');
        const now = new Date();
        
        rows.forEach(row => {
            const fechaRow = row.getAttribute('data-fecha');
            let mostrar = true;
            
            switch(filtro) {
                case 'este-mes':
                    const esteAno = now.getFullYear();
                    const esteMes = (now.getMonth() + 1).toString().padStart(2, '0');
                    mostrar = fechaRow === `${esteAno}-${esteMes}`;
                    break;
                case 'mes-anterior':
                    const mesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    const anoAnterior = mesAnterior.getFullYear();
                    const numMesAnterior = (mesAnterior.getMonth() + 1).toString().padStart(2, '0');
                    mostrar = fechaRow === `${anoAnterior}-${numMesAnterior}`;
                    break;
                case 'ultimos-3-meses':
                    const hace3Meses = new Date(now.getFullYear(), now.getMonth() - 2, 1);
                    mostrar = new Date(fechaRow + '-01') >= hace3Meses;
                    break;
                default:
                    mostrar = true;
            }
            
            row.style.display = mostrar ? '' : 'none';
        });
    });

    function openTransactionModal() {
        document.getElementById('transactionModal').classList.remove('hidden');
    }

    function closeTransactionModal() {
        document.getElementById('transactionModal').classList.add('hidden');
        document.getElementById('transactionForm').reset();
        document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    }

    document.getElementById('transactionForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/transacciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                location.reload();
            } else {
                showNotification('Error al guardar la transacción', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al guardar la transacción', 'error');
        }
    });

    async function eliminarTransaccion(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
            return;
        }

        try {
            const response = await fetch(`/transacciones/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });

            if (response.ok) {
                location.reload();
            } else {
                showNotification('Error al eliminar la transacción', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al eliminar la transacción', 'error');
        }
    }

    async function loadPacientes() {
        try {
            const response = await fetch('/api/pacientes');
            const pacientes = await response.json();
            
            const select = document.getElementById('paciente_id');
            select.innerHTML = '<option value="">Seleccionar paciente</option>';
            
            pacientes.forEach(paciente => {
                const option = document.createElement('option');
                option.value = paciente.id;
                option.textContent = `${paciente.nombre} ${paciente.apellido}`;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
        }
    }

    function openPacienteModal() {
        const nombre = prompt('Nombre del paciente:');
        if (!nombre) return;
        
        const apellido = prompt('Apellido del paciente:');
        if (!apellido) return;
        
        createPaciente({ nombre, apellido });
    }

    async function createPaciente(data) {
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
                loadPacientes();
                showNotification('Paciente creado exitosamente', 'success');
            } else {
                showNotification('Error al crear el paciente', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al crear el paciente', 'error');
        }
    }

    function addMetodoPago() {
        const nuevo = prompt('Nuevo método de pago:');
        if (nuevo && nuevo.trim()) {
            const select = document.getElementById('metodo_pago');
            const option = document.createElement('option');
            option.value = nuevo.trim();
            option.textContent = nuevo.trim();
            option.selected = true;
            select.appendChild(option);
        }
    }

    function exportarTransacciones() {
        const data = [];
        const rows = document.querySelectorAll('.transaccion-row');
        
        rows.forEach(row => {
            if (row.style.display !== 'none') {
                const cells = row.querySelectorAll('td');
                data.push({
                    fecha: cells[0].textContent.trim(),
                    descripcion: cells[1].textContent.trim().split('\n')[0].trim(),
                    paciente: cells[2].textContent.trim(),
                    metodo_pago: cells[3].textContent.trim(),
                    tipo: cells[4].textContent.trim(),
                    monto: cells[5].textContent.trim()
                });
            }
        });
        
        const csv = convertToCSV(data);
        downloadCSV(csv, 'transacciones.csv');
    }

    function convertToCSV(data) {
        const headers = ['Fecha', 'Descripción', 'Paciente', 'Método de Pago', 'Tipo', 'Monto'];
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