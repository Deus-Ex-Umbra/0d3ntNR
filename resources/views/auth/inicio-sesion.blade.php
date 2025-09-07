<!DOCTYPE html>
<html lang="es" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Iniciar Sesión - TailAdmin</title>
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
                            500: '#3C50E0',
                            600: '#3730a3',
                        },
                        dark: {
                            bg: '#1C2434',
                            card: '#2E3A4D',
                            text: '#FFFFFF',
                            textSecondary: '#8A99AF',
                        },
                        danger: '#F53003',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-dark-bg text-dark-text font-sans">
    <div class="min-h-screen flex">
        <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
            <div class="mx-auto w-full max-w-sm lg:w-96">
                <div>
                    <h2 class="text-3xl font-bold text-primary-500 mb-2">TailAdmin</h2>
                    <h3 class="text-2xl font-semibold mb-2">Iniciar Sesión</h3>
                    <p class="text-dark-textSecondary">Ingresa tus credenciales para acceder a tu cuenta</p>
                </div>

                <div class="mt-8">
                    @if($errors->any())
                        <div class="mb-6 bg-danger bg-opacity-20 border border-danger text-danger px-4 py-3 rounded-lg">
                            <ul class="list-disc list-inside">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form method="POST" action="{{ route('login') }}" class="space-y-6">
                        @csrf
                        
                        <div>
                            <label for="email" class="block text-sm font-medium text-dark-text mb-2">
                                Correo Electrónico
                            </label>
                            <input type="email" 
                                   id="email" 
                                   name="email" 
                                   value="{{ old('email') }}"
                                   required 
                                   class="w-full px-3 py-3 bg-dark-card border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                                   placeholder="ejemplo@correo.com">
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-dark-text mb-2">
                                Contraseña
                            </label>
                            <div class="relative">
                                <input type="password" 
                                       id="password" 
                                       name="password" 
                                       required 
                                       class="w-full px-3 py-3 bg-dark-card border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors pr-12"
                                       placeholder="••••••••">
                                <button type="button" 
                                        onclick="togglePassword()" 
                                        class="absolute right-3 top-3 text-dark-textSecondary hover:text-dark-text">
                                    <svg id="eye-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <input type="checkbox" 
                                       id="remember" 
                                       name="remember" 
                                       class="h-4 w-4 text-primary-500 bg-dark-card border-gray-600 rounded focus:ring-primary-500">
                                <label for="remember" class="ml-2 text-sm text-dark-textSecondary">
                                    Mantener sesión iniciada
                                </label>
                            </div>
                        </div>

                        <div>
                            <button type="submit" 
                                    class="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                                Iniciar Sesión
                            </button>
                        </div>

                        <div class="text-center">
                            <p class="text-dark-textSecondary">
                                ¿No tienes una cuenta? 
                                <a href="{{ route('register') }}" class="text-primary-500 hover:text-primary-600 font-semibold">
                                    Registrarse
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="hidden lg:block relative w-0 flex-1">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <div class="text-center text-white">
                    <div class="w-64 h-64 mx-auto mb-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <h3 class="text-3xl font-bold mb-4">Gestión Dental Profesional</h3>
                    <p class="text-xl opacity-90 max-w-md mx-auto">
                        Simplifica la administración de tu consultorio dental con nuestro sistema integral
                    </p>
                </div>
            </div>
        </div>
    </div>

    <script>
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eye-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                `;
            } else {
                passwordInput.type = 'password';
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                `;
            }
        }
    </script>
</body>
</html>