import { Logo } from "@/components/ui/logo";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0a0e13]">
            <div className="flex flex-col items-center gap-6">
                <div className="animate-spin duration-[1.5s]">
                    <Logo className="w-16 h-16 text-[#f5a623]" iconOnly={true} />
                </div>
                <div className="text-[#f5a623] font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                    Loading
                </div>
            </div>
        </div>
    );
}
