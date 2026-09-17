import { Calendar, ChevronDown, MapPin } from 'lucide-react';
import { useDateRange } from '../../context/DateRangeContext';
import { useState } from 'react';
import founderImg from '../../assets/founder.jpg';

interface HeaderProps {
  showDateFilter?: boolean;
}

export function Header({ showDateFilter = true }: HeaderProps) {
  const { dateRangeLabel, setDateRangeLabel } = useDateRange();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const options = ['Today', 'Last 7 Days', 'Last 30 Days'];

  return (
    <header className="h-20 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-6">
        {showDateFilter && (
          <div className="relative">
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-bg-app px-4 py-2 rounded-full border border-border cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Calendar size={16} className="text-text-secondary" />
              <span className="text-[14px] font-medium text-text-primary">{dateRangeLabel}</span>
              <ChevronDown size={16} className="text-text-secondary" />
            </div>
            
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                {options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setDateRangeLabel(opt);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[14px] font-medium hover:bg-bg-app transition-colors ${dateRangeLabel === opt ? 'text-primary-blue bg-blue-50/50' : 'text-text-primary'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="h-8 w-px bg-border"></div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-border overflow-hidden bg-surface-card shrink-0">
              <img src={founderImg} alt="Founder Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-text-secondary font-medium uppercase tracking-wide">Founder</span>
              <span className="text-[14px] font-semibold text-text-primary leading-tight">Reshmi</span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-border"></div>
          
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-primary-blue" />
            <span className="text-[14px] font-medium text-text-primary">Domino's Gola Road</span>
          </div>
        </div>
      </div>
    </header>
  );
}
