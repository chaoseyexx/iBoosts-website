import { customAlphabet } from 'nanoid';

// Standard alphabet for readable IDs (uppercase letters and numbers)
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 8);

/**
 * Prefix mapping for database models
 */
export const MODEL_PREFIXES = {
    User: 'U',
    Session: 'SES',
    Device: 'DEV',
    KycDocument: 'KYC',
    Category: 'CAT',
    Game: 'GAME',
    BoostingRequest: 'BST',
    Listing: 'LST',
    ListingItem: 'LITM',
    ListingImage: 'IMG',
    Order: 'ORDER',
    OrderMessage: 'MSG',
    OrderTimeline: 'TML',
    Offer: 'OFF',
    Dispute: 'DSP',
    DisputeMessage: 'DMS',
    DisputeEvidence: 'EVD',
    Review: 'REV',
    Coupon: 'CPN',
    CouponUsage: 'CUS',
    Wallet: 'WLT',
    WalletTransaction: 'TRX',
    Withdrawal: 'WTH',
    UserBadge: 'BDG',
    Report: 'RPT',
    Notification: 'NTF',
    AdminLog: 'ALOG',
    Config: 'CFG',
    Terms: 'TRM',
    ScheduledJob: 'JOB',
} as const;

export type ModelName = keyof typeof MODEL_PREFIXES;

/**
 * Generates an elegant, prefixed ID for a given model.
 * Example: generateId('User') -> 'U-12345678'
 * Example: generateId('Order') -> 'ORDER-12345678'
 */
export function generateId(model: ModelName): string {
    const prefix = MODEL_PREFIXES[model];
    if (!prefix) {
        throw new Error(`No prefix defined for model: ${model}`);
    }
    return `${prefix}-${nanoid()}`;
}

/**
 * Validates if a string follows the elegant ID format.
 */
export function isValidElegantId(id: string, model?: ModelName): boolean {
    if (typeof id !== 'string') return false;

    if (model) {
        const prefix = MODEL_PREFIXES[model];
        return id.startsWith(`${prefix}-`) && id.length === prefix.length + 1 + 8;
    }

    // Generic check: prefix- + 8 chars
    const parts = id.split('-');
    // Assuming prefix is at least 1 char
    return parts.length === 2 && parts[1].length === 8 && parts[0].length > 0;
}
