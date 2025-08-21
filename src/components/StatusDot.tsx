type Status = "online" | "degraded" | "offline";

export default function StatusDot({ status, label, size = "md" }: { 
  status: Status; 
  label?: string; 
  size?: "sm" | "md" | "lg";
}) {
  const color =
    status === "online" ? "bg-emerald-500" : status === "degraded" ? "bg-amber-500" : "bg-red-500";
  const text = label ?? (status === "online" ? "Online" : status === "degraded" ? "Degradado" : "Offline");
  const dotSize = size === "sm" ? "size-1.5" : size === "lg" ? "size-3" : "size-2";
  
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`${dotSize} rounded-full ${color}`} />
      {label !== null && <span className="text-xs text-gray-600">{text}</span>}
    </span>
  );
}


