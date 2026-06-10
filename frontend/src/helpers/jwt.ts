import { jwtDecode } from "jwt-decode";

export function getUserRole(token: string) {
    const decoded: any = jwtDecode(token);

    return decoded.role;
}