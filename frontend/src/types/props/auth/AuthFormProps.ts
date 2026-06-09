import type { IAuthAPIService } from "../../../api_services/authApi/IAuthApiService";

export type AuthFormProps = {
    authApi: IAuthAPIService;
    onLoginSuccess: (token: string) => void;
}