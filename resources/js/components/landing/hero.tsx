import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowDown } from 'lucide-react';

interface HeroProps {
    onCtaClick: () => void;
    onCheckTicketsClick: () => void;
}

export default function Hero({ onCtaClick, onCheckTicketsClick }: HeroProps) {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/gambar1.png"
                    alt="Bantimurung Nature"
                    className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-red-900/60 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900 via-transparent to-transparent opacity-80" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white pt-20">

                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                    Rasakan Kesejukan Alam yang Abadi
                </h1>

                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                    Pesan tiket wisata Bantimurung dengan mudah tanpa antrean. Eksplorasi air terjun, penangkaran kupu-kupu, dan keindahan alam Maros yang menakjubkan.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        className="w-full sm:w-auto bg-gradient-to-r from-violet-700 to-red-600 hover:from-violet-800 hover:to-red-700 text-white border-0 rounded-full px-10 h-14 md:h-14 text-base font-bold shadow-lg transition-transform hover:scale-105"
                        onClick={onCtaClick}
                    >
                        Pesan Tiket

                    </Button>
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white border-white rounded-full px-10 h-14 md:h-14 text-base font-bold transition-transform hover:scale-105"
                        onClick={onCheckTicketsClick}
                    >
                        Cek Tiket Saya
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                onClick={onCtaClick}
            >
                <ArrowDown className="text-white w-8 h-8" />
            </div>
        </section>
    );
}
