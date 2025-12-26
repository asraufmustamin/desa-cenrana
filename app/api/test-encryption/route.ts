/**
 * Encryption Test API
 * GET /api/test-encryption?data=1234567890123456
 * 
 * Untuk testing dan demonstrasi enkripsi
 */

import { NextRequest, NextResponse } from "next/server";
import { encryptData, decryptData, maskNIK, maskPhone } from "@/lib/encryption";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const data = searchParams.get("data") || "7318xxxxxxxxxxxx";
    const type = searchParams.get("type") || "nik"; // nik atau phone

    try {
        // Encrypt
        const encrypted = await encryptData(data);

        // Decrypt (untuk verifikasi)
        const decrypted = await decryptData(encrypted);

        // Mask untuk tampilan publik
        const masked = type === "phone" ? maskPhone(data) : maskNIK(data);

        return NextResponse.json({
            success: true,
            original: data,
            encrypted: encrypted,
            decrypted: decrypted,
            masked: masked,
            match: data === decrypted,
            note: "Data terenkripsi aman disimpan di database. Gunakan decrypt() untuk melihat data asli."
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Encryption failed"
        }, { status: 500 });
    }
}
