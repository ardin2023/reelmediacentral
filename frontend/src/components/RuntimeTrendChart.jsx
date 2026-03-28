// src/components/RuntimeTrendChart.jsx

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer
} from "recharts";

export default function RuntimeTrendChart({ data }) {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 40, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="year" tick={{ fontSize: 12 }} />

          <YAxis
            dataKey="avgRuntime"
            tickFormatter={(v) => `${v} min`}
            tick={{ fontSize: 12 }}
          />

          <Tooltip formatter={(v) => `${v} minutes`} />

          {/* Scatter points */}
          <Scatter data={data} fill="#9b1fe8" />

          {/* Trendline */}
          <Line
            type="monotone"
            dataKey="avgRuntime"
            data={data}
            stroke="#7a11cc"
            strokeWidth={3}
            dot={false}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
