type KpiCardProps = {
  label: string;
  value: string;
  trend?: string;
  color?: "blue" | "green" | "purple";
};

export default function KpiCard({ label, value, trend, color = "blue" }: KpiCardProps) {
  const gradients = {
    blue: "bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200/60",
    green: "bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200/60",
    purple: "bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200/60",
  };
  
  const textColors = {
    blue: "text-blue-700",
    green: "text-emerald-700", 
    purple: "text-purple-700",
  };

  return (
    <div className={`rounded-xl ring-1 ring-black/5 p-4 shadow-sm ${gradients[color]}`}>
      <div className="text-xs font-medium text-gray-600">{label}</div>
      <div className={`mt-1 text-xl font-bold tracking-tight ${textColors[color]}`}>{value}</div>
      {trend && <div className="mt-1 text-xs text-emerald-600">{trend}</div>}
    </div>
  );
}


