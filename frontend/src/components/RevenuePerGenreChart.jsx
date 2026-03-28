// src/components/RevenuePerGenreChart.jsx

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function RevenuePerGenreChart({ data }) {
  if (!data || !data.rows || data.rows.length === 0) {
    return <p>No genre revenue data available.</p>;
  }

  const { rows, genres } = data;

  // Recharts default color palette
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#0088fe",
    "#a4de6c",
    "#d0ed57",
    "#8dd1e1",
    "#d88884",
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={rows}
          barSize={22}  // <<<<<< NARROWER BARS
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            tickFormatter={(v) => `$${(v / 1_000_000_000).toFixed(1)}B`}
          />
          <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
          <Legend />

          {genres.map((g, idx) => (
            <Bar
              key={g}
              dataKey={g}
              stackId="a"
              fill={colors[idx % colors.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
