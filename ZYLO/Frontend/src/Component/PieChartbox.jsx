import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PieChartbox = ({ tasks }) => {

  const data = [
    { name: "Completed", value: tasks.filter(t => t.progress === 100).length },
    { name: "Pending", value: tasks.filter(t => t.progress < 100).length },
    { name: "Overdue", value: tasks.filter(t => t.status === "Overdue").length },
  ];

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  return (
    <div className="bg-white p-4 rounded-xl shadow-2xl">
      <h2 className="mb-2 font-semibold">Task Distribution</h2>

      <PieChart width={300} height={250}>
        <Pie data={data} dataKey="value" outerRadius={80} label>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend  />
      </PieChart>
    </div>
  );
};

export default PieChartbox;