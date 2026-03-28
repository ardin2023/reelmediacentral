// src/components/MovieRevenueChart.jsx

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function MovieRevenueChart({ data }) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis 
            tickFormatter={(v) => `$${(v / 1_000_000_000).toFixed(1)}B`} 
          />
          <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#1e73be" 
            strokeWidth={3} 
            dot={{ r: 5 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
