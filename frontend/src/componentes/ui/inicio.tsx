import { useAutenticacion } from '../contextos/contexto-autenticacion';

export function Inicio() {
  const { usuario } = useAutenticacion();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bienvenido, {usuario?.nombre}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sistema de gestión para clínica dental
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Pacientes
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona la información de tus pacientes
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Agenda
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Organiza tus citas y horarios
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Tratamientos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Administra planes de tratamiento
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Finanzas
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Control de ingresos y egresos
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Reportes
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Visualiza estadísticas y reportes
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Configuración
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Personaliza tu perfil y sistema
          </p>
        </div>
      </div>
    </div>
  );
}