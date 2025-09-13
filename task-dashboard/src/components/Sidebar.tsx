import { useState } from 'react';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (newTerm: string) => void;
}

export function Sidebar({searchTerm, onSearchChange}: SearchBarProps) {
    return(
        <>
            <h1 className="text-2xl font-semibold text-white text-center p-3">Sidebar</h1>
            <h2 className="text-xl font-semibold text-white text-center p-3">Buscador de texto</h2>
            <div className="w-full max-w-md mx-auto mb-6">
                <input
                    type="text"
                    placeholder="Buscar tareas..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <h2 className="text-xl font-semibold text-white text-center p-3">Buscador de filtro por estado</h2>
            <h2 className="text-xl font-semibold text-white text-center p-3">Buscador de filtro de categoría</h2>
        </>
    )
}