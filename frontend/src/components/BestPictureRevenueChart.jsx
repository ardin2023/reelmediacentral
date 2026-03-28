// src/components/BestPictureRevenueChart.jsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function BestPictureRevenueChart({ data }) {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          {/* Use year instead of long title */}
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />

          <YAxis
            tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
            tick={{ fontSize: 12 }}
          />

          {/* Show movie title + revenue */}
          <Tooltip
            formatter={(value, name, props) => {
              const movie = props.payload;
              return [`$${value.toLocaleString()}`, movie.title];
            }}
            labelFormatter={(year) => `Oscar Year: ${year}`}
          />

          {/* Slim bars */}
          <Bar
            dataKey="revenue"
            fill="#845ec2"
            radius={[4, 4, 0, 0]}
            barSize={40}   // ← slim & elegant
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
