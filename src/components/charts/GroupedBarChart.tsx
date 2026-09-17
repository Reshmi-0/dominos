import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GroupedBarChartProps {
  title: string;
  data: any[];
  xKey: string;
  series1Key: string;
  series2Key: string;
  series1Label: string;
  series2Label: string;
  series1Color?: string;
  series2Color?: string;
  formatYAxis?: (val: any) => string;
}

export function GroupedBarChart({
  title,
  data,
  xKey,
  series1Key,
  series2Key,
  series1Label,
  series2Label,
  series1Color = 'var(--color-primary-blue)',
  series2Color = 'var(--color-success-green)',
  formatYAxis = (val: any) => (val != null ? val.toString() : '')
}: GroupedBarChartProps) {
  return (
    <div className="bg-surface-card rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full">
      <h3 className="text-[18px] font-semibold text-text-primary mb-6">{title}</h3>
      
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary">
          No data available
        </div>
      ) : (
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis 
                dataKey={xKey} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} 
                dy={10}
                tickFormatter={(val) => {
                  const d = new Date(val);
                  if (!isNaN(d.getTime())) {
                    return d.toLocaleDateString('en-US', { weekday: 'short' });
                  }
                  return val;
                }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} 
                tickFormatter={formatYAxis}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                labelFormatter={(label) => {
                  const d = new Date(label as string);
                  return isNaN(d.getTime()) ? String(label) : d.toLocaleDateString();
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500 }} 
                iconType="circle"
              />
              <Bar 
                dataKey={series1Key} 
                name={series1Label} 
                fill={series1Color} 
                radius={[4, 4, 0, 0]} 
                barSize={20} 
                animationDuration={600}
              />
              <Bar 
                dataKey={series2Key} 
                name={series2Label} 
                fill={series2Color} 
                radius={[4, 4, 0, 0]} 
                barSize={20} 
                animationDuration={600}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
