import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ReportTooltip } from "@/modules/reportes/components/ReportTooltip";
import { useTheme } from "@/shared/hooks/useTheme";

interface EstadoBarChartProps {
  data: { estado: string; label: string; total: number }[];
}

export function EstadoBarChart({ data }: EstadoBarChartProps) {
  const { isDark } = useTheme();
  const gridColor = isDark ? "#2c2c2a" : "#e1e0d9";
  const tickColor = "#898781";
  const barColor = isDark ? "#818cf8" : "#6366f1";

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 34)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 28, left: 8, bottom: 0 }}
        barCategoryGap="25%"
      >
        <CartesianGrid horizontal={false} stroke={gridColor} />
        <XAxis type="number" hide allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={132}
          tick={{ fontSize: 12, fill: tickColor }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ReportTooltip />} cursor={{ fill: isDark ? "#ffffff0d" : "#0000000a" }} />
        <Bar dataKey="total" fill={barColor} radius={[0, 4, 4, 0]} maxBarSize={18}>
          <LabelList
            dataKey="total"
            position="right"
            style={{ fontSize: 12, fontWeight: 600, fill: isDark ? "#c3c2b7" : "#52514e" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
