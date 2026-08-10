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

interface CategoryBarChartProps {
  data: { categoria: string; label: string; total: number }[];
}

const COLORS: Record<string, { light: string; dark: string }> = {
  ui_design: { light: "#a855f7", dark: "#a855f7" },
  ux_flow: { light: "#0ea5e9", dark: "#0284c7" },
  qa_test: { light: "#10b981", dark: "#059669" },
};

export function CategoryBarChart({ data }: CategoryBarChartProps) {
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
            payload?: { categoria: string };
          }) => (
            <Rectangle
              {...shapeProps}
              radius={[4, 4, 0, 0]}
              fill={COLORS[shapeProps.payload?.categoria ?? "qa_test"][isDark ? "dark" : "light"]}
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
