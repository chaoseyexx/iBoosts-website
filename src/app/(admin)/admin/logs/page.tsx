import { getAdminLogs } from "@/app/(admin)/admin/actions";
import { ShieldCheck, Clock, User, DollarSign, ShieldBan } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export default async function AdminLogsPage() {
    const logs = await getAdminLogs({ limit: 100 });

    const getActionIcon = (action: string) => {
        if (action.includes("BALANCE")) return DollarSign;
        if (action.includes("BAN") || action.includes("SUSPEND")) return ShieldBan;
        return User;
    };

    const getActionColor = (action: string) => {
        if (action.includes("ADD_BALANCE")) return "text-emerald-400";
        if (action.includes("SUBTRACT_BALANCE")) return "text-rose-400";
        if (action.includes("BAN")) return "text-rose-400";
        if (action.includes("SUSPEND")) return "text-amber-400";
        if (action.includes("ACTIVATE")) return "text-emerald-400";
        return "text-sky-400";
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
                    <p className="text-sm text-[#8b949e]">
                        All admin actions are logged for accountability and compliance.
                    </p>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-[#161b22]/40 border border-[#30363d]/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-black/40 border-b border-[#30363d]/50">
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Admin</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Action</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Target</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Details</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Time</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]/30">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <Clock className="h-8 w-8 text-[#8b949e] mx-auto mb-2" />
                                        <p className="text-[#8b949e]">No admin actions logged yet</p>
                                        <p className="text-xs text-[#8b949e] mt-1">Actions like balance adjustments and user bans will appear here.</p>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log: any) => {
                                    const Icon = getActionIcon(log.action);
                                    return (
                                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-xs font-bold text-purple-400">
                                                        {log.admin?.username?.charAt(0).toUpperCase() || "A"}
                                                    </div>
                                                    <span className="font-medium text-white">{log.admin?.username || "System"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={cn(
                                                    "text-[10px] font-bold uppercase border flex items-center gap-1.5 w-fit",
                                                    log.action.includes("BAN") || log.action.includes("SUBTRACT")
                                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                        : log.action.includes("SUSPEND")
                                                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                )}>
                                                    <Icon className="h-3 w-3" />
                                                    {log.action.replace(/_/g, " ")}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-[#8b949e] font-mono">
                                                    {log.targetType}: {log.targetId.slice(0, 12)}...
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-[#8b949e]">
                                                    {log.metadata ? JSON.stringify(log.metadata).slice(0, 50) : "-"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-[#8b949e]">
                                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
