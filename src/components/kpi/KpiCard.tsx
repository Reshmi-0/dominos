import { ArrowUp, ArrowDown } from 'lucide-react';
import React from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  deltaPct: number;
  deltaDirection: 'up' | 'down';
  compareLabel?: string;
  inverseColors?: boolean; // If true, down is green and up is red
}

export function KpiCard({
  label,
  value,
  icon,
  iconBgColor,
  iconTextColor,
  deltaPct,
  deltaDirection,
  compareLabel,
  inverseColors = false,
}: KpiCardProps) {
  const isPositive = deltaDirection === 'up';
  
  // Determine color of the delta text
  let isGood = isPositive;
  if (inverseColors) isGood = !isGood;
  
  const deltaColorClass = isGood ? 'text-success-green' : 'text-domino-red';
  const DeltaIcon = deltaDirection === 'up' ? ArrowUp : ArrowDown;

  return (
    <div className="bg-surface-card rounded-2xl p-6 border border-border shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div 
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconBgColor, color: iconTextColor }}
        >
          {icon}
        </div>
      </div>
      
      <div>
        <h3 className="text-[28px] font-bold text-text-primary leading-none mb-1">{value}</h3>
        <p className="text-[14px] font-medium text-text-secondary">{label}</p>
      </div>
      
      <div className={`flex items-center gap-1 text-[13px] font-semibold ${deltaColorClass}`}>
        <DeltaIcon size={16} />
        <span>{deltaPct.toFixed(1)}%</span>
        {compareLabel && <span className="text-text-secondary font-medium ml-1">{compareLabel}</span>}
      </div>
    </div>
  );
}
