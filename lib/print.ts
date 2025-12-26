/**
 * Print Utilities
 * ===============
 * 
 * Helper functions untuk print dan PDF
 */

/**
 * Print konten tertentu ke printer
 */
export function printContent(content: string, title: string = "Print"): void {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        alert("Popup blocker aktif. Izinkan popup untuk mencetak.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                @media print {
                    body { margin: 0; padding: 20px; }
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #1f2937;
                }
                h1, h2, h3 { color: #111827; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
                th { background-color: #f3f4f6; font-weight: 600; }
                tr:nth-child(even) { background-color: #f9fafb; }
                .header { text-align: center; margin-bottom: 30px; }
                .header img { max-height: 60px; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
                .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
                .badge-success { background: #d1fae5; color: #047857; }
                .badge-warning { background: #fef3c7; color: #b45309; }
                .badge-error { background: #fee2e2; color: #dc2626; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>PEMERINTAH DESA CENRANA</h2>
                <p>Kecamatan Camba, Kabupaten Maros, Sulawesi Selatan</p>
            </div>
            ${content}
            <div class="footer">
                <p>Dicetak pada ${new Date().toLocaleString("id-ID")}</p>
                <p>Dokumen ini digenerate otomatis dari Sistem Informasi Desa Cenrana</p>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

/**
 * Print element by ID
 */
export function printElement(elementId: string, title?: string): void {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id "${elementId}" not found`);
        return;
    }
    printContent(element.innerHTML, title);
}

/**
 * Generate table HTML dari array data
 */
export function generateTableHTML<T extends Record<string, unknown>>(
    data: T[],
    columns: { key: keyof T; label: string; format?: (value: unknown) => string }[],
    title?: string
): string {
    let html = "";

    if (title) {
        html += `<h2 style="margin-bottom: 16px;">${title}</h2>`;
    }

    html += "<table>";
    html += "<thead><tr>";
    columns.forEach((col) => {
        html += `<th>${col.label}</th>`;
    });
    html += "</tr></thead>";

    html += "<tbody>";
    data.forEach((row) => {
        html += "<tr>";
        columns.forEach((col) => {
            const value = row[col.key];
            const formatted = col.format ? col.format(value) : String(value ?? "-");
            html += `<td>${formatted}</td>`;
        });
        html += "</tr>";
    });
    html += "</tbody></table>";

    return html;
}

/**
 * Print data table
 */
export function printTable<T extends Record<string, unknown>>(
    data: T[],
    columns: { key: keyof T; label: string; format?: (value: unknown) => string }[],
    title: string
): void {
    const tableHTML = generateTableHTML(data, columns, title);
    printContent(tableHTML, title);
}

/**
 * Generate laporan aspirasi untuk print
 */
export function generateAspirasiReport(aspirasi: {
    ticket_code: string;
    name: string;
    phone: string;
    category: string;
    message: string;
    status: string;
    reply?: string;
    created_at: string;
}): string {
    const statusColors: Record<string, string> = {
        Pending: "badge-warning",
        Diproses: "badge-warning",
        Selesai: "badge-success",
        Ditolak: "badge-error",
    };

    return `
        <h3>LAPORAN ASPIRASI / PENGADUAN</h3>
        <table style="margin-top: 20px;">
            <tr><th width="30%">Kode Tiket</th><td><strong>${aspirasi.ticket_code}</strong></td></tr>
            <tr><th>Nama Pelapor</th><td>${aspirasi.name}</td></tr>
            <tr><th>No. HP</th><td>${aspirasi.phone}</td></tr>
            <tr><th>Kategori</th><td>${aspirasi.category}</td></tr>
            <tr><th>Tanggal Lapor</th><td>${new Date(aspirasi.created_at).toLocaleString("id-ID")}</td></tr>
            <tr>
                <th>Status</th>
                <td><span class="badge ${statusColors[aspirasi.status] || ""}">${aspirasi.status}</span></td>
            </tr>
            <tr><th>Isi Laporan</th><td>${aspirasi.message}</td></tr>
            ${aspirasi.reply ? `<tr><th>Balasan Admin</th><td>${aspirasi.reply}</td></tr>` : ""}
        </table>
    `;
}
