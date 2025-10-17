
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
                <button className="px-2 py-0.5 rounded transition-colors bg-indigo-600 text-white hover:bg-indigo-700">E</button>
                <button className="px-2 py-0.5 rounded transition-colors bg-red-600 text-white hover:bg-red-700">X</button>
            </div>
        </div>
    )
}