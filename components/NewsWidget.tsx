
import { newsItems } from "@/data/mockData";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

const NewsWidget = () => {
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-desa-green">Berita Terkini</h2>
                    <Link href="#" className="text-desa-green font-medium hover:text-desa-gold transition-colors">
                        Lihat Semua &rarr;
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {newsItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {item.date}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{item.title}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{item.excerpt}</p>
                                <Link href="#" className="text-desa-green font-medium hover:underline mt-auto">
                                    Baca Selengkapnya
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsWidget;
