import api from "../api";
import type { IUserApiService } from "./IUserApiService";
import type { User } from "../../models/users/User";

export const userApiService: IUserApiService = {
    async getAll(): Promise<User[]> {
        const res = await api.get<User[]>("/user/all");
        return res.data;
    },

    async getById(id: string): Promise<User> {
        const res = await api.get<User>(`/user/${id}`);
        return res.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/user/${id}`);
    },

    async updateRole(id: string, newRole: string): Promise<void> {
    await api.patch(`/user/${id}/role`, {
        newRole: newRole === "Admin" ? 1 : 0
    });
}
};