import { jwtDecode } from "jwt-decode";
import type { JwtTokenClaims } from "../types/auth/JwtTokenClaims";

export function getUserRole(token: string | null): string {
    if (!token) return "";

    try {
        const decoded = jwtDecode<JwtTokenClaims>(token);
        
        return decoded.role || ""; 
    } catch (error) {
        console.error("Greška pri dekodiranju tokena:", error);
        return "";
    }
}