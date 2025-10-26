import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3 } from "lucide-react";

export const Header = () => {
    return (
    <header className="bg-indigo-600">
        <div className="flex items-center justify-between p-5">
        <h1 className="text-4xl font-bold text-white">Personal Dashboard</h1>

        <nav className="flex gap-2">
            <NavLink to="/dashboard" className={({isActive}) =>
            `flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                isActive
                ? 'bg-white text-indigo-600'
                : 'bg-indigo-700 text-white hover:bg-indigo-800'
            }`
            }>
            <LayoutDashboard size={20} />
            Dashboard
            </NavLink>

            <NavLink to="/statistics" className={({isActive}) =>
            `flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                isActive
                ? 'bg-white text-indigo-600'
                : 'bg-indigo-700 text-white hover:bg-indigo-800'
            }`
            }>
            <BarChart3 size={20} />
            Statistics
            </NavLink>
        </nav>
        </div>
    </header>
  );
}