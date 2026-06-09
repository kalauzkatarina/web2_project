import type { LoginDto, RegisterDto } from "../../models/users/UserDtos";
import type { AuthResponse } from "../../types/auth/AuthResponse";

export interface IAuthAPIService {
  login(data: LoginDto): Promise<AuthResponse>;
  register(data: RegisterDto): Promise<AuthResponse>;
  logout(): void;
}