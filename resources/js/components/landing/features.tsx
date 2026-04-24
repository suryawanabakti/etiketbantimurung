import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, CreditCard, QrCode } from 'lucide-react';

export default function Features() {
    const features = [
        {
            title: "Akses Cepat",
            description: "Masuk tanpa antre di loket pembayaran utama. Hemat waktu Anda untuk petualangan yang lebih seru.",
            icon: <ShieldCheck className="w-6 h-6" />,
        },
        {
            title: "Keamanan Terjamin",
            description: "Transaksi aman menggunakan gateway Midtrans yang terpercaya dan terenkripsi secara global.",
            icon: <CreditCard className="w-6 h-6" />,
        },
        {
            title: "Layanan E-Tiket",
            description: "Tiket otomatis tersimpan & terkirim ke WhatsApp Anda. Lebih praktis dan ramah lingkungan.",
            icon: <QrCode className="w-6 h-6" />,
        }
    ];

    return (
        <section id="features" className="pt-4 pb-16 md:py-20 bg-[#fff9f9] scroll-mt-16">
            <div className="max-w-7xl mx-auto px-6 md:px-8 text-center text-slate-900">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900">
                        Mengapa Harus Memilih E-Tiket Bantimurung?
                    </h2>
                    <div className="w-16 h-1 bg-red-800 mx-auto mb-6"></div>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
                        Temukan alasan kuat mengapa pemesanan E-Tiket Bantimurung adalah pilihan tepat untuk kemudahan wisata digital Anda.
                    </p>
                </div>

                <div className="grid gap-6 md:gap-8 md:grid-cols-3 text-left">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-white border text-left border-red-50 shadow-sm shadow-red-900/5 rounded-3xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/10 relative overflow-hidden group">
                            <span className="absolute top-6 right-6 text-7xl font-bold text-slate-50 group-hover:text-red-50 transition-colors pointer-events-none select-none z-0">
                                0{index + 1}
                            </span>
                            <CardHeader className="p-0 relative z-10">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-50 text-red-800 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-lg md:text-xl font-bold mb-3 text-slate-900 tracking-normal">
                                    {feature.title}
                                </CardTitle>
                                <CardDescription className="text-slate-500 text-sm md:text-base leading-relaxed font-normal">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
