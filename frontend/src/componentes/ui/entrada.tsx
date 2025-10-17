import { InputHTMLAttributes, forwardRef } from 'react';

interface PropiedadesEntrada extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string;
  error?: string;
}

export const Entrada = forwardRef<HTMLInputElement, PropiedadesEntrada>(
  ({ className = '', etiqueta, error, id, ...props }, ref) => {
    const input_id = id || etiqueta?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {etiqueta && (
          <label
            htmlFor={input_id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {etiqueta}
          </label>
        )}
        <input
          ref={ref}
          id={input_id}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Entrada.displayName = 'Entrada';