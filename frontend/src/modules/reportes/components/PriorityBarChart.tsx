import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ReportTooltip } from "@/modules/reportes/components/ReportTooltip";
import { useTheme } from "@/shared/hooks/useTheme";

interface PriorityBarChartProps {
  data: { prioridad: string; label: string; total: number }[];
}

const COLORS: Record<string, { light: string; dark: string }> = {
  alta: { light: "#f43f5e", dark: "#e11d48" },
  media: { light: "#f59e0b", dark: "#d97706" },
  baja: { light: "#94a3b8", dark: "#64748b" },
};

export function PriorityBarChart({ data }: PriorityBarChartProps) {
  const { isDark } = useTheme();
  const gridColor = isDark ? "#2c2c2a" : "#e1e0d9";
  const tickColor = "#898781";

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 16, right: 8, left: -16, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke={gridColor} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: tickColor }}
          axisLine={{ stroke: gridColor }}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<ReportTooltip />} cursor={{ fill: isDark ? "#ffffff0d" : "#0000000a" }} />
        <Bar
          dataKey="total"
          maxBarSize={48}
          shape={(shapeProps: {
            x?: number;
            y?: number;
            width?: number;
            height?: number;
            payload?: { prioridad: string };
          }) => (
            <Rectangle
              {...shapeProps}
              radius={[4, 4, 0, 0]}
              fill={COLORS[shapeProps.payload?.prioridad ?? "media"][isDark ? "dark" : "light"]}
            />
          )}
        >
          <LabelList
            dataKey="total"
            position="top"
            style={{ fontSize: 12, fontWeight: 600, fill: isDark ? "#c3c2b7" : "#52514e" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
