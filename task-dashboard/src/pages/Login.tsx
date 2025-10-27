import LoginForm from "../components/auth/LoginForm";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";

function Login() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <LoginForm />
                <GoogleLoginButton />
            </div>
        </div>
    );
}

export default Login;