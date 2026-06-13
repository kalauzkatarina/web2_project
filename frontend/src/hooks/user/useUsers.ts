import { useState, useEffect } from "react";
import type { User } from "../../models/users/User";
import { userApiService } from "../../api_services/userApi/UserApiService";
import axios from "axios";
import { toast } from "react-toastify";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userApiService.getAll();
            setUsers(data);
        } catch (err) {
            setError("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string) => {
        try {
            await userApiService.delete(id);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            alert("Failed to delete user.");
        }
    };

    const updateUserRole = async (id: string, newRole: string) => {
        try {
            await userApiService.updateRole(id, newRole);

            setUsers(prev =>
                prev.map(u =>
                    u.id === id ? { ...u, role: newRole } : u
                )
            );

            toast.success("Role updated successfully.");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data ?? "Failed to update role.");
            } else {
                toast.error("Failed to update role.");
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loading, error, deleteUser, updateUserRole };
};