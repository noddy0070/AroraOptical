import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { date: "20", value: 3500 },
  { date: "22", value: 8200 },
  { date: "24", value: 4500 },
  { date: "26", value: 4700 },
  { date: "28", value: 3600 },
  { date: "30", value: 4200 },
  { date: "02", value: 3400 },
  { date: "04", value: 6000 },
  { date: "06", value: 4000 },
  { date: "08", value: 2500 },
  { date: "10", value: 8600 },
  { date: "12", value: 4500 },
  { date: "14", value: 3700 },
  { date: "16", value: 4300 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow text-sm">
        <p className="font-semibold">Date: {payload[0].payload.date}</p>
        <p>Value: ${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardChart() {
  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        <a
          href="#"
          className="text-sm text-gray-500 hover:text-blue-600 transition"
        >
          Advanced Report →
        </a>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="#f97316"
            radius={[5, 5, 0, 0]}
            barSize={20}
          >
            {data.map((entry, index) => (
              <rect
                key={index}
                x={0}
                y={0}
                width={20}
                height={entry.value}
                className={
                  entry.date === "04" ? "fill-red-500" : "fill-orange-500"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
