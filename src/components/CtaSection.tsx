import { ArrowRight } from "lucide-react";

const WA_LINK =
  "https://wa.me/6285161220600?text=Assalamu'alaikum, saya ingin konsultasi tentang kelas Tahsin/Tahfizh";

const CtaSection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-primary-foreground/30" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full border-2 border-primary-foreground/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-primary-foreground/10" />
      </div>

      <div className="relative z-10 container max-w-2xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
          Mulai Perjalanan Anda Bersama Al-Qur'an
        </h2>
        <p className="text-primary-foreground/80 mb-10 text-lg max-w-lg mx-auto">
          Jangan tunda lagi, daftar sekarang dan mulai belajar bersama pengajar
          bersanad.
        </p>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary-foreground text-primary font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
        >
          Konsultasi Sekarang
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default CtaSection;
