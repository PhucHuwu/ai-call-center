import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const TOKEN_KEY = "auth_token";

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        username: string;
        role: string;
        display_name: string;
    };
}

export async function login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Đăng nhập thất bại");
    }

    const data = await response.json();

    // Store token in cookie
    Cookies.set(TOKEN_KEY, data.token, { expires: 1 }); // 1 day

    return data;
}

export function logout(): void {
    Cookies.remove(TOKEN_KEY);
}

export function getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
}

export async function getCurrentUser(): Promise<LoginResponse["user"] | null> {
    const token = getToken();
    if (!token) return null;

    try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return null;
        return response.json();
    } catch {
        return null;
    }
}

export function getAuthHeaders(): HeadersInit {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}
