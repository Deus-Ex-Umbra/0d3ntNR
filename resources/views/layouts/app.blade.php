<!DOCTYPE html>
<html lang="es" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'TailAdmin - Sistema Dental')</title>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        'sans': ['Instrument Sans', 'sans-serif'],
                    },
                    colors: {
                        primary: {
                            50: '#eff6ff',
                            500: '#3C50E0',
                            600: '#3730a3',
                            700: '#312e81',
                        },
                        dark: {
                            bg: '#1C2434',
                            card: '#2E3A4D',
                            text: '#FFFFFF',
                            textSecondary: '#8A99AF',
                        },
                        success: '#10B981',
                        danger: '#F53003',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-dark-bg text-dark-text font-sans">
    <div class="flex h-screen overflow-hidden">
        <aside class="w-64 bg-dark-card border-r border-gray-700 flex-shrink-0">
            <div class="p-6">
                <h1 class="text-2xl font-bold text-primary-500">TailAdmin</h1>
            </div>
            
            <nav class="mt-6">
                <div class="px-6 space-y-2">
                    <a href="{{ route('dashboard') }}" class="flex items-center px-4 py-3 rounded-lg hover:bg-primary-500 hover:bg-opacity-20 {{ request()->routeIs('dashboard') ? 'bg-primary-500 bg-opacity-20 text-primary-500' : '' }}">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
                        </svg>
                        Dashboard
                    </a>
                    
                    <a href="{{ route('citas.calendario') }}" class="flex items-center px-4 py-3 rounded-lg hover:bg-primary-500 hover:bg-opacity-20 {{ request()->routeIs('citas.*') ? 'bg-primary-500 bg-opacity-20 text-primary-500' : '' }}">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"></path>
                        </svg>
                        Calendario
                    </a>
                    
                    <a href="{{ route('pacientes.todos') }}" class="flex items-center px-4 py-3 rounded-lg hover:bg-primary-500 hover:bg-opacity-20 {{ request()->routeIs('pacientes.*') ? 'bg-primary-500 bg-opacity-20 text-primary-500' : '' }}">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                        Pacientes
                    </a>
                    
                    <div class="space-y-1">
                        <button class="flex items-center w-full px-4 py-3 rounded-lg hover:bg-primary-500 hover:bg-opacity-20" onclick="toggleSubmenu('facturacion')">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                            Facturación
                            <svg class="w-4 h-4 ml-auto transition-transform" id="facturacion-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div class="hidden pl-8 space-y-1" id="facturacion-submenu">
                            <a href="{{ route('transacciones.todas') }}" class="block px-4 py-2 rounded-lg hover:bg-primary-500 hover:bg-opacity-20 {{ request()->routeIs('transacciones.*') ? 'text-primary-500' : '' }}">
                                Transacciones
                            </a>
                        </div>
                    </div>
                    
                    <a href="{{ route('horarios.mostrar') }}" class="flex items-center px-4 py-3 rounded-lg hover:bg-primary-500 hover:bg-opacity-20 {{ request()->routeIs('horarios.*') ? 'bg-primary-500 bg-opacity-20 text-primary-500' : '' }}">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Horarios
                    </a>

                    <a href="{{ route('perfil.mostrar') }}" class="flex items-center px-4 py-3 rounded-lg hover:bg-primary-500 hover:bg-opacity-20 {{ request()->routeIs('perfil.*') ? 'bg-primary-500 bg-opacity-20 text-primary-500' : '' }}">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Perfil
                    </a>
                </div>
            </nav>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="bg-dark-card border-b border-gray-700 px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex-1 max-w-md">
                        <div class="relative">
                            <input type="text" placeholder="Buscar..." class="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-primary-500">
                            <svg class="w-4 h-4 absolute left-3 top-3 text-dark-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <button class="p-2 rounded-lg hover:bg-dark-bg">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                            </svg>
                        </button>
                        
                        <div class="relative">
                            <button class="p-2 rounded-lg hover:bg-dark-bg relative" onclick="toggleNotifications()">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
                                <span class="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full"></span>
                            </button>
                            
                            <div class="hidden absolute right-0 top-12 w-80 bg-dark-card border border-gray-600 rounded-lg shadow-lg z-50" id="notifications-dropdown">
                                <div class="p-4 border-b border-gray-600">
                                    <h3 class="font-semibold">Notificaciones</h3>
                                </div>
                                <div class="max-h-64 overflow-y-auto">
                                    <div id="notifications-list"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="relative">
                            <button class="flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-bg" onclick="toggleProfileMenu()">
                                <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                    <span class="text-sm font-semibold">{{ substr(Auth::user()->nombre, 0, 1) }}</span>
                                </div>
                                <span class="hidden md:block">{{ Auth::user()->nombre }}</span>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            
                            <div class="hidden absolute right-0 top-12 w-48 bg-dark-card border border-gray-600 rounded-lg shadow-lg z-50" id="profile-dropdown">
                                <div class="p-2">
                                    <a href="{{ route('perfil.mostrar') }}" class="block px-4 py-2 rounded-lg hover:bg-dark-bg">Perfil</a>
                                    <a href="{{ route('horarios.mostrar') }}" class="block px-4 py-2 rounded-lg hover:bg-dark-bg">Configuración</a>
                                    <hr class="my-2 border-gray-600">
                                    <form method="POST" action="{{ route('logout') }}">
                                        @csrf
                                        <button type="submit" class="block w-full text-left px-4 py-2 rounded-lg hover:bg-dark-bg text-danger">
                                            Cerrar Sesión
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-auto bg-dark-bg p-6">
                @if(session('exito'))
                    <div class="mb-6 bg-success bg-opacity-20 border border-success text-success px-4 py-3 rounded-lg">
                        {{ session('exito') }}
                    </div>
                @endif

                @if($errors->any())
                    <div class="mb-6 bg-danger bg-opacity-20 border border-danger text-danger px-4 py-3 rounded-lg">
                        <ul class="list-disc list-inside">
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                @yield('content')
            </main>
        </div>
    </div>

    <script>
        function toggleSubmenu(id) {
            const submenu = document.getElementById(id + '-submenu');
            const arrow = document.getElementById(id + '-arrow');
            submenu.classList.toggle('hidden');
            arrow.classList.toggle('rotate-180');
        }

        function toggleNotifications() {
            const dropdown = document.getElementById('notifications-dropdown');
            dropdown.classList.toggle('hidden');
            if (!dropdown.classList.contains('hidden')) {
                loadNotifications();
            }
        }

        function toggleProfileMenu() {
            const dropdown = document.getElementById('profile-dropdown');
            dropdown.classList.toggle('hidden');
        }

        async function loadNotifications() {
            try {
                const response = await fetch('/notificaciones');
                const notifications = await response.json();
                const container = document.getElementById('notifications-list');
                
                if (notifications.length === 0) {
                    container.innerHTML = '<div class="p-4 text-center text-dark-textSecondary">No hay notificaciones</div>';
                } else {
                    container.innerHTML = notifications.map(notif => `
                        <div class="p-4 border-b border-gray-600 hover:bg-dark-bg cursor-pointer" onclick="markAsRead(${notif.id})">
                            <p class="text-sm">${notif.mensaje}</p>
                            <span class="text-xs text-dark-textSecondary">${new Date(notif.created_at).toLocaleDateString()}</span>
                        </div>
                    `).join('');
                }
            } catch (error) {
                console.error('Error al cargar notificaciones:', error);
            }
        }

        async function markAsRead(id) {
            try {
                await fetch(`/notificaciones/${id}/leer`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Content-Type': 'application/json',
                    }
                });
                loadNotifications();
            } catch (error) {
                console.error('Error al marcar como leída:', error);
            }
        }

        document.addEventListener('click', function(event) {
            const notifDropdown = document.getElementById('notifications-dropdown');
            const profileDropdown = document.getElementById('profile-dropdown');
            
            if (!event.target.closest('[onclick="toggleNotifications()"]') && !notifDropdown.contains(event.target)) {
                notifDropdown.classList.add('hidden');
            }
            
            if (!event.target.closest('[onclick="toggleProfileMenu()"]') && !profileDropdown.contains(event.target)) {
                profileDropdown.classList.add('hidden');
            }
        });
    </script>
    
    @stack('scripts')
</body>
</html>