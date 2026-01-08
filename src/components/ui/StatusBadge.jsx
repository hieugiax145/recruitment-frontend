import { getStatusConfig } from "../../constants/status";

export default function StatusBadge({ status, size = "default" }) {
  const config = getStatusConfig(status);
  
  const sizeClasses = size === "xs" 
    ? "px-2 py-0.5 text-[10px]" 
    : "px-3 py-1 text-xs";

  return (
    <span
      className={`${sizeClasses} rounded-full font-medium whitespace-nowrap border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      {config.label}
    </span>
  );
}
