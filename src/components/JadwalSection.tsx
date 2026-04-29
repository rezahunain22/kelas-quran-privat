import { Clock, CheckCircle2, XCircle } from "lucide-react";

type Slot = { time: string; status: "Tersedia" | "Terisi" };

type DaySchedule = { day: string; slots: Slot[] };

const schedule: DaySchedule[] = [
  {
    day: "Senin",
    slots: [
      { time: "16.00 - 17.00", status: "Tersedia" },
      { time: "17.00 - 18.00", status: "Tersedia" },
      { time: "18.00 - 19.00", status: "Terisi" },
      { time: "19.00 - 20.00", status: "Tersedia" },
    ],
  },
  {
    day: "Selasa",
    slots: [
      { time: "16.00 - 17.00", status: "Tersedia" },
      { time: "17.00 - 18.00", status: "Tersedia" },
      { time: "18.00 - 19.00", status: "Tersedia" },
      { time: "19.00 - 20.00", status: "Tersedia" },
    ],
  },
  {
    day: "Rabu",
    slots: [
      { time: "16.00 - 17.00", status: "Tersedia" },
      { time: "17.00 - 18.00", status: "Tersedia" },
      { time: "18.00 - 19.00", status: "Terisi" },
      { time: "19.00 - 20.00", status: "Tersedia" },
    ],
  },
  {
    day: "Kamis",
    slots: [
      { time: "16.00 - 17.00", status: "Tersedia" },
      { time: "17.00 - 18.00", status: "Tersedia" },
      { time: "18.00 - 19.00", status: "Terisi" },
      { time: "19.00 - 20.00", status: "Terisi" },
    ],
  },
  {
    day: "Jum'at",
    slots: [
      { time: "16.00 - 17.00", status: "Tersedia" },
      { time: "17.00 - 18.00", status: "Tersedia" },
      { time: "18.00 - 19.00", status: "Terisi" },
      { time: "19.00 - 20.00", status: "Tersedia" },
    ],
  },
  {
    day: "Sabtu",
    slots: [
      { time: "09.00 - 10.00", status: "Tersedia" },
      { time: "10.00 - 11.00", status: "Tersedia" },
      { time: "13.00 - 14.00", status: "Tersedia" },
      { time: "14.00 - 15.00", status: "Tersedia" },
      { time: "15.00 - 16.00", status: "Tersedia" },
      { time: "16.00 - 17.00", status: "Tersedia" },
      { time: "17.00 - 18.00", status: "Tersedia" },
      { time: "18.00 - 19.00", status: "Tersedia" },
      { time: "19.00 - 20.00", status: "Tersedia" },
    ],
  },
  {
    day: "Ahad",
    slots: [
      { time: "09.00 - 10.00", status: "Tersedia" },
      { time: "10.00 - 11.00", status: "Tersedia" },
      { time: "13.00 - 14.00", status: "Tersedia" },
      { time: "14.00 - 15.00", status: "Tersedia" },
      { time: "15.00 - 16.00", status: "Tersedia" },
      { time: "16.00 - 17.00", status: "Tersedia" },
      { time: "17.00 - 18.00", status: "Tersedia" },
      { time: "18.00 - 19.00", status: "Tersedia" },
      { time: "19.00 - 20.00", status: "Tersedia" },
    ],
  },
];

const JadwalSection = () => {
  return (
    <section id="jadwal" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-20 left-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 right-0 w-56 h-56 rounded-full bg-primary/5 blur-3xl" />

      <div className="container max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
            Jadwal
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Jadwal Ketersediaan
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Pilih jadwal yang sesuai dengan waktu Anda. Slot bertanda{" "}
            <span className="text-primary font-semibold">Terisi</span> sudah terisi.
          </p>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-10 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-muted-foreground/20" />
            <span className="text-muted-foreground">Tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-foreground font-medium">Terisi</span>
          </div>
        </div>

        {/* Grid of day cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {schedule.map((day) => (
            <div
              key={day.day}
              className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-lg">{day.day}</h3>
              </div>

              <div className="space-y-2">
                {day.slots.map((slot) => {
                  const isTersedia = slot.status === "Tersedia";
                  return (
                    <div
                      key={`${day.day}-${slot.time}`}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        isTersedia
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-secondary/50 border border-border/50"
                      }`}
                    >
                      <span className={isTersedia ? "text-primary font-medium" : "text-muted-foreground"}>
                        {slot.time}
                      </span>
                      {isTersedia ? (
                        <span className="flex items-center gap-1 text-primary font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Tersedia
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground/60 text-xs">
                          <XCircle className="w-3.5 h-3.5" />
                          Terisi
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JadwalSection;
