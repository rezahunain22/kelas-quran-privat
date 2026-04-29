import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProgresPoint } from "@/data/laporanData";

interface ProgresChartProps {
  data: ProgresPoint[];
}

export const ProgresChart = ({ data }: ProgresChartProps) => {
  return (
    <div className="h-[300px] w-full sm:h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="pekan"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, 100]}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
              fontSize: "0.85rem",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "0.8rem", paddingTop: "8px" }} />
          <Line
            type="monotone"
            dataKey="pengucapan"
            name="Pengucapan"
            stroke="hsl(125, 52%, 33%)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="kelancaran"
            name="Kelancaran"
            stroke="hsl(200, 70%, 45%)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="tajwid"
            name="Tajwid"
            stroke="hsl(35, 85%, 50%)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="tartil"
            name="Tartil"
            stroke="hsl(280, 55%, 50%)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
