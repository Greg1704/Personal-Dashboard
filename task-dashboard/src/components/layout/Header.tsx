import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BarChart3, LogOut, User } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";

export const Header = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-indigo-600">
            <div className="flex items-center justify-between p-5">
                <h1 className="text-4xl font-bold text-white">Personal Dashboard</h1>

                <div className="flex items-center gap-4">
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

                    {/* User info and logout */}
                    <div className="flex items-center gap-3 pl-4 border-l border-indigo-500">
                        <div className="flex items-center gap-2 text-white">
                            <User size={18} />
                            <span className="text-sm font-medium">{user?.email}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors bg-indigo-700 text-white hover:bg-red-600"
                            title="Logout"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}