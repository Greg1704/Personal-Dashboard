import { useAuthStore } from "../../stores/useAuthStore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUpForm() {
    const { signUp, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signUp(email, password);
            // Si no hay error, redirigir al dashboard
            navigate('/dashboard');
        } catch (err) {
            // El error ya se maneja en el store
            console.error('Error en signup:', err);
        }
    }

    const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) clearError(); // Limpiar error cuando el usuario escribe
        setter(e.target.value);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-700 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Register New Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-white mb-2 text-sm font-medium">
                        Email
                    </label>
                    <input
                        value={email}
                        type="email"
                        id="email"
                        required
                        className="p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded bg-gray-800 text-white"
                        placeholder="your@email.com"
                        onChange={handleInputChange(setEmail)}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-white mb-2 text-sm font-medium">
                        Password
                    </label>
                    <input
                        value={password}
                        type="password"
                        id="password"
                        required
                        minLength={6}
                        className="p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded bg-gray-800 text-white"
                        placeholder="••••••••"
                        onChange={handleInputChange(setPassword)}
                    />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 w-full rounded font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Creating account...' : 'Register'}
                </button>
            </form>

            <p className="text-gray-400 text-center mt-4 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                    Login
                </Link>
            </p>
        </div>
    );
}

export default SignUpForm;