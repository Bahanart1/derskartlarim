import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  label?: string;
}

export function LoadingScreen({ label = "Yükleniyor..." }: LoadingScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 mesh-bg">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Loader2 className="w-7 h-7 text-white animate-spin" />
        </div>
        <div className="absolute -inset-2 rounded-3xl bg-indigo-500/20 blur-xl animate-pulse-soft" />
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
