import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import "./style.css";
import { Button } from "@/components/ui/button";

interface ChartProps {
  title: string;
  data: Array<{ name: string; Total: number }>;
  width: number | string;
  height: number | string;
  totalOperations: number;
}

const Chart: React.FC<ChartProps> = ({ title, data, width, height, totalOperations }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const getBarFill = (index: number) => {
    return activeIndex === index ? "#FF6B00" : "#2B2D42";
  };

  const handleDownload = () => {
    const projectInfo = {
      title: title,
      weeklyData: data,
      totalOperations: totalOperations,
    };

    const jsonString = JSON.stringify(projectInfo, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = "project_info.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="chart industrial-chart" style={{ width, height }}>
      <div className="title industrial-title">{title}</div>
      <div className="total-operations">Total Operations: {totalOperations}</div>
      <div
        className="chart-container"
        style={{ width: "100%", height: "calc(100% - 80px)" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#8D99AE" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#2B2D42" }}
              axisLine={{ stroke: "#2B2D42" }}
            />
            <YAxis
              tick={{ fill: "#2B2D42" }}
              axisLine={{ stroke: "#2B2D42" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#EDF2F4",
                border: "1px solid #8D99AE",
                borderRadius: "0",
              }}
              cursor={{ fill: "rgba(43, 45, 66, 0.1)" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar
              dataKey="Total"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarFill(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Button onClick={handleDownload} className="download-btn industrial-btn">
        Download project information
      </Button>
    </div>
  );
};

export default Chart;