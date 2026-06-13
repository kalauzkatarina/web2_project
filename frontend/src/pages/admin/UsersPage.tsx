import { Shield, Trash2, User } from "lucide-react";
import { useUsers } from "../../hooks/user/useUsers";
import { useState } from "react";
import ConfirmationModal from "../../components/confirmation/ConfirmationModal";

export default function UsersPage() {
    const { users, loading, deleteUser, updateUserRole } = useUsers();

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                Loading users...
            </div>
        );
    }

    const handleDelete = async () => {
        if (!selectedUserId) return;

        await deleteUser(selectedUserId);

        setIsModalOpen(false);
        setSelectedUserId(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-10">
                <p className="uppercase tracking-widest text-amber-600 text-sm font-bold">
                    Administration
                </p>

                <h1 className="text-5xl font-bold text-stone-900 mt-2">
                    Users
                </h1>

                <p className="text-stone-500 mt-3">
                    Manage registered accounts and permissions.
                </p>
            </div>

            <div className="grid gap-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="
                            bg-white
                            border border-stone-200
                            rounded-3xl
                            p-6
                            shadow-sm
                            hover:shadow-md
                            transition-all
                        "
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div
                                    className="
                                        w-14 h-14
                                        rounded-2xl
                                        bg-gradient-to-br
                                        from-amber-400
                                        to-orange-500
                                        text-white
                                        font-bold
                                        text-lg
                                        flex items-center justify-center
                                    "
                                >
                                    {user.firstName[0]}
                                    {user.lastName[0]}
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-stone-900">
                                        {user.firstName} {user.lastName}
                                    </h3>

                                    <p className="text-stone-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex bg-stone-100 p-1.5 rounded-full border border-stone-200 shadow-inner">
                                    {["User", "Admin"].map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => updateUserRole(user.id, role)}
                                            className={`
                                                    px-5 py-1.5 text-xs font-bold rounded-full transition-all duration-300
                                                    flex items-center gap-2
                                                    ${user.role === role
                                                    ? (role === "Admin"
                                                        ? "bg-slate-700 text-white shadow-md scale-105"
                                                        : "bg-amber-500 text-white shadow-md scale-105")
                                                    : "text-stone-500 hover:bg-stone-200 hover:text-stone-800"}
                                                    `}
                                        >
                                            {role === "Admin" && <Shield size={14} />}
                                            {role === "User" && <User size={14} />}
                                            {role}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedUserId(user.id);
                                        setIsModalOpen(true);
                                    }}
                                    className="
                                        w-11 h-11
                                        rounded-xl
                                        flex items-center justify-center
                                        text-red-500
                                        hover:bg-red-50
                                        transition-all
                                    "
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                title="Delete User"
                message="This action cannot be undone. The user account and all associated travel plans will be permanently deleted." confirmText="Delete User"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => {
                    setIsModalOpen(false);
                    setSelectedUserId(null);
                }}
            />
        </div>
    );
}