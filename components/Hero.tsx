
import Image from "next/image";

const Hero = () => {
    return (
        <div className="relative bg-gray-900 h-[500px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-60">
                <Image
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000"
                    alt="Desa Cenrana Landscape"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                />
            </div>
            <div className="relative z-10 text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    Selamat Datang di <span className="text-desa-gold">Desa Cenrana</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">
                    Mewujudkan Desa Mandiri, Sejahtera, dan Berbudaya di Kabupaten Maros
                </p>
            </div>
        </div>
    );
};

export default Hero;
