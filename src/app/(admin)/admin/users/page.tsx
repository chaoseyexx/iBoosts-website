import { fetchUsersWithStats } from "@/app/(admin)/admin/actions";
import { UsersDataTable } from "../components/UsersDataTable";
import { Users } from "lucide-react";

export default async function AdminUsersPage() {
    const { users, totalCount } = await fetchUsersWithStats({ limit: 25, offset: 0 });

    return (
        <div className="space-y-6 max-w-full">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#58a6ff]/10 border border-[#58a6ff]/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#58a6ff]" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-sm text-[#8b949e]">
                        Search, filter, and manage all platform users.
                    </p>
                </div>
            </div>

            {/* Data Table */}
            <UsersDataTable initialUsers={users as any} initialTotal={totalCount} />
        </div>
    );
}
