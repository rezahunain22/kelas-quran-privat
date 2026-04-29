import { BookOpen, BookMarked, GraduationCap, ArrowRight } from "lucide-react";

const programs = [
  {
    icon: BookOpen,
    title: "Pra-Tahsin",
    accent: "from-amber-500/10 to-amber-500/5",
    iconBg: "bg-amber-500/10 text-amber-600",
    badge: "Pemula",
    description:
      "Kelas bimbingan menggunakan metode Iqra atau metode sejenis untuk membangun pondasi dan melancarkan bacaan Al-Qur'an.",
  },
  {
    icon: BookMarked,
    title: "Tahsin",
    accent: "from-primary/10 to-primary/5",
    iconBg: "bg-primary/10 text-primary",
    badge: "Populer",
    description:
      "Kelas perbaikan bacaan Al-Qur'an dengan sistem talaqqi / musyafahah untuk memastikan makhraj dan tajwid sesuai kaidah.",
  },
  {
    icon: GraduationCap,
    title: "Tahfizh",
    accent: "from-blue-500/10 to-blue-500/5",
    iconBg: "bg-blue-500/10 text-blue-600",
    badge: "Intensif",
    description:
      "Program fokus hafalan Al-Qur'an dengan bimbingan intensif dan penjagaan kualitas bacaan.",
  },
];

const ProgramSection = () => {
  return (
    <section id="program" className="py-20 md:py-28 bg-background relative">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
            Program
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Pilih Jalur Belajar Anda
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tiga program yang dirancang untuk setiap level kemampuan
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <div
              key={p.title}
              className={`group relative rounded-2xl border bg-card p-7 sm:p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
                i === 1 ? "ring-2 ring-primary/20" : ""
              }`}
            >
              {/* Gradient bg */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                {i === 1 && (
                  <span className="absolute -top-1 -right-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
                    {p.badge}
                  </span>
                )}

                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${p.iconBg} mb-6`}
                >
                  <p.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {p.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm mb-5">
                  {p.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Pelajari lebih lanjut <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;