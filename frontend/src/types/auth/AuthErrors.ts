import type { LoginDto, RegisterDto } from "../../models/users/UserDtos";

export type LoginErrors = Partial<Record<keyof LoginDto, string>>;
export type RegisterErrors = Partial<Record<keyof RegisterDto, string>>;