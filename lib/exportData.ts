/**
 * Export Data Utility
 * ===================
 * 
 * Export data ke CSV atau Excel dengan mudah
 */

/**
 * Export array of objects ke CSV file
 */
export function exportToCSV<T extends Record<string, unknown>>(
    data: T[],
    filename: string,
    columns?: { key: keyof T; label: string }[]
): void {
    if (data.length === 0) {
        alert("Tidak ada data untuk di-export");
        return;
    }

    // Determine columns
    const cols = columns || Object.keys(data[0]).map((key) => ({
        key: key as keyof T,
        label: String(key),
    }));

    // Create CSV content
    const header = cols.map((col) => `"${col.label}"`).join(",");
    const rows = data.map((item) =>
        cols
            .map((col) => {
                const value = item[col.key];
                // Handle different types
                if (value === null || value === undefined) return '""';
                if (typeof value === "string") return `"${value.replace(/"/g, '""')}"`;
                if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                return `"${value}"`;
            })
            .join(",")
    );

    const csvContent = [header, ...rows].join("\n");

    // Add BOM for proper encoding in Excel
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

    // Download
    downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export array of objects ke Excel (XLSX format simulasi dengan HTML table)
 * Note: Untuk real XLSX, perlu library seperti xlsx atau exceljs
 */
export function exportToExcel<T extends Record<string, unknown>>(
    data: T[],
    filename: string,
    sheetName: string = "Sheet1",
    columns?: { key: keyof T; label: string }[]
): void {
    if (data.length === 0) {
        alert("Tidak ada data untuk di-export");
        return;
    }

    // Determine columns
    const cols = columns || Object.keys(data[0]).map((key) => ({
        key: key as keyof T,
        label: String(key),
    }));

    // Create HTML table (Excel can open HTML tables)
    let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>${sheetName}</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                table { border-collapse: collapse; }
                th { background-color: #4CAF50; color: white; font-weight: bold; padding: 10px; border: 1px solid #ddd; }
                td { padding: 8px; border: 1px solid #ddd; }
                tr:nth-child(even) { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        ${cols.map((col) => `<th>${col.label}</th>`).join("")}
                    </tr>
                </thead>
                <tbody>
    `;

    data.forEach((item) => {
        html += "<tr>";
        cols.forEach((col) => {
            const value = item[col.key];
            let cellValue = "";
            if (value === null || value === undefined) cellValue = "";
            else if (typeof value === "object") cellValue = JSON.stringify(value);
            else cellValue = String(value);
            html += `<td>${cellValue}</td>`;
        });
        html += "</tr>";
    });

    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;

    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
    downloadBlob(blob, `${filename}.xls`);
}

/**
 * Export data sebagai JSON file
 */
export function exportToJSON<T>(data: T[], filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    downloadBlob(blob, `${filename}.json`);
}

/**
 * Helper function untuk download blob
 */
function downloadBlob(blob: Blob, filename: string): void {
    if (typeof window === "undefined") return;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

/**
 * Preset columns untuk export data umum
 */
export const EXPORT_COLUMNS = {
    aspirasi: [
        { key: "ticket_code", label: "Kode Tiket" },
        { key: "name", label: "Nama Pelapor" },
        { key: "phone", label: "No. HP" },
        { key: "category", label: "Kategori" },
        { key: "dusun", label: "Dusun" },
        { key: "message", label: "Pesan" },
        { key: "status", label: "Status" },
        { key: "reply", label: "Balasan" },
        { key: "created_at", label: "Tanggal Lapor" },
    ],
    lapak: [
        { key: "title", label: "Nama Produk" },
        { key: "category", label: "Kategori" },
        { key: "price", label: "Harga" },
        { key: "seller_name", label: "Nama Penjual" },
        { key: "seller_phone", label: "No. HP Penjual" },
        { key: "status", label: "Status" },
        { key: "view_count", label: "Jumlah Dilihat" },
        { key: "created_at", label: "Tanggal Upload" },
    ],
    penduduk: [
        { key: "nik", label: "NIK" },
        { key: "nama", label: "Nama Lengkap" },
        { key: "jenis_kelamin", label: "Jenis Kelamin" },
        { key: "tanggal_lahir", label: "Tanggal Lahir" },
        { key: "alamat", label: "Alamat" },
        { key: "dusun", label: "Dusun" },
        { key: "agama", label: "Agama" },
        { key: "pekerjaan", label: "Pekerjaan" },
    ],
};

/**
 * Format tanggal untuk nama file export
 */
export function getExportFilename(prefix: string): string {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    return `${prefix}_${date}`;
}
