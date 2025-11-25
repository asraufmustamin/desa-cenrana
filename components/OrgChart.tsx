"use client";

import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";

export default function OrgChart() {
    const { cmsContent, updateContent } = useAppContext();
    const { sotk_new } = cmsContent;

    // Helper to update SOTK fields
    const updateSOTK = (path: string[], value: any) => {
        const newSOTK = JSON.parse(JSON.stringify(sotk_new));
        let current = newSOTK;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        updateContent("sotk_new", "", newSOTK);
    };

    // Specialized update functions
    const updateKades = (field: string, value: string) => {
        const newSOTK = { ...sotk_new, kades: { ...sotk_new.kades, [field]: value } };
        updateContent("sotk_new", "kades", newSOTK.kades);
    };

    const updateSekdes = (field: string, value: string) => {
        const newSOTK = { ...sotk_new, sekdes: { ...sotk_new.sekdes, [field]: value } };
        updateContent("sotk_new", "sekdes", newSOTK.sekdes);
    };

    const updateKaur = (index: number, field: string, value: string) => {
        const newKaurs = [...sotk_new.kaur];
        newKaurs[index] = { ...newKaurs[index], [field]: value };
        const newSOTK = { ...sotk_new, kaur: newKaurs };
        updateContent("sotk_new", "kaur", newKaurs);
    };

    const updateKadus = (index: number, field: string, value: string) => {
        const newKadus = [...sotk_new.kadus];
        newKadus[index] = { ...newKadus[index], [field]: value };
        const newSOTK = { ...sotk_new, kadus: newKadus };
        updateContent("sotk_new", "kadus", newKadus);
    };

    return (
        <div className="w-full overflow-x-auto pb-12 pt-8">
            <div className="min-w-[800px] flex flex-col items-center space-y-12">

                {/* Level 1: Kades */}
                <div className="relative z-10">
                    <NodeCard data={sotk_new.kades} onUpdate={updateKades} isMain />
                    {/* Line to Sekdes */}
                    <div className="absolute top-full left-1/2 w-0.5 h-12 bg-blue-500/30 -translate-x-1/2"></div>
                </div>

                {/* Level 2: Sekdes */}
                <div className="relative z-10">
                    <NodeCard data={sotk_new.sekdes} onUpdate={updateSekdes} />
                    {/* Line to Children */}
                    <div className="absolute top-full left-1/2 w-0.5 h-12 bg-blue-500/30 -translate-x-1/2"></div>
                </div>

                {/* Level 3: Kaur & Kasi (Horizontal) */}
                <div className="relative w-full flex justify-center gap-8 pt-8">
                    {/* Connecting Horizontal Line */}
                    <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-blue-500/30"></div>
                    {/* Vertical Line from Parent */}
                    <div className="absolute -top-12 left-1/2 w-0.5 h-12 bg-blue-500/30 -translate-x-1/2"></div>

                    {sotk_new.kaur.map((item, index) => (
                        <div key={index} className="relative flex flex-col items-center">
                            {/* Vertical Line to Node */}
                            <div className="absolute -top-8 w-0.5 h-8 bg-blue-500/30"></div>
                            <NodeCard
                                data={item}
                                onUpdate={(field, val) => updateKaur(index, field, val)}
                            />
                        </div>
                    ))}
                </div>

                {/* Level 4: Kadus (Horizontal) */}
                <div className="relative w-full flex justify-center gap-8 pt-12">
                    {/* Connecting Horizontal Line */}
                    <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-blue-500/30"></div>

                    {sotk_new.kadus.map((item, index) => (
                        <div key={index} className="relative flex flex-col items-center mt-8">
                            {/* Vertical Line to Node */}
                            <div className="absolute -top-12 w-0.5 h-12 bg-blue-500/30"></div>
                            <NodeCard
                                data={item}
                                onUpdate={(field, val) => updateKadus(index, field, val)}
                            />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

const NodeCard = ({ data, onUpdate, isMain = false }: { data: any, onUpdate: (field: string, val: string) => void, isMain?: boolean }) => (
    <div className={`flex flex-col items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group ${isMain ? 'w-64 scale-110 shadow-2xl shadow-blue-900/20' : 'w-48'}`}>
        <div className={`relative mb-4 overflow-hidden rounded-full border-4 border-white/20 group-hover:border-blue-500 transition-colors ${isMain ? 'w-32 h-32' : 'w-24 h-24'}`}>
            <Editable
                type="image"
                value={data.image}
                onSave={(val) => onUpdate("image", val)}
                className="w-full h-full object-cover"
            />
        </div>
        <div className="text-center w-full">
            <h4 className={`font-bold text-[var(--text-primary)] mb-1 ${isMain ? 'text-lg' : 'text-sm'}`}>
                <Editable value={data.name} onSave={(val) => onUpdate("name", val)} />
            </h4>
            <p className={`text-[var(--text-secondary)] ${isMain ? 'text-sm' : 'text-xs'}`}>
                <Editable value={data.role} onSave={(val) => onUpdate("role", val)} />
            </p>
        </div>
    </div>
);
