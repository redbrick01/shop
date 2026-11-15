interface ProductImagePlaceholderProps {
  color: string;
  label: string;
  className?: string;
}

export function ProductImagePlaceholder({ color, label, className = "" }: ProductImagePlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg text-white font-semibold text-center px-2 ${className}`}
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
  );
}
