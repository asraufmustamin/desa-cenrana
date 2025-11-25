
import Image from "next/image";
import { Phone, Tag, Trash2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface LapakItem {
    id: number;
    title: string;
    category: string;
    price: string;
    seller: string;
    phone: string;
    image: string;
}

const LapakCard = ({ item }: { item: LapakItem }) => {
    const { isEditMode, deleteLapak } = useAppContext();

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
            <div className="relative h-56 w-full">
                <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-desa-green shadow-sm">
                    {item.category}
                </div>
                {isEditMode && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (confirm("Apakah Anda yakin ingin menghapus lapak ini?")) {
                                deleteLapak(item.id);
                            }
                        }}
                        className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-3">Oleh: {item.seller}</p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-desa-gold">{item.price}</span>
                    <a
                        href={`https://wa.me/${item.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        Hubungi
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LapakCard;
