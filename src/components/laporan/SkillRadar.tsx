import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { SkillScore } from "@/data/laporanData";

interface SkillRadarProps {
  skill: SkillScore;
}

export const SkillRadar = ({ skill }: SkillRadarProps) => {
  const data = [
    { skill: "Pengucapan", nilai: skill.pengucapan, full: 100 },
    { skill: "Kelancaran", nilai: skill.kelancaran, full: 100 },
    { skill: "Tajwid", nilai: skill.tajwid, full: 100 },
    { skill: "Tartil", nilai: skill.tartil, full: 100 },
  ];

  return (
    <div className="h-[280px] w-full sm:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            stroke="hsl(var(--border))"
          />
          <Radar
            name="Skill"
            dataKey="nilai"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.35}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
