import SignUpForm from '../components/auth/SignUpForm';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

function SignUp() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <SignUpForm />
                <GoogleLoginButton />
            </div>
        </div>
    );
}

export default SignUp;