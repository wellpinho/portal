import { Store } from "lucide-react";

export default function LogoComponent() {
  return (
    <>
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
        <Store className="w-6 h-6 text-white" aria-hidden="true" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-extrabold tracking-tight">Comércios</span>
        <span className="text-[10px] font-semibold text-emerald-50 -mt-0.5 tracking-wide uppercase">
          Locais
        </span>
      </div>
    </>
  );
}
