import {Pencil, Eraser} from 'lucide-react';



interface CategoryItemProps {
    name: string;
    color: string;
}

export function CategoryItem({name, color}: CategoryItemProps) {
    return (
        <div className="bg-slate-600 px-3 py-2 rounded-lg w-11/12 flex justify-between items-center text-sm text-white">
            <div className="gap-2 flex items-center">
                <div 
                    className="w-5 h-5 rounded-full border-2 border-slate-900" 
                    style={{ 
                        backgroundColor: color
                    }}
                />
                <span>{name}</span>
            </div>
            <div className="gap-2 flex font-semibold">
                <button className="px-1.5 py-1 rounded transition-colors bg-indigo-600 text-white hover:bg-indigo-700">
                    <Pencil className="w-4 h-4"/>
                </button>
                <button className="px-1.5 py-1 rounded transition-colors bg-red-600 text-white hover:bg-red-700">
                    <Eraser className="w-4 h-4"/>
                </button>
            </div>
        </div>
    )
}