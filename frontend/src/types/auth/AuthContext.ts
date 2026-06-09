import type { User } from "../../models/users/User";

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string) => void; 
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};