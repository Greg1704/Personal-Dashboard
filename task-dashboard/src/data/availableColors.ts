export interface ColorOption {
    name: string;
    hex: string;
    tailwind: string; // Para referencia
}

export const availableColors: ColorOption[] = [
    { name: 'Blue', hex: '#3b82f6', tailwind: 'blue-500' },
    { name: 'Indigo', hex: '#6366f1', tailwind: 'indigo-500' },
    { name: 'Purple', hex: '#a855f7', tailwind: 'purple-500' },
    { name: 'Pink', hex: '#ec4899', tailwind: 'pink-500' },
    { name: 'Red', hex: '#ef4444', tailwind: 'red-500' },
    { name: 'Orange', hex: '#f97316', tailwind: 'orange-500' },
    { name: 'Yellow', hex: '#eab308', tailwind: 'yellow-500' },
    { name: 'Green', hex: '#22c55e', tailwind: 'green-500' },
];