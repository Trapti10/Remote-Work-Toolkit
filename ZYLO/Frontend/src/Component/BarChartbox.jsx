 import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const BarChartbox = ({ tasks }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-2xl">
      <h2 className="mb-2 font-semibold">Task Progress</h2>

      <BarChart width={350} height={250} data={tasks}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis className="font-semibold"/>
        <Tooltip />
        <Bar dataKey="progress" />
      </BarChart>
    </div>
  );
};

export default BarChartbox;
