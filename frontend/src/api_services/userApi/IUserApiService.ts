import type { User } from "../../models/users/User";

export interface IUserApiService {
    getAll(): Promise<User[]>;
    getById(id: string): Promise<User>;
    delete(id: string): Promise<void>;
    updateRole(id: string, newRole: string): Promise<void>;
}