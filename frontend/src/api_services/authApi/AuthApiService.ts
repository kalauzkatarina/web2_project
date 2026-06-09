import { removeItem } from "../../helpers/local_storage";
import type { LoginDto, RegisterDto } from "../../models/users/UserDtos";
import type { AuthResponse } from "../../types/auth/AuthResponse";
import api from "../api";
import type { IAuthAPIService } from "./IAuthApiService";

export const authService: IAuthAPIService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/user/login", data);
    return res.data;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/user/register", data);
    return res.data;
  },

  logout(){
    removeItem("token");
  }
};