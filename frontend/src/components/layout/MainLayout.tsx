import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface Props {
    children: ReactNode;
}

export default function MainLayout({
    children,
}: Props) {
    return (
        <div className="min-h-screen bg-[#fafaf9]">
            <Navbar />

            <main>
                {children}
            </main>
        </div>
    );
}