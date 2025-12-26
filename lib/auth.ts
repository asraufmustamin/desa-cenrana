/**
 * Auth Utilities
 * ==============
 * 
 * Sistem autentikasi portable yang siap migrasi ke MySQL
 * Menggunakan bcryptjs untuk password hashing dan jose untuk JWT
 */

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// ============================================
// CONFIGURATION
// ============================================

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-secret-change-in-production-123!"
);
const COOKIE_NAME = "admin_session";
const TOKEN_EXPIRY = "7d"; // Token berlaku 7 hari

// ============================================
// PASSWORD FUNCTIONS
// ============================================

/**
 * Hash password menggunakan bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Verifikasi password dengan hash
 */
export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ============================================
// JWT TOKEN FUNCTIONS
// ============================================

interface TokenPayload {
    userId: number;
    username: string;
    role: string;
}

/**
 * Buat JWT token untuk session
 */
export async function createToken(payload: TokenPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(JWT_SECRET);
}

/**
 * Verifikasi dan decode JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as TokenPayload;
    } catch {
        return null;
    }
}

// ============================================
// SESSION/COOKIE FUNCTIONS
// ============================================

/**
 * Set session cookie setelah login berhasil
 */
export async function setSessionCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
        path: "/",
    });
}

/**
 * Hapus session cookie (logout)
 */
export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

/**
 * Ambil session dari cookie
 */
export async function getSession(): Promise<TokenPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    return verifyToken(token);
}

/**
 * Cek apakah user sudah login (untuk middleware)
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !== null;
}
