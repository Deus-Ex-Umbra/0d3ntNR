@extends('layouts.app')

@section('title', 'Perfil y Configuración - TailAdmin')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Perfil y Configuración</h1>
        <button onclick="openAnuncioModal()" class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <span>Crear Anuncio con IA</span>
        </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
            <div class="bg-dark-card rounded-lg border border-gray-700">
                <div class="p-6">
                    <div class="text-center">
                        <div class="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-2xl font-bold text-white">
                                {{ substr(Auth::user()->nombre, 0, 1) }}{{ substr(Auth::user()->apellido ?: 'U', 0, 1) }}
                            </span>
                        </div>
                        <h2 class="text-xl font-semibold">Dr. {{ Auth::user()->nombre }} {{ Auth::user()->apellido }}</h2>
                        <p class="text-dark-textSecondary">{{ Auth::user()->email }}</p>
                        <p class="text-sm text-dark-textSecondary mt-2">Miembro desde {{ Auth::user()->created_at->format('M Y') }}</p>
                    </div>

                    <div class="mt-6 pt-6 border-t border-gray-700">
                        <h3 class="font-semibold mb-4">Estadísticas Rápidas</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-dark-textSecondary">Pacientes Totales:</span>
                                <span class="font-medium">{{ Auth::user()->pacientes()->count() }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-dark-textSecondary">Citas Este Mes:</span>
                                <span class="font-medium">{{ Auth::user()->citas()->whereMonth('fecha_inicio', now())->count() }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-dark-textSecondary">Tratamientos Activos:</span>
                                <span class="font-medium">{{ Auth::user()->tratamientos()->where('estado', 'En Progreso')->count() }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
            <div class="bg-dark-card rounded-lg border border-gray-700">
                <div class="p-6 border-b border-gray-700">
                    <h3 class="text-lg font-semibold">Información Personal</h3>
                </div>
                <div class="p-6">
                    <form id="profileForm" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="nombre" class="block text-sm font-medium text-dark-text mb-2">Nombre</label>
                                <input type="text" id="nombre" name="nombre" value="{{ Auth::user()->nombre }}" 
                                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                            </div>
                            <div>
                                <label for="apellido" class="block text-sm font-medium text-dark-text mb-2">Apellido</label>
                                <input type="text" id="apellido" name="apellido" value="{{ Auth::user()->apellido }}" 
                                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                            </div>
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium text-dark-text mb-2">Email</label>
                            <input type="email" id="email" name="email" value="{{ Auth::user()->email }}" 
                                   class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                        </div>
                        <div>
                            <label for="biografia" class="block text-sm font-medium text-dark-text mb-2">Biografía Profesional</label>
                            <textarea id="biografia" name="biografia" rows="3" 
                                      class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                                      placeholder="Describe tu experiencia profesional, especialidades, etc."></textarea>
                        </div>
                        <div class="flex justify-end">
                            <button type="submit" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg">
                                Actualizar Perfil
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="bg-dark-card rounded-lg border border-gray-700">
                <div class="p-6 border-b border-gray-700">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">Consultorios</h3>
                        <button onclick="openConsultorioModal()" class="bg-success hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            <span>Agregar</span>
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <div class="space-y-4" id="consultorios-list">
                        @if(Auth::user()->consultorios()->count() > 0)
                            @foreach(Auth::user()->consultorios as $consultorio)
                            <div class="bg-dark-bg rounded-lg p-4 border border-gray-700">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <h4 class="font-medium">{{ $consultorio->nombre }}</h4>
                                        <p class="text-sm text-dark-textSecondary mt-1">{{ $consultorio->direccion }}</p>
                                        @if($consultorio->url_mapa)
                                            <a href="{{ $consultorio->url_mapa }}" target="_blank" 
                                               class="text-primary-500 hover:text-primary-600 text-sm mt-2 inline-flex items-center">
                                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                </svg>
                                                Ver en Google Maps
                                            </a>
                                        @endif
                                    </div>
                                    <button onclick="eliminarConsultorio({{ $consultorio->id }})" 
                                            class="text-danger hover:text-red-600 p-1 rounded">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            @endforeach
                        @else
                            <div class="text-center py-8">
                                <svg class="mx-auto h-12 w-12 text-dark-textSecondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                <p class="text-dark-textSecondary mb-4">No hay consultorios registrados</p>
                                <button onclick="openConsultorioModal()" class="bg-success hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                                    Agregar Primer Consultorio
                                </button>
                            </div>
                        @endif
                    </div>
                </div>
            </div>

            <div class="bg-dark-card rounded-lg border border-gray-700">
                <div class="p-6 border-b border-gray-700">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">Redes Sociales</h3>
                        <button onclick="openRedSocialModal()" class="bg-success hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            <span>Agregar</span>
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="redes-list">
                        @if(Auth::user()->redesSociales()->count() > 0)
                            @foreach(Auth::user()->redesSociales as $red)
                            <div class="bg-dark-bg rounded-lg p-4 border border-gray-700 flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                        <span class="text-xs font-bold text-white">{{ substr($red->nombre, 0, 2) }}</span>
                                    </div>
                                    <div>
                                        <h4 class="font-medium">{{ $red->nombre }}</h4>
                                        <a href="{{ $red->url }}" target="_blank" class="text-sm text-primary-500 hover:text-primary-600">
                                            Ver perfil
                                        </a>
                                    </div>
                                </div>
                                <button onclick="eliminarRedSocial({{ $red->id }})" 
                                        class="text-danger hover:text-red-600 p-1 rounded">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                            @endforeach
                        @else
                            <div class="col-span-2 text-center py-8">
                                <svg class="mx-auto h-12 w-12 text-dark-textSecondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14m-4-4v2m-2 0V2m2 2H7"></path>
                                </svg>
                                <p class="text-dark-textSecondary mb-4">No hay redes sociales registradas</p>
                                <button onclick="openRedSocialModal()" class="bg-success hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                                    Agregar Primera Red Social
                                </button>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="consultorioModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-dark-card rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Nuevo Consultorio</h3>
            <button onclick="closeConsultorioModal()" class="text-dark-textSecondary hover:text-dark-text">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="consultorioForm" class="space-y-4">
            <div>
                <label for="consultorio_nombre" class="block text-sm font-medium text-dark-text mb-2">Nombre del Consultorio</label>
                <input type="text" id="consultorio_nombre" name="nombre" required 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500"
                       placeholder="Clínica Dental Dr. González">
            </div>

            <div>
                <label for="consultorio_direccion" class="block text-sm font-medium text-dark-text mb-2">Dirección Completa</label>
                <textarea id="consultorio_direccion" name="direccion" required rows="3" 
                          class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                          placeholder="Calle Principal #123, Colonia Centro, Ciudad, Estado"></textarea>
            </div>

            <div class="bg-dark-bg rounded-lg p-3">
                <div class="flex items-center space-x-2 text-sm text-dark-textSecondary">
                    <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Se generará automáticamente un enlace a Google Maps</span>
                </div>
            </div>

            <div class="flex space-x-3 pt-4">
                <button type="submit" class="flex-1 bg-success hover:bg-green-600 text-white py-2 px-4 rounded-lg">
                    Agregar Consultorio
                </button>
                <button type="button" onclick="closeConsultorioModal()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</div>

<div id="redSocialModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-dark-card rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Nueva Red Social</h3>
            <button onclick="closeRedSocialModal()" class="text-dark-textSecondary hover:text-dark-text">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="redSocialForm" class="space-y-4">
            <div>
                <label for="red_nombre" class="block text-sm font-medium text-dark-text mb-2">Red Social</label>
                <div class="flex space-x-2">
                    <select id="red_nombre" name="nombre" required 
                            class="flex-1 px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                        <option value="">Seleccionar red social</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="TikTok">TikTok</option>
                        <option value="YouTube">YouTube</option>
                    </select>
                    <button type="button" onclick="addCustomRedSocial()" 
                            class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div>
                <label for="red_url" class="block text-sm font-medium text-dark-text mb-2">URL del Perfil</label>
                <input type="url" id="red_url" name="url" required 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500"
                       placeholder="https://www.facebook.com/tuperfil">
            </div>

            <div>
                <label for="red_icono" class="block text-sm font-medium text-dark-text mb-2">Ícono (SVG o PNG)</label>
                <input type="file" id="red_icono" name="icono" accept=".svg,.png" required 
                       class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                <p class="text-xs text-dark-textSecondary mt-1">Máximo 1MB, formato SVG o PNG</p>
            </div>

            <div class="flex space-x-3 pt-4">
                <button type="submit" class="flex-1 bg-success hover:bg-green-600 text-white py-2 px-4 rounded-lg">
                    Agregar Red Social
                </button>
                <button type="button" onclick="closeRedSocialModal()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</div>

<div id="anuncioModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-dark-card rounded-lg p-6 w-full max-w-2xl mx-4 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold flex items-center">
                <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
                Crear Anuncio con IA
            </h3>
            <button onclick="closeAnuncioModal()" class="text-dark-textSecondary hover:text-dark-text">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <div class="space-y-6">
            <div class="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                <div class="flex items-center space-x-2 mb-2">
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h4 class="font-medium text-purple-400">¿Cómo funciona?</h4>
                </div>
                <p class="text-sm text-dark-textSecondary">
                    La IA creará anuncios profesionales para tu consultorio dental basándose en la información de tu perfil. 
                    Puedes agregar sugerencias específicas para personalizar el contenido.
                </p>
            </div>

            <form id="anuncioForm" class="space-y-4">
                <div>
                    <label for="tipo_anuncio" class="block text-sm font-medium text-dark-text mb-2">Tipo de Anuncio</label>
                    <select id="tipo_anuncio" name="tipo_anuncio" required 
                            class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                        <option value="">Seleccionar tipo</option>
                        <option value="promocion">Promoción de Servicios</option>
                        <option value="educativo">Contenido Educativo</option>
                        <option value="temporada">Campaña de Temporada</option>
                        <option value="testimonial">Testimonial/Caso de Éxito</option>
                        <option value="tecnologia">Nueva Tecnología</option>
                        <option value="prevencion">Prevención Dental</option>
                    </select>
                </div>

                <div>
                    <label for="target_audience" class="block text-sm font-medium text-dark-text mb-2">Audiencia Objetivo</label>
                    <select id="target_audience" name="target_audience" required 
                            class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                        <option value="">Seleccionar audiencia</option>
                        <option value="familias">Familias con niños</option>
                        <option value="adultos_jovenes">Adultos jóvenes (25-40)</option>
                        <option value="adultos_mayores">Adultos mayores (40+)</option>
                        <option value="profesionales">Profesionales ocupados</option>
                        <option value="estudiantes">Estudiantes</option>
                        <option value="general">Público general</option>
                    </select>
                </div>

                <div>
                    <label for="plataforma" class="block text-sm font-medium text-dark-text mb-2">Plataforma de Destino</label>
                    <select id="plataforma" name="plataforma" required 
                            class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500">
                        <option value="">Seleccionar plataforma</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="google">Google Ads</option>
                        <option value="whatsapp">WhatsApp Business</option>
                        <option value="web">Sitio Web</option>
                        <option value="email">Email Marketing</option>
                    </select>
                </div>

                <div>
                    <label for="sugerencias" class="block text-sm font-medium text-dark-text mb-2">Sugerencias Adicionales</label>
                    <textarea id="sugerencias" name="sugerencias" rows="3" 
                              class="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                              placeholder="Ej: Mencionar descuentos, horarios especiales, servicios destacados, etc."></textarea>
                </div>

                <div class="flex space-x-3 pt-4">
                    <button type="submit" class="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                        <span>Generar Anuncio</span>
                    </button>
                    <button type="button" onclick="closeAnuncioModal()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg">
                        Cancelar
                    </button>
                </div>
            </form>

            <div id="anuncio-resultado" class="hidden">
                <div class="border-t border-gray-700 pt-6">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-lg font-semibold">Anuncio Generado</h4>
                        <div class="flex space-x-2">
                            <button onclick="copyAnuncio()" class="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                                <span>Copiar</span>
                            </button>
                            <button onclick="regenerateAnuncio()" class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                <span>Regenerar</span>
                            </button>
                        </div>
                    </div>
                    <div id="anuncio-content" class="bg-dark-bg rounded-lg p-4 border border-gray-600">
                        <!-- El contenido generado aparecerá aquí -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    function openConsultorioModal() {
        document.getElementById('consultorioModal').classList.remove('hidden');
    }

    function closeConsultorioModal() {
        document.getElementById('consultorioModal').classList.add('hidden');
        document.getElementById('consultorioForm').reset();
    }

    document.getElementById('consultorioForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/perfil/consultorios', {
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
                showNotification('Error al agregar el consultorio', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al agregar el consultorio', 'error');
        }
    });

    async function eliminarConsultorio(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este consultorio?')) {
            return;
        }

        try {
            const response = await fetch(`/perfil/consultorios/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });

            if (response.ok) {
                location.reload();
            } else {
                showNotification('Error al eliminar el consultorio', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al eliminar el consultorio', 'error');
        }
    }

    function openRedSocialModal() {
        document.getElementById('redSocialModal').classList.remove('hidden');
    }

    function closeRedSocialModal() {
        document.getElementById('redSocialModal').classList.add('hidden');
        document.getElementById('redSocialForm').reset();
    }

    function addCustomRedSocial() {
        const nueva = prompt('Nueva red social:');
        if (nueva && nueva.trim()) {
            const select = document.getElementById('red_nombre');
            const option = document.createElement('option');
            option.value = nueva.trim();
            option.textContent = nueva.trim();
            option.selected = true;
            select.appendChild(option);
        }
    }

    document.getElementById('redSocialForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        try {
            const response = await fetch('/perfil/redes-sociales', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: formData
            });

            if (response.ok) {
                location.reload();
            } else {
                showNotification('Error al agregar la red social', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al agregar la red social', 'error');
        }
    });

    async function eliminarRedSocial(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta red social?')) {
            return;
        }

        try {
            const response = await fetch(`/perfil/redes-sociales/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });

            if (response.ok) {
                location.reload();
            } else {
                showNotification('Error al eliminar la red social', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al eliminar la red social', 'error');
        }
    }

    function openAnuncioModal() {
        document.getElementById('anuncioModal').classList.remove('hidden');
        document.getElementById('anuncio-resultado').classList.add('hidden');
    }

    function closeAnuncioModal() {
        document.getElementById('anuncioModal').classList.add('hidden');
        document.getElementById('anuncioForm').reset();
        document.getElementById('anuncio-resultado').classList.add('hidden');
    }

    document.getElementById('anuncioForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Generando...</span>
        `;
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            const prompt = construirPromptAnuncio(data);
            
            const response = await fetch('/gemini/generar-respuesta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ prompt: prompt })
            });

            if (response.ok) {
                const result = await response.json();
                mostrarResultadoAnuncio(result);
            } else {
                showNotification('Error al generar el anuncio', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al generar el anuncio', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });

    function construirPromptAnuncio(data) {
        const userInfo = `{{ Auth::user()->nombre }} {{ Auth::user()->apellido }}`;
        const consultorios = '{{ Auth::user()->consultorios->pluck("nombre")->implode(", ") }}';
        
        return `
Crea un anuncio profesional para consultorio dental con las siguientes características:

Dentista: Dr. ${userInfo}
Consultorio(s): ${consultorios || 'Consultorio Dental'}
Tipo de anuncio: ${data.tipo_anuncio}
Audiencia objetivo: ${data.target_audience}
Plataforma: ${data.plataforma}
Sugerencias adicionales: ${data.sugerencias || 'Ninguna'}

El anuncio debe ser:
- Profesional y confiable
- Atractivo para la audiencia objetivo
- Adecuado para la plataforma seleccionada
- Incluir llamada a la acción clara
- Máximo 300 palabras

Formato: Incluye título, cuerpo del mensaje y llamada a la acción.
        `;
    }

    function mostrarResultadoAnuncio(result) {
        let contenido = '';
        
        if (result.candidates && result.candidates[0] && result.candidates[0].content) {
            contenido = result.candidates[0].content.parts[0].text;
        } else if (result.text) {
            contenido = result.text;
        } else {
            contenido = 'No se pudo generar el anuncio. Inténtalo de nuevo.';
        }
        
        document.getElementById('anuncio-content').innerHTML = `
            <div class="whitespace-pre-wrap text-dark-text">${contenido}</div>
        `;
        
        document.getElementById('anuncio-resultado').classList.remove('hidden');
    }

    function copyAnuncio() {
        const content = document.getElementById('anuncio-content').textContent;
        navigator.clipboard.writeText(content).then(function() {
            showNotification('Anuncio copiado al portapapeles', 'success');
        });
    }

    function regenerateAnuncio() {
        document.getElementById('anuncioForm').dispatchEvent(new Event('submit'));
    }

    document.getElementById('profileForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/perfil/actualizar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showNotification('Perfil actualizado exitosamente', 'success');
            } else {
                showNotification('Error al actualizar el perfil', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al actualizar el perfil', 'error');
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