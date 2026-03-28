// src/components/ReleaseSeasonalityChart.jsx

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function ReleaseSeasonalityChart({ data }) {
  if (!data || !data.length) {
    return <p>No seasonality data available.</p>;
  }

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 40, right: 20, left: 0, bottom: 10 }}
        >

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
          <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#341929"
            fill="#c487a4"
            strokeWidth={3}
            fillOpacity={0.45}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
