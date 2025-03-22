import React,{useState} from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
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

const formatNumber = (num) => `$${num.toLocaleString()}`;

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
  const [activeIndex, setActiveIndex] = useState(null); // Track hovered bar index
  return (
    <div className="w-full ">
      
      <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatNumber}
          tick={{ fontSize: 12, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Bar
          dataKey="value"
          barSize={6}
          radius={[5, 5, 0, 0]}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={activeIndex === index ? "#FF0000" : "#FF8901"} // Red on hover, orange by default
              onMouseEnter={() => setActiveIndex(index)} // Change active index on hover
              
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}
