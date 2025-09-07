@extends('layouts.app')

@section('title', 'Dashboard - TailAdmin')

@section('content')
<div class="space-y-6">
    <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h1 class="text-2xl font-bold mb-2">¡Buen trabajo, Dr. {{ Auth::user()->nombre }}!</h1>
        <p class="opacity-90">Aquí tienes un resumen de tu consultorio para hoy</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-dark-card rounded-lg p-6 border border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-textSecondary text-sm font-medium">Ingresos Hoy</p>
                    <p class="text-2xl font-bold">$2,350</p>
                    <p class="text-success text-sm mt-1">
                        <span class="inline-flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                            </svg>
                            +12% desde ayer
                        </span>
                    </p>
                </div>
                <div class="bg-success bg-opacity-20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-dark-card rounded-lg p-6 border border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-textSecondary text-sm font-medium">Citas Hoy</p>
                    <p class="text-2xl font-bold">{{ $stats['citas_hoy'] }}</p>
                    <p class="text-primary-500 text-sm mt-1">
                        <span class="inline-flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"></path>
                            </svg>
                            3 próximas
                        </span>
                    </p>
                </div>
                <div class="bg-primary-500 bg-opacity-20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-dark-card rounded-lg p-6 border border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-textSecondary text-sm font-medium">Total Pacientes</p>
                    <p class="text-2xl font-bold">{{ $stats['total_pacientes'] }}</p>
                    <p class="text-success text-sm mt-1">
                        <span class="inline-flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                            </svg>
                            +5 este mes
                        </span>
                    </p>
                </div>
                <div class="bg-purple-500 bg-opacity-20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-dark-card rounded-lg p-6 border border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-textSecondary text-sm font-medium">Tratamientos Activos</p>
                    <p class="text-2xl font-bold">8</p>
                    <p class="text-orange-400 text-sm mt-1">
                        <span class="inline-flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            2 por finalizar
                        </span>
                    </p>
                </div>
                <div class="bg-orange-500 bg-opacity-20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-dark-card rounded-lg p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold">Ingresos de los Últimos 7 Días</h3>
                <select class="bg-dark-bg border border-gray-600 rounded-lg px-3 py-2 text-sm">
                    <option>Últimos 7 días</option>
                    <option>Últimos 30 días</option>
                    <option>Últimos 3 meses</option>
                </select>
            </div>
            <div class="h-64">
                <canvas id="incomeChart"></canvas>
            </div>
        </div>

        <div class="bg-dark-card rounded-lg p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold">Tipos de Tratamiento</h3>
                <button class="text-primary-500 text-sm hover:text-primary-600">Ver todos</button>
            </div>
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                        <span class="text-sm">Limpiezas</span>
                    </div>
                    <div class="text-right">
                        <span class="text-sm font-semibold">45%</span>
                        <div class="w-20 h-2 bg-gray-600 rounded-full mt-1">
                            <div class="w-9 h-2 bg-primary-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-success rounded-full mr-3"></div>
                        <span class="text-sm">Ortodoncia</span>
                    </div>
                    <div class="text-right">
                        <span class="text-sm font-semibold">30%</span>
                        <div class="w-20 h-2 bg-gray-600 rounded-full mt-1">
                            <div class="w-6 h-2 bg-success rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                        <span class="text-sm">Implantes</span>
                    </div>
                    <div class="text-right">
                        <span class="text-sm font-semibold">15%</span>
                        <div class="w-20 h-2 bg-gray-600 rounded-full mt-1">
                            <div class="w-3 h-2 bg-orange-400 rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                        <span class="text-sm">Blanqueamiento</span>
                    </div>
                    <div class="text-right">
                        <span class="text-sm font-semibold">10%</span>
                        <div class="w-20 h-2 bg-gray-600 rounded-full mt-1">
                            <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-dark-card rounded-lg border border-gray-700">
            <div class="p-6 border-b border-gray-700">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Próximas Citas</h3>
                    <a href="{{ route('citas.calendario') }}" class="text-primary-500 text-sm hover:text-primary-600">Ver calendario</a>
                </div>
            </div>
            <div class="p-6">
                <div class="space-y-4" id="proximas-citas">
                    <div class="flex items-center space-x-4 p-3 bg-dark-bg rounded-lg">
                        <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <span class="text-sm font-semibold">MA</span>
                        </div>
                        <div class="flex-1">
                            <p class="font-medium">María Ángeles</p>
                            <p class="text-sm text-dark-textSecondary">Limpieza dental</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium">10:00 AM</p>
                            <p class="text-xs text-dark-textSecondary">Hoy</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4 p-3 bg-dark-bg rounded-lg">
                        <div class="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                            <span class="text-sm font-semibold">JS</span>
                        </div>
                        <div class="flex-1">
                            <p class="font-medium">Juan Silva</p>
                            <p class="text-sm text-dark-textSecondary">Revisión ortodoncia</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium">2:30 PM</p>
                            <p class="text-xs text-dark-textSecondary">Hoy</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4 p-3 bg-dark-bg rounded-lg">
                        <div class="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                            <span class="text-sm font-semibold">LP</span>
                        </div>
                        <div class="flex-1">
                            <p class="font-medium">Laura Pérez</p>
                            <p class="text-sm text-dark-textSecondary">Consulta inicial</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium">4:00 PM</p>
                            <p class="text-xs text-dark-textSecondary">Mañana</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-dark-card rounded-lg border border-gray-700">
            <div class="p-6 border-b border-gray-700">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Transacciones Recientes</h3>
                    <a href="{{ route('transacciones.todas') }}" class="text-primary-500 text-sm hover:text-primary-600">Ver todas</a>
                </div>
            </div>
            <div class="p-6">
                <div class="space-y-4" id="transacciones-recientes">
                    <div class="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 bg-success bg-opacity-20 rounded-full flex items-center justify-center">
                                <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium">Pago - María Ángeles</p>
                                <p class="text-xs text-dark-textSecondary">Limpieza dental</p>
                            </div>
                        </div>
                        <span class="text-success font-semibold">+$150</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 bg-success bg-opacity-20 rounded-full flex items-center justify-center">
                                <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium">Pago - Juan Silva</p>
                                <p class="text-xs text-dark-textSecondary">Ortodoncia</p>
                            </div>
                        </div>
                        <span class="text-success font-semibold">+$300</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 bg-danger bg-opacity-20 rounded-full flex items-center justify-center">
                                <svg class="w-4 h-4 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium">Gasto - Materiales</p>
                                <p class="text-xs text-dark-textSecondary">Compra de instrumental</p>
                            </div>
                        </div>
                        <span class="text-danger font-semibold">-$200</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    const ctx = document.getElementById('incomeChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Ingresos',
                data: [1200, 1900, 800, 2100, 1800, 1500, 2200],
                borderColor: '#3C50E0',
                backgroundColor: 'rgba(60, 80, 224, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(138, 153, 175, 0.1)'
                    },
                    ticks: {
                        color: '#8A99AF',
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(138, 153, 175, 0.1)'
                    },
                    ticks: {
                        color: '#8A99AF'
                    }
                }
            }
        }
    });
</script>
@endpush