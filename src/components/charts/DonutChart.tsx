import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DonutData {
  name: string;
  value: number;
  color: string;
  percentage?: number;
}

interface DonutChartProps {
  title: string;
  data: DonutData[];
  centerLabel: string;
  centerSubLabel: string;
}

export function DonutChart({
  title,
  data,
  centerLabel,
  centerSubLabel
}: DonutChartProps) {
  return (
    <div className="bg-surface-card rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full">
      <h3 className="text-[18px] font-semibold text-text-primary mb-6">{title}</h3>
      
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary">
          No data available
        </div>
      ) : (
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="relative w-[200px] h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  animationDuration={600}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: any) => [typeof value === 'number' && value >= 1000 ? `₹${(value / 1000).toFixed(1)}K` : `₹${value}`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[20px] font-bold text-text-primary">{centerLabel}</span>
              <span className="text-[12px] font-medium text-text-secondary">{centerSubLabel}</span>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="flex flex-col gap-3 flex-1">
            {data.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[14px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-text-primary">{item.name}</span>
                </div>
                <div className="font-semibold text-text-primary">
                  {item.percentage !== undefined ? `${item.percentage.toFixed(1)}%` : item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
