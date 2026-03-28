// src/components/GenreTrendChart.jsx
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function GenreTrendChart({ data }) {
  if (!data || !data.rows || data.rows.length === 0) {
    return <p>No genre data available.</p>;
  }

  const { rows, genres } = data;
  const colors = ["#1e73be", "#e67e22", "#27ae60", "#9b59b6", "#c0392b"];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={rows} margin={{ top: 40, right: 20, left: 0, bottom: 10 }}>
        
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        
        {genres.map((g, idx) => (
          <Line
            key={g}
            type="monotone"
            dataKey={g}
            stroke={colors[idx % colors.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
