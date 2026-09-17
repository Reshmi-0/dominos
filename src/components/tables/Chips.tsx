type ChipType = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BaseChipProps {
  label: string;
  type: ChipType;
}

export function Chip({ label, type }: BaseChipProps) {
  const baseClasses = "inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-semibold";
  
  const typeClasses: Record<ChipType, string> = {
    success: "bg-[#1FAE6B]/15 text-[#1FAE6B]",
    warning: "bg-[#F5A524]/15 text-[#F5A524]",
    danger: "bg-[#E31837]/15 text-[#E31837]",
    info: "bg-[#1E63D6]/15 text-[#1E63D6]",
    default: "bg-[#7C5CFC]/15 text-[#7C5CFC]",
  };

  return (
    <span className={`${baseClasses} ${typeClasses[type]}`}>
      {label}
    </span>
  );
}

export function StatusChip({ status }: { status: string }) {
  let type: ChipType = 'default';
  
  switch (status.toLowerCase()) {
    case 'delivered':
    case 'completed':
      type = 'success';
      break;
    case 'preparing':
    case 'pending':
      type = 'warning';
      break;
    case 'out for delivery':
    case 'dine-in':
      type = 'info';
      break;
    case 'cancelled':
    case 'delivery':
      type = 'danger';
      break;
    case 'takeaway':
      type = 'default';
      break;
    case 'online order':
      type = 'warning';
      break;
  }
  
  return <Chip label={status} type={type} />;
}

export function CategoryChip({ category }: { category: string }) {
  let type: ChipType = 'default';
  
  switch (category.toLowerCase()) {
    case 'veg':
      type = 'success';
      break;
    case 'non-veg':
      type = 'danger';
      break;
    case 'classic':
      type = 'info';
      break;
  }
  
  return <Chip label={category} type={type} />;
}
