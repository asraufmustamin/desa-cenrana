
"use client";

import { villageStats } from "@/data/mockData";
import { Users, Home, Activity, Briefcase, GraduationCap } from "lucide-react";

const DemographicsChart = () => {
    const data = [
        { label: "Anak-anak (0-12)", percentage: 25, color: "bg-blue-500" },
        { label: "Remaja (13-18)", percentage: 15, color: "bg-green-500" },
        { label: "Dewasa (19-59)", percentage: 45, color: "bg-yellow-500" },
        { label: "Lansia (60+)", percentage: 15, color: "bg-red-500" },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-desa-green" />
                Demografi Berdasarkan Usia
            </h3>
            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{item.label}</span>
                            <span className="text-gray-500">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className={`${item.color} h-2.5 rounded-full`}
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EducationChart = () => {
    const data = [
        { label: "SD/Sederajat", percentage: 30, color: "bg-indigo-500" },
        { label: "SMP/Sederajat", percentage: 25, color: "bg-purple-500" },
        { label: "SMA/Sederajat", percentage: 35, color: "bg-pink-500" },
        { label: "Perguruan Tinggi", percentage: 10, color: "bg-orange-500" },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-desa-green" />
                Tingkat Pendidikan
            </h3>
            <div className="flex items-end justify-between h-48 space-x-2 px-2">
                {data.map((item) => (
                    <div key={item.label} className="flex flex-col items-center w-1/4 group">
                        <div className="relative w-full flex justify-center">
                            <span className="absolute -top-6 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.percentage}%
                            </span>
                            <div
                                className={`${item.color} w-full rounded-t-lg transition-all duration-500 hover:opacity-80`}
                                style={{ height: `${item.percentage * 1.5}px` }}
                            ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2 text-center leading-tight">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const JobChart = () => {
    const data = [
        { label: "Petani", value: 60, color: "bg-emerald-600" },
        { label: "Pedagang", value: 20, color: "bg-amber-500" },
        { label: "PNS/TNI/Polri", value: 10, color: "bg-blue-600" },
        { label: "Lainnya", value: 10, color: "bg-gray-400" },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-desa-green" />
                Mata Pencaharian
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Simple CSS Pie Chart Representation */}
                <div className="relative w-40 h-40 rounded-full bg-emerald-600 border-4 border-white shadow-lg overflow-hidden">
                    {/* This is a simplified visual representation, not a true calculated pie chart for all segments without a library */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500 origin-left transform rotate-12"></div>
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-600"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-emerald-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
                            <span className="text-xs font-bold text-gray-400">Total</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 w-full md:w-auto">
                    {data.map((item) => (
                        <div key={item.label} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                            <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                            <span className="text-sm font-bold text-gray-900 ml-4">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function InfografisPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-desa-dark mb-4">Data & Infografis Desa</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Transparansi data kependudukan dan potensi Desa Cenrana.
                    </p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {villageStats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-desa-green to-desa-dark rounded-xl p-6 shadow-lg text-white flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform"
                        >
                            <h3 className="text-lg font-medium text-white/80 mb-2">{stat.label}</h3>
                            <p className="text-4xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DemographicsChart />
                    <EducationChart />
                    <JobChart />
                </div>
            </div>
        </div>
    );
}
