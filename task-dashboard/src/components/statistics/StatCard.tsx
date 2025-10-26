import { type ReactNode } from "react";

type ColorVariant = 'indigo' | 'green' | 'orange' | 'blue';

interface StatCardProps {
    title: string;
    subtitle?: string;
    value: string | number;
    icon?: ReactNode;
    color?: ColorVariant;
}

export default function StatCard( { title, subtitle, value, icon, color='indigo' }: StatCardProps ) {

    //TODO: No me parece muy limpio esto de los colores en el componente
    const bgColors = {
        indigo: 'bg-indigo-600',
        green: 'bg-green-600',
        orange: 'bg-orange-600',
        blue: 'bg-blue-600',
    };

    return (
    <div className={`${bgColors[color]} rounded-lg p-6 text-white shadow-lg`}>
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold opacity-90">{title}</h3>
            {icon && <div className="opacity-80">{icon}</div>}
        </div>
        <p className="text-4xl font-bold mb-1">{value}</p>
        {subtitle && <p className="text-sm opacity-75">{subtitle}</p>}

    </div>
    );
}