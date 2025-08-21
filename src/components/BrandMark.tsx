import Image from "next/image";

export default function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/vercel.svg" alt="Logo" width={size} height={size} className="opacity-80 dark:invert" />
      <span className="text-lg font-semibold tracking-tight">VETA</span>
    </div>
  );
}


