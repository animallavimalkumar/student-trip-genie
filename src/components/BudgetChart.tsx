import type { BudgetBreakdown } from "@/types/travel";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = [
  "hsl(174, 62%, 38%)",  // travel - teal
  "hsl(35, 90%, 55%)",   // stay - amber
  "hsl(15, 80%, 55%)",   // food - sunset
  "hsl(200, 60%, 50%)",  // activities - ocean
];

interface Props {
  budget: BudgetBreakdown;
}

const BudgetChart = ({ budget }: Props) => {
  const data = [
    { name: "Travel", value: budget.travel },
    { name: "Stay", value: budget.stay },
    { name: "Food", value: budget.food },
    { name: "Activities", value: budget.activities },
  ].filter((d) => d.value > 0);

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-full md:w-1/2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString()}`}
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid hsl(180, 10%, 88%)",
                fontFamily: "var(--font-body)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full md:w-1/2 space-y-3">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-sm text-foreground">{item.name}</span>
            </div>
            <span className="font-display font-semibold text-foreground">₹{item.value.toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t border-border pt-3 flex items-center justify-between">
          <span className="font-display font-bold text-foreground">Total</span>
          <span className="font-display font-bold text-primary text-lg">₹{budget.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
