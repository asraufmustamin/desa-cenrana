import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

export async function GET() {
    try {
        // Fetch all aspirasi data
        const { data: aspirasi, error } = await supabase
            .from("aspirasi")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Transform data for Excel
        const excelData = (aspirasi || []).map((item, index) => ({
            "No": index + 1,
            "Kode Tiket": item.ticket_code || "-",
            "Tanggal": new Date(item.created_at).toLocaleDateString("id-ID"),
            "Nama": item.nama || "Anonim",
            "Kategori": item.kategori || "-",
            "Dusun": item.dusun || "-",
            "Laporan": item.laporan || "-",
            "Status": item.status || "Pending",
            "Balasan Admin": item.reply || "-",
            "Waktu Balasan": item.replied_at ? new Date(item.replied_at).toLocaleDateString("id-ID") : "-"
        }));

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        worksheet["!cols"] = [
            { wch: 5 },   // No
            { wch: 15 },  // Kode Tiket
            { wch: 12 },  // Tanggal
            { wch: 20 },  // Nama
            { wch: 15 },  // Kategori
            { wch: 15 },  // Dusun
            { wch: 50 },  // Laporan
            { wch: 12 },  // Status
            { wch: 40 },  // Balasan
            { wch: 15 },  // Waktu Balasan
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Aspirasi");

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        // Return as downloadable file
        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="Laporan_Aspirasi_${new Date().toISOString().split('T')[0]}.xlsx"`
            }
        });
    } catch (error) {
        console.error("Error exporting aspirasi:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
