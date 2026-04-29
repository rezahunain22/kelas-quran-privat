import heroPattern from "@/assets/hero-pattern.jpg";
import { Sparkles, Users, Clock } from "lucide-react";

const WA_LINK =
  "https://wa.me/6285161220600?text=Assalamu'alaikum, saya ingin konsultasi tentang kelas Tahsin/Tahfizh";

const stats = [
  { icon: Users, label: "Bimbingan Privat", desc: "1-on-1" },
  { icon: Sparkles, label: "Metode Talaqqi", desc: "Bersanad" },
  { icon: Clock, label: "Jadwal Fleksibel", desc: "Sesuai Waktu Anda" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroPattern})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-secondary" />
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary/8 blur-3xl" />
      </div>

      {/* Decorative geometric elements */}
      <div className="absolute top-20 right-10 w-20 h-20 border-2 border-primary/10 rounded-2xl rotate-12 hidden lg:block" />
      <div className="absolute bottom-32 left-16 w-16 h-16 border-2 border-primary/10 rounded-full hidden lg:block" />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary/20 rounded-full hidden lg:block" />

      <div className="relative z-10 container max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Pendaftaran Dibuka
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            Belajar Al-Qur'an{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">dengan Benar</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 md:h-4 bg-primary/10 rounded-full -z-0" />
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            Bimbingan privat Tahsin & Tahfizh dengan metode talaqqi bersama
            pengajar bersanad. Jadwal fleksibel, belajar dari mana saja.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Konsultasi Gratis
            </a>
            <a
              href="#program"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-border text-foreground font-semibold hover:bg-accent hover:border-accent transition-all duration-300"
            >
              Lihat Program
            </a>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
