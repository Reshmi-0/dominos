import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface TrendAreaChartProps {
  title: string;
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  formatYAxis?: (val: any) => string;
}

export function TrendAreaChart({
  title,
  data,
  xKey,
  yKey,
  color = 'var(--color-primary-blue)',
  formatYAxis = (val: any) => (val != null ? val.toString() : '')
}: TrendAreaChartProps) {
  return (
    <div className="bg-surface-card rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-semibold text-text-primary">{title}</h3>
      </div>
      
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary">
          No data available
        </div>
      ) : (
        <div className="flex-1 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`color-${yKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis 
                dataKey={xKey} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} 
                dy={10} 
                tickFormatter={(val) => {
                  // If it's a date string, format to short day
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
                formatter={(value: any) => {
                  if (formatYAxis && typeof value === 'number') {
                    return [formatYAxis(value), 'Value'];
                  }
                  return [String(value), 'Value'];
                }}
                labelFormatter={(label) => {
                  const d = new Date(label as string);
                  return isNaN(d.getTime()) ? String(label) : d.toLocaleDateString();
                }}
              />
              <Area 
                type="monotone" 
                dataKey={yKey} 
                stroke={color} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#color-${yKey})`} 
                activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
