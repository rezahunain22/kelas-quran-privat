import { Check, Star } from "lucide-react";

const WA_LINK =
  "https://wa.me/6285161220600?text=Assalamu'alaikum, saya ingin mendaftar kelas Tahsin/Tahfizh";

const features = [
  "Bimbingan privat 1-on-1",
  "Evaluasi langsung dari pengajar",
  "Jadwal fleksibel",
  "Feedback setiap pertemuan",
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-background relative">
      <div className="container max-w-lg px-4 sm:px-6 text-center">
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
          Investasi
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Biaya Program
        </h2>
        <p className="text-muted-foreground mb-12">
          Investasi terbaik untuk perjalanan Qur'an Anda
        </p>

        <div className="relative rounded-3xl border-2 border-primary/20 bg-card p-8 sm:p-10 shadow-lg">
          {/* Popular badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full shadow-md">
              <Star className="w-3 h-3" /> Terbaik
            </span>
          </div>
          <p className="text-muted-foreground line-through text-lg mb-2 mt-2">
            Rp. 400.000
          </p>
          <p className="text-5xl sm:text-6xl font-bold text-primary mb-1">
            Rp. 350.000
          </p>
          <p className="text-muted-foreground text-sm mb-8">/ 4 Pertemuan</p>

          <div className="text-left space-y-3 mb-8">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </span>
                <span className="text-sm text-foreground">{f}</span>
              </div>
            ))}
          </div>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 text-center"
          >
            Daftar Sekarang
          </a>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
