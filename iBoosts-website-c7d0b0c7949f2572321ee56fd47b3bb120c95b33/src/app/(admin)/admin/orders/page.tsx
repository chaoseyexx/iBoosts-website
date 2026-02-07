import { fetchOrdersWithDetails } from "@/app/(admin)/admin/actions";
import { OrdersDataTable } from "../components/OrdersDataTable";
import { ShoppingCart } from "lucide-react";

export default async function AdminOrdersPage() {
    const { orders, totalCount } = await fetchOrdersWithDetails({ limit: 25, offset: 0 });

    return (
        <div className="space-y-6 max-w-full">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Order Management</h1>
                    <p className="text-sm text-[#8b949e]">
                        View, search, and manage all marketplace orders.
                    </p>
                </div>
            </div>

            {/* Data Table */}
            <OrdersDataTable initialOrders={orders as any} initialTotal={totalCount} />
        </div>
    );
}
