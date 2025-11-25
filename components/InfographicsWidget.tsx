
import { villageStats } from "@/data/mockData";
import { Users, Home, Activity } from "lucide-react";

const iconMap = {
    Penduduk: Users,
    Dusun: Home,
    "Kelompok Umur": Activity,
};

const InfographicsWidget = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-desa-green mb-10">Infografis Desa</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {villageStats.map((stat, index) => {
                        const Icon = iconMap[stat.label as keyof typeof iconMap] || Users;
                        return (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                            >
                                <div className="p-4 bg-desa-green/10 rounded-full mb-4">
                                    <Icon className="w-8 h-8 text-desa-green" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-600 mb-2">{stat.label}</h3>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default InfographicsWidget;
