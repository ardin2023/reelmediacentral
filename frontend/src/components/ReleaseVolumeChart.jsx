// src/components/ReleaseVolumeChart.jsx

import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function ReleaseVolumeChart({ data }) {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="year" />
          <YAxis tickFormatter={(v) => `${v}`} />

          <Tooltip />
          <Line
            type="monotone"
            dataKey="releases"
            stroke="#ff6f91"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
