// src/components/TopStreamingSongsChart.jsx

import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function TopStreamingSongsChart({ data }) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 25, bottom: 25, left: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <YAxis
            dataKey="title"
            type="category"
            tick={{ fontSize: 12 }}
            width={180}
          />

          <XAxis
            type="number"
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
          />

          <Tooltip
            formatter={(v) => `${Number(v).toLocaleString()} streams`}
            labelFormatter={(label) => label}
          />

          <Bar dataKey="streams" fill="#2ecc71" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
