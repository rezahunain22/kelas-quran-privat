import { Award, BookOpen, GraduationCap } from "lucide-react";

const PengajarSection = () => {
  return (
    <section id="pengajar" className="py-20 md:py-28 bg-secondary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="container max-w-4xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
            Pengajar
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Mulia Bersama Al-Qur'an
          </h2>
          <p className="text-muted-foreground">
            Bimbingan langsung dengan pengajar berpengalaman
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-6 sm:p-8 md:p-10 shadow-[var(--shadow-card)]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20">
                  <span className="text-4xl md:text-5xl font-bold text-primary">
                    MR
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <GraduationCap className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Ustadz Mohammad Reza, B.A
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Pengajar Al-Qur'an
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50">
                  <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">
                    Memiliki sanad Qiraat Hafsh 'An 'Ashim
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50">
                  <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-foreground">
                    <span>Memiliki sanad matan tajwid:</span>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        Tuhfathul Athfal (Syahadatan wa Riwayatan)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        Al-Jazari (Riwayatan)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PengajarSection;
