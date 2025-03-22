import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  YAxis,
  CartesianGrid
} from "recharts";

const data = [
  { date: "16", visits: 1600 },
  { date: "17", visits: 1200 },
  { date: "18", visits: 1500 },
  { date: "19", visits: 1800 },
  { date: "20", visits: 1300 },
  { date: "21", visits: 2400 },
  { date: "22", visits: 2700 },
  { date: "23", visits: 2600 },
  { date: "24", visits: 2200 },
  { date: "25", visits: 2550 },
  { date: "26", visits: 3000 },
  { date: "27", visits: 3500 },
  { date: "28", visits: 3000 },
  { date: "29", visits: 2350 },
  { date: "30", visits: 2800 },
];

const formatNumber = (num) => {
  return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
};
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#FF8901",
          borderRadius: ".25vw",
          padding: ".5vw",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {formatNumber(payload[0].value)}
      </div>
    );
  }
  return null;
};

export default function StoreVisitsChart() {

  // Get the 7 most recent dates
  const recentData = data.slice(-14);

  return (
    <div className="">
      <div className="">
        <h3 className="text-lg font-semibold mb-4">Recent 7-day store visits chart</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={recentData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>

            {/* X-axis only grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: "clamp(12px, 1vw, 18px)" }}
              
              ticks={recentData.filter((d) => parseInt(d.date) % 2 === 0).map((d) => d.date)}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            {/* Shadow below the line using duplicated Line component with opacity */}
            <Line
              type="natural"
              dataKey="visits"
              stroke="#000000"
              strokeWidth={4}
              dot={false}
              activeDot={{
                r: 0,
              }}
              strokeOpacity={0.05} // Shadow effect with lower opacity and thicker stroke
              data={recentData.map((point) => ({ ...point, visits: point.visits - 100 }))} //
            />

            {/* Main line with hover dots */}
            <Line
              type="natural"
              dataKey="visits"
              stroke="#f97316"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#ffffff",
                stroke: "#f97316",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
