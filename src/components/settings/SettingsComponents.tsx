import React from 'react';

export function SettingsCard({ title, subtitle, icon: Icon, children, actions }: { title: string, subtitle?: string, icon: any, children: React.ReactNode, actions?: React.ReactNode }) {
  return (
    <div className="bg-surface-card rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-bg-app flex items-center justify-center text-primary-blue shrink-0">
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold text-text-primary">{title}</h3>
          {subtitle && <p className="text-[13px] text-text-secondary mt-1">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-5">
        {children}
      </div>
      
      {actions && (
        <div className="mt-6 pt-6 border-t border-border flex justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}

export function FormField({ label, value, readOnly = false, type = "text", onChange }: { label: string, value: string, readOnly?: boolean, type?: string, onChange?: (val: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-text-secondary">{label}</label>
      <input 
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`px-4 py-2.5 rounded-lg border text-[14px] font-medium outline-none transition-colors ${readOnly ? 'bg-bg-app border-border text-text-secondary' : 'bg-white border-gray-300 text-text-primary focus:border-primary-blue focus:ring-1 focus:ring-primary-blue'}`}
      />
    </div>
  );
}

export function ToggleRow({ label, checked, onChange }: { label: string, checked: boolean, onChange?: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[14px] font-medium text-text-primary">{label}</span>
      <button 
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 ${checked ? 'bg-primary-blue' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

export function CheckboxRow({ label, checked, onChange }: { label: string, checked: boolean, onChange?: (val: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 py-1 cursor-pointer group">
      <input 
        type="checkbox" 
        className="hidden" 
        checked={checked} 
        onChange={(e) => onChange?.(e.target.checked)} 
      />
      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${checked ? 'bg-primary-blue border-primary-blue text-white' : 'border-gray-300 bg-white group-hover:border-primary-blue'}`}>
        {checked && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-[14px] font-medium text-text-primary">{label}</span>
    </label>
  );
}
