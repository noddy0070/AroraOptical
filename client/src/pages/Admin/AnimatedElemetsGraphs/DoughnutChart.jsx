import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { useSpring, animated } from "@react-spring/web";

// Data for the chart, memoized to prevent unnecessary re-renders


const AnimatedSector = animated(Sector); // Animated sector for active slice

/**
 * Custom render function for the active pie sector with animation.
 */
const renderActiveShape = ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }) => {
  const { animatedOuterRadius } = useSpring({
    from: { animatedOuterRadius: outerRadius },
    to: { animatedOuterRadius: outerRadius + 19.28 }, // Expand the active sector
    config: { tension: 200, friction: 20, duration: 250 },
  });

  return (
    <g>
      <AnimatedSector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={animatedOuterRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const DoughnutChart = ({data}) => {
  const [activeIndex, setActiveIndex] = useState(null); // Tracks the active slice index

// Calculate total value for percentage calculation
const totalValue = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

// Calculate the target percentage based on activeIndex
const targetPercentage = activeIndex !== null
  ? Math.round((data[activeIndex].value / totalValue) * 100)
  : 0; // Default to 0% when no slice is active

// Animate percentage and scale
const { animatedPercentage, scale } = useSpring({
  from: { animatedPercentage: 0, scale: 1 },
  to: {
    animatedPercentage: targetPercentage,
    scale: activeIndex !== null ? 1.1 : 1, // Scale up when a slice is active
  },
  config: { tension: 170, friction: 20, duration: 250 },
});


  return (
    <div className="w-[16.625vw] h-[16.625vw] mx-auto">
      <div className="relative flex justify-center w-[15.4vw] h-[15.4vw]  overflow-auto items-center">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={100}
              stroke="none" 
              onMouseEnter={(_, index) => setActiveIndex(index)} // Update active sector on hover
              onMouseLeave={() => setActiveIndex(null)} // Reset active sector on leave
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Centered animated percentage display */}
          <animated.p className="absolute text-center font-roboto font-semibold text-h5Text">
            {animatedPercentage.to((val) => `${val.toFixed(0)}%`)}
          </animated.p>
      </div>
    </div>
  );
};

export default DoughnutChart;
