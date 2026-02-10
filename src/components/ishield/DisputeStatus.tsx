"use client";

interface DisputeStatusProps {
    status: "PENDING" | "IN_REVIEW" | "RESOLVED" | "ESCALATED";
    aiVerdict?: string | null;
    className?: string;
}

export function DisputeStatus({ status, aiVerdict, className = "" }: DisputeStatusProps) {
    const statusConfig = {
        PENDING: {
            icon: "⏳",
            text: "Waiting for iShield AI review",
            color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
        },
        IN_REVIEW: {
            icon: "🤖",
            text: "iShield AI is reviewing your case",
            color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
            pulse: true,
        },
        RESOLVED: {
            icon: "✅",
            text: "Case resolved by iShield AI",
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        },
        ESCALATED: {
            icon: "👤",
            text: "Escalated to human review",
            color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
        },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
        <div className={`rounded-lg border p-4 ${config.color} ${className}`}>
            <div className="flex items-center gap-2">
                <span className={`text-xl ${"pulse" in config && config.pulse ? "animate-pulse" : ""}`}>
                    {config.icon}
                </span>
                <div>
                    <p className="font-medium">{config.text}</p>
                    {aiVerdict && status === "RESOLVED" && (
                        <p className="text-sm mt-1 opacity-80">
                            AI Verdict: {aiVerdict}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
