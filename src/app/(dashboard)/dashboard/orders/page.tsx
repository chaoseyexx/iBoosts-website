import * as React from "react";
import { getOrders } from "./orders-actions";
import OrdersView from "./orders-view";

interface OrdersPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function OrdersPage(props: OrdersPageProps) {
    const searchParams = await props.searchParams;
    const type = (searchParams.type as 'purchased' | 'sold') || "purchased";

    // Fetch initial orders on server
    const result = await getOrders(type);
    const initialOrders = result.orders || [];

    return (
        <OrdersView initialOrders={initialOrders} initialType={type} />
    );
}
