import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ReportTooltip } from "@/modules/reportes/components/ReportTooltip";
import { useTheme } from "@/shared/hooks/useTheme";

interface TrendAreaChartProps {
  data: { label: string; total: number }[];
}

export function TrendAreaChart({ data }: TrendAreaChartProps) {
  const { isDark } = useTheme();
  const gridColor = isDark ? "#2c2c2a" : "#e1e0d9";
  const tickColor = "#898781";
  const lineColor = isDark ? "#34d399" : "#10b981";

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={lineColor} stopOpacity={0.18} />
            <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={gridColor} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: tickColor }}
          axisLine={{ stroke: gridColor }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
        <Tooltip content={<ReportTooltip />} cursor={{ stroke: gridColor }} />
        <Area
          type="monotone"
          dataKey="total"
          stroke={lineColor}
          strokeWidth={2}
          fill="url(#trendFill)"
          dot={false}
          activeDot={{ r: 4, fill: lineColor, stroke: isDark ? "#1a1a19" : "#fcfcfb", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
