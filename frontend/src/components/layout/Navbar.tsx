import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { FiUser } from "react-icons/fi";

export default function Navbar() {

    const { logout, user } = useAuth();

    console.log(user);

    return (
        <nav
            className="
                bg-white
                border-b
                border-stone-200
                sticky
                top-0
                z-50
            "
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                <div className="flex items-center gap-8">

                    <Link
                        to="/"
                        className="text-2xl font-bold text-amber-600"
                    >
                        Travel Planner
                    </Link>

                    <Link to="/" className="text-stone-600 hover:text-amber-600 font-medium">
                        {user?.role === "Admin" ? "Admin Dashboard" : "My Journeys"}
                    </Link>

                    {user?.role === "Admin" && (
                        <Link
                            to="/users"
                            className="text-stone-600 hover:text-amber-600 font-medium"
                        >
                            Users
                        </Link>
                    )}

                </div>

                <div className="flex items-center gap-4">

                    <div className="flex items-center gap-2 text-stone-600">
                        <FiUser size={18} />
                        <span className="font-medium">
                            {user?.email}
                        </span>
                    </div>

                    <button
                        onClick={logout}
                        className="
                            px-4
                            py-2
                            rounded-xl
                            bg-amber-500
                            text-white
                            hover:bg-amber-600
                        "
                    >
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
}