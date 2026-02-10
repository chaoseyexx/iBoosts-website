import { fetchUsersWithStats } from "@/app/(admin)/admin/actions";
import { UsersDataTable } from "../components/UsersDataTable";
import { Users } from "lucide-react";

export default async function AdminUsersPage() {
    const { users, totalCount } = await fetchUsersWithStats({ limit: 50, offset: 0 });

    // Serialize Decimal objects for client component
    const serializedUsers = users.map((user: any) => ({
        ...user,
        wallet: user.wallet ? {
            balance: Number(user.wallet.balance),
            pendingBalance: Number(user.wallet.pendingBalance)
        } : null
    }));

    return (
        <div className="space-y-10 animate-in fade-in duration-700 relative z-10">
            {/* HUD Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#f5a623] shadow-[0_0_8px_rgba(245,166,35,0.6)]" />
                        <span className="text-[10px] font-black text-[#f5a623] uppercase tracking-[0.3em]">Entity Intelligence</span>
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">User <span className="text-[#f5a623]">Database</span></h1>
                    <p className="text-white/20 text-xs font-black uppercase tracking-[0.1em] mt-1">Management and synchronization of platform entities and wallets</p>
                </div>
                <div className="flex items-center gap-4 px-5 py-2.5 bg-[#f5a623]/5 border border-[#f5a623]/20 rounded-2xl backdrop-blur-sm">
                    <div className="h-10 w-10 rounded-xl bg-[#f5a623]/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-[#f5a623]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-tight">Total Entities</span>
                        <span className="text-[11px] font-black text-[#f5a623] uppercase tracking-widest leading-none mt-1">{totalCount}</span>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <UsersDataTable initialUsers={serializedUsers} initialTotal={totalCount} />
        </div>
    );
}
