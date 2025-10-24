import { useState, useEffect } from 'react';

/**
 * Hook que retrasa la actualización de un valor hasta que el usuario deje de escribir
 * @param value - El valor a "debounce" (ej: el input del usuario)
 * @param delay - Tiempo en milisegundos de espera (default: 300ms)
 * @returns El valor "debounced"
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Crear un timeout que actualizará el valor después del delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup: cancelar el timeout si el valor cambia antes de que se cumpla el delay
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}