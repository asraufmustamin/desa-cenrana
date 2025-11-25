
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function AspirasiSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Laporan Terkirim!</h1>
                <p className="text-gray-600 mb-8">
                    Terima kasih telah menyampaikan aspirasi Anda. Laporan Anda telah kami terima dan akan segera ditindaklanjuti oleh petugas desa.
                </p>
                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full py-3 px-4 bg-desa-green text-white font-medium rounded-lg hover:bg-desa-dark transition-colors"
                    >
                        Kembali ke Beranda
                    </Link>
                    <Link
                        href="/aspirasi"
                        className="block w-full py-3 px-4 bg-white text-desa-green font-medium rounded-lg border border-desa-green hover:bg-green-50 transition-colors"
                    >
                        Kirim Laporan Lain
                    </Link>
                </div>
            </div>
        </div>
    );
}
