/**
 * Marketplace Fee Configuration
 */

export const FEES = {
    // Buyer pays this on top of the funds they want to add
    BUYER_SERVICE_PERCENT: 0.03, // 3%
    BUYER_SERVICE_FLAT: 0.50,    // $0.50

    // Deducted from the sale price when a seller makes a sale
    SELLER_COMMISSION_PERCENT: 0.10, // 10%

    // Deducted from the withdrawal amount (Default: Stripe Bank)
    WITHDRAWAL_PERCENT: 0.04,   // 4%
    WITHDRAWAL_FLAT: 2.00,      // $2.00

    // Crypto Fees (Standardized)
    WITHDRAW_USDT_PERCENT: 0.04,
    WITHDRAW_USDT_FLAT: 10.00,
    WITHDRAW_LTC_PERCENT: 0.04,
    WITHDRAW_LTC_FLAT: 10.00,
};

/**
 * Calculates the total amount a buyer must pay for an order of a specific amount.
 */
export function calculateOrderTotal(targetAmount: number, isShield: boolean = false, customFees?: Partial<typeof FEES>) {
    const activeFees = { ...FEES, ...customFees };
    const discount = isShield ? targetAmount * 0.05 : 0;
    const amountAfterDiscount = targetAmount - discount;

    const serviceFee = (amountAfterDiscount * activeFees.BUYER_SERVICE_PERCENT) + activeFees.BUYER_SERVICE_FLAT;
    const total = amountAfterDiscount + serviceFee;

    return {
        targetAmount,
        discount: Math.round(discount * 100) / 100,
        amountAfterDiscount: Math.round(amountAfterDiscount * 100) / 100,
        serviceFee: Math.round(serviceFee * 100) / 100,
        total: Math.round(total * 100) / 100
    };
}

/**
 * Calculates the breakdown of a marketplace sale.
 */
export function calculateSale(salePrice: number, customFees?: Partial<typeof FEES>) {
    const activeFees = { ...FEES, ...customFees };
    const commission = salePrice * activeFees.SELLER_COMMISSION_PERCENT;
    const sellerEarnings = salePrice - commission;

    return {
        salePrice,
        commission: Math.round(commission * 100) / 100,
        sellerEarnings: Math.round(sellerEarnings * 100) / 100
    };
}

/**
 * Calculates the breakdown for a withdrawal.
 */
export function calculateWithdrawal(withdrawalAmount: number, method: string = "STRIPE", customFees?: Partial<typeof FEES>) {
    const activeFees = { ...FEES, ...customFees };
    let percent = activeFees.WITHDRAWAL_PERCENT;
    let flat = activeFees.WITHDRAWAL_FLAT;

    if (method === "CRYPTO_USDT") {
        percent = activeFees.WITHDRAW_USDT_PERCENT;
        flat = activeFees.WITHDRAW_USDT_FLAT;
    } else if (method === "CRYPTO_LTC") {
        percent = activeFees.WITHDRAW_LTC_PERCENT;
        flat = activeFees.WITHDRAW_LTC_FLAT;
    }

    const fee = (withdrawalAmount * percent) + flat;
    const netAmount = Math.max(0, withdrawalAmount - fee);

    return {
        withdrawalAmount,
        fee: Math.round(fee * 100) / 100,
        netAmount: Math.round(netAmount * 100) / 100
    };
}
