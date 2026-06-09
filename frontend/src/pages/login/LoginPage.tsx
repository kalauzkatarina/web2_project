import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { authService } from "../../api_services/authApi/AuthApiService";
import AuthForm from "../../components/auth/AuthForm";


export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    //    const handleSuccess = (response: AuthResponse) => {
    //         login(response.token);
    //         navigate("/");
    //     };

    const handleSuccess = (token: string) => { // Sada primamo string direktno
        login(token); // AuthContext prima token
        navigate("/");
    };

    return <AuthForm
        authApi={authService}
        onLoginSuccess={handleSuccess}
    />;
}