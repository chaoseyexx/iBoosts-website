/**
 * iShield: Enterprise-Grade Fraud & Scam Shield
 * Official TypeScript Client for Ecosystem Integration
 */

export interface ShieldChatParams {
    userId: string;
    text: string;
    context?: Record<string, any>;
}

export interface ShieldBehaviorParams {
    userId: string;
    ipAddress: string;
    amount: number;
    userAgeDays: number;
    history: Record<string, any>;
}

export interface ShieldResponse {
    is_flagged: boolean;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    engines: any;
    timestamp: number;
}

export class iShieldClient {
    private baseUrl: string;

    constructor(baseUrl: string = process.env.ISHIELD_URL || 'http://localhost:8000') {
        this.baseUrl = baseUrl;
    }

    /**
     * Analyzes a chat message for scams, phishing, and toxic behavior.
     */
    async analyzeChat(params: ShieldChatParams): Promise<ShieldResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/analyze/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            return await response.json();
        } catch (error) {
            console.error('[iShield] Chat analysis failed:', error);
            throw error;
        }
    }

    /**
     * Analyzes user behavior for transaction fraud and anomalies.
     */
    async analyzeBehavior(params: ShieldBehaviorParams): Promise<ShieldResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/analyze/behavior`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            return await response.json();
        } catch (error) {
            console.error('[iShield] Behavior analysis failed:', error);
            throw error;
        }
    }

    /**
     * Sends a query to the iShield Sentinel Brain (Founder Mode).
     */
    async talkToSentinel(query: string): Promise<string> {
        try {
            const response = await fetch(`${this.baseUrl}/founder/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('[iShield] Sentinel communication failed:', error);
            throw error;
        }
    }

    /**
     * Fetches live telemetry and system health from the iShield Sentinel.
     */
    async getSystemStatus(): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/system/status`);
            return await response.json();
        } catch (error) {
            console.error('[iShield] Status fetch failed:', error);
            return { status: 'OFFLINE', is_ready: false };
        }
    }
}

// Singleton instance for the project
export const iShield = new iShieldClient();
