import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function TopWeekendBoxOfficeChart({ data }) {
  return (
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
          tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
        />

        <Tooltip
          formatter={(v) => `$${Number(v).toLocaleString()}`}
        />

        <Bar dataKey="gross" fill="#5b5fc7" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
