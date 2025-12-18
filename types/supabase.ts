export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            surat_types: {
                Row: {
                    id: number
                    kode: string
                    nama: string
                    deskripsi: string | null
                    icon: string | null
                    syarat: string[] | null
                    fields: Json[] | null
                    template_path: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    kode: string
                    nama: string
                    deskripsi?: string | null
                    icon?: string | null
                    syarat?: string[] | null
                    fields?: Json[] | null
                    template_path?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    kode?: string
                    nama?: string
                    deskripsi?: string | null
                    icon?: string | null
                    syarat?: string[] | null
                    fields?: Json[] | null
                    template_path?: string | null
                    created_at?: string
                }
            }
            surat_requests: {
                Row: {
                    id: number
                    tracking_id: string
                    nik: string
                    nama: string
                    jenis_surat_id: number | null
                    status: string | null
                    data: Json | null
                    lampiran: Json | null
                    keterangan: string | null
                    nomor_surat: string | null
                    file_pdf_url: string | null
                    created_at: string
                    updated_at: string | null
                }
                Insert: {
                    id?: number
                    tracking_id: string
                    nik: string
                    nama: string
                    jenis_surat_id?: number | null
                    status?: string | null
                    data?: Json | null
                    lampiran?: Json | null
                    keterangan?: string | null
                    nomor_surat?: string | null
                    file_pdf_url?: string | null
                    created_at?: string
                    updated_at?: string | null
                }
                Update: {
                    id?: number
                    tracking_id?: string
                    nik?: string
                    nama?: string
                    jenis_surat_id?: number | null
                    status?: string | null
                    data?: Json | null
                    lampiran?: Json | null
                    keterangan?: string | null
                    nomor_surat?: string | null
                    file_pdf_url?: string | null
                    created_at?: string
                    updated_at?: string | null
                }
            }
            // ... Add other existing tables if needed, but for now we focus on these
        }
    }
}
