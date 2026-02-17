import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowDown } from 'lucide-react';

interface HeroProps {
    onCtaClick: () => void;
    onCheckTicketsClick: () => void;
}

export default function Hero({ onCtaClick, onCheckTicketsClick }: HeroProps) {
    return (
        <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-900 pt-16">
            <div className="absolute inset-0 z-0">
                <img
                    src="/gambar1.jpeg"
                    alt="Bantimurung Nature"
                    className="w-full h-full object-cover opacity-40 scale-105 transition-transform duration-[10s] hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-50" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center text-white">
                <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 px-6 py-2 mb-6 md:mb-8 backdrop-blur-md uppercase tracking-[0.3em] text-[10px] font-bold rounded-full animate-in fade-in slide-in-from-top-4 duration-1000">
                    Bantimurung Waterpark & Nature
                </Badge>
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 leading-[1.1]">
                    Rasakan <span className="text-rose-500 text-glow italic">Kesejukan</span> <br />Alam yang Abadi
                </h1>
                <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto mb-10 md:mb-12 opacity-90 leading-relaxed font-light animate-in fade-in duration-1000 delay-300">
                    Pesan tiket wisata Bantimurung dengan mudah tanpa antrean. Eksplorasi air terjun, penangkaran kupu-kupu, dan keindahan alam Maros yang menakjubkan.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                    <Button
                        className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white rounded-full px-10 md:px-12 h-14 md:h-16 text-base md:text-lg font-bold shadow-2xl shadow-rose-900/40 transition-all hover:scale-105 active:scale-95 group uppercase tracking-widest"
                        onClick={onCtaClick}
                    >
                        Pesan Tiket
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md rounded-full px-10 md:px-12 h-14 md:h-16 text-base md:text-lg font-bold transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
                        onClick={onCheckTicketsClick}
                    >
                        Cek Tiket Saya
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                onClick={onCtaClick}
            >
                <ArrowDown className="text-white w-8 h-8" />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .text-glow {
                    text-shadow: 0 0 30px rgba(244, 63, 94, 0.4);
                }
            `}} />
        </section>
    );
}
