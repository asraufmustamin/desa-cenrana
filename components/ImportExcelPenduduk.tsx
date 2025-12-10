"use client";

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { hashNIK, validateNIKFormat } from '@/lib/crypto';

interface PendudukRow {
    NIK: string;
    Nama: string;
    Dusun: string;
    'Tanggal Lahir'?: string;
    Pekerjaan?: string;
}

export default function ImportExcelPenduduk() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{
        success: number;
        failed: number;
        errors: string[];
    } | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        setResult(null);

        try {
            // Read Excel file
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json<PendudukRow>(worksheet);

            const errors: string[] = [];
            let successCount = 0;

            // Process each row
            for (let i = 0; i < jsonData.length; i++) {
                const row = jsonData[i];
                const rowNum = i + 2; // Excel row (header is row 1)

                try {
                    // Validation
                    if (!row.NIK || !row.Nama || !row.Dusun) {
                        errors.push(`Baris ${rowNum}: NIK, Nama, dan Dusun wajib diisi`);
                        continue;
                    }

                    if (!validateNIKFormat(row.NIK)) {
                        errors.push(`Baris ${rowNum}: NIK harus 16 digit angka`);
                        continue;
                    }

                    // Parse tanggal lahir (optional)
                    let tanggalLahir: string | null = null;
                    if (row['Tanggal Lahir']) {
                        const dateStr = row['Tanggal Lahir'].toString();
                        const date = new Date(dateStr);
                        if (!isNaN(date.getTime())) {
                            tanggalLahir = date.toISOString().split('T')[0];
                        }
                    }

                    // Hash NIK for validation table
                    const nikHash = await hashNIK(row.NIK);

                    // Insert to penduduk table
                    const { error: pendudukError } = await supabase
                        .from('penduduk')
                        .insert({
                            nik: row.NIK,
                            nama: row.Nama,
                            dusun: row.Dusun,
                            tanggal_lahir: tanggalLahir,
                            pekerjaan: row.Pekerjaan || null
                        });

                    if (pendudukError) {
                        if (pendudukError.code === '23505') { // Duplicate
                            errors.push(`Baris ${rowNum}: NIK ${row.NIK} sudah terdaftar`);
                        } else {
                            errors.push(`Baris ${rowNum}: ${pendudukError.message}`);
                        }
                        continue;
                    }

                    // Insert to nik_validation table
                    await supabase
                        .from('nik_validation')
                        .insert({ nik_hash: nikHash });

                    successCount++;

                } catch (err: any) {
                    errors.push(`Baris ${rowNum}: ${err.message}`);
                }
            }

            setResult({
                success: successCount,
                failed: errors.length,
                errors: errors.slice(0, 10) // Show max 10 errors
            });

        } catch (error: any) {
            setResult({
                success: 0,
                failed: 1,
                errors: [`Error membaca file: ${error.message}`]
            });
        } finally {
            setIsProcessing(false);
            // Reset input
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload Box */}
            <div className="glass-panel rounded-2xl p-6 border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 transition-colors">
                <label className="cursor-pointer block">
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        disabled={isProcessing}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div className="p-4 rounded-full bg-blue-500/10">
                            <Upload className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-[var(--text-primary)] mb-1">
                                {isProcessing ? 'Memproses...' : 'Upload File Excel'}
                            </p>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Format: .xlsx atau .xls
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-2">
                                Kolom: NIK, Nama, Dusun (wajib) | Tanggal Lahir, Pekerjaan (opsional)
                            </p>
                        </div>
                    </div>
                </label>
            </div>

            {/* Processing Indicator */}
            {isProcessing && (
                <div className="glass-panel rounded-xl p-4 flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="text-[var(--text-primary)] font-medium">
                        Sedang memproses data...
                    </span>
                </div>
            )}

            {/* Result */}
            {result && !isProcessing && (
                <div className="space-y-3">
                    {/* Success Summary */}
                    {result.success > 0 && (
                        <div className="glass-panel rounded-xl p-4 flex items-start gap-3 border border-emerald-500/30">
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-emerald-500">
                                    {result.success} data berhasil diimport
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Failed Summary */}
                    {result.failed > 0 && (
                        <div className="glass-panel rounded-xl p-4 border border-red-500/30">
                            <div className="flex items-start gap-3 mb-3">
                                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="font-bold text-red-500">
                                    {result.failed} data gagal diimport
                                </p>
                            </div>

                            {/* Error List */}
                            {result.errors.length > 0 && (
                                <div className="ml-8 space-y-1">
                                    {result.errors.map((error, i) => (
                                        <p key={i} className="text-sm text-[var(--text-secondary)]">
                                            • {error}
                                        </p>
                                    ))}
                                    {result.failed > 10 && (
                                        <p className="text-xs text-[var(--text-secondary)] mt-2">
                                            ...dan {result.failed - 10} error lainnya
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Info */}
            <div className="glass-panel rounded-xl p-4 flex items-start gap-3 border border-blue-500/20">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-[var(--text-secondary)] space-y-1">
                    <p className="font-bold text-[var(--text-primary)]">Petunjuk:</p>
                    <p>• Pastikan Excel memiliki header di baris pertama</p>
                    <p>• NIK harus 16 digit angka</p>
                    <p>• Kolom Nama dan Dusun tidak boleh kosong</p>
                    <p>• Tanggal Lahir format: YYYY-MM-DD atau DD/MM/YYYY</p>
                </div>
            </div>
        </div>
    );
}
