import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, CreditCard, QrCode } from 'lucide-react';

export default function Features() {
    const features = [
        {
            title: "Akses Cepat",
            description: "Masuk tanpa antre di loket pembayaran utama. Hemat waktu Anda untuk petualangan yang lebih seru.",
            icon: <ShieldCheck className="w-8 h-8" />,
            color: "bg-rose-100 text-rose-600 shadow-rose-100",
        },
        {
            title: "Keamanan Terjamin",
            description: "Transaksi aman menggunakan gateway Midtrans yang terpercaya dan terenkripsi secara global.",
            icon: <CreditCard className="w-8 h-8" />,
            color: "bg-emerald-100 text-emerald-600 shadow-emerald-100",
        },
        {
            title: "Layanan E-Tiket",
            description: "Tiket otomatis tersimpan & terkirim ke WhatsApp Anda. Lebih praktis dan ramah lingkungan.",
            icon: <QrCode className="w-8 h-8" />,
            color: "bg-blue-100 text-blue-600 shadow-blue-100",
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid gap-6 md:gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-slate-50/50 border-none shadow-none rounded-[32px] md:rounded-[40px] p-2 md:p-4 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 group">
                            <CardHeader className="p-6 md:p-8 text-center md:text-left">
                                <div className={`${feature.color} w-14 h-14 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] flex items-center justify-center mb-6 md:mb-8 shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 mx-auto md:mx-0`}>
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-slate-900 uppercase italic tracking-tight">{feature.title}</CardTitle>
                                <CardDescription className="text-slate-500 text-base md:text-lg leading-relaxed font-medium">{feature.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
