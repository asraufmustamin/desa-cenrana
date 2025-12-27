import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

export async function GET() {
    try {
        // Fetch all lapak data
        const { data: lapak, error } = await supabase
            .from("lapak")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Transform data for Excel
        const excelData = (lapak || []).map((item, index) => ({
            "No": index + 1,
            "Tanggal Daftar": new Date(item.created_at).toLocaleDateString("id-ID"),
            "Nama Produk": item.nama || "-",
            "Kategori": item.kategori || "-",
            "Harga": item.harga ? `Rp ${Number(item.harga).toLocaleString("id-ID")}` : "-",
            "Deskripsi": item.deskripsi || "-",
            "Nama Penjual": item.penjual || "-",
            "No. WhatsApp": item.whatsapp || "-",
            "Status": item.status || "Aktif"
        }));

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        worksheet["!cols"] = [
            { wch: 5 },   // No
            { wch: 15 },  // Tanggal
            { wch: 25 },  // Nama Produk
            { wch: 15 },  // Kategori
            { wch: 15 },  // Harga
            { wch: 40 },  // Deskripsi
            { wch: 20 },  // Penjual
            { wch: 15 },  // WhatsApp
            { wch: 10 },  // Status
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Lapak");

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        // Return as downloadable file
        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="Laporan_Lapak_${new Date().toISOString().split('T')[0]}.xlsx"`
            }
        });
    } catch (error) {
        console.error("Error exporting lapak:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
