"use client";

interface ChatSafetyAlertProps {
    level: "LOW" | "MEDIUM" | "HIGH";
    message?: string;
    onDismiss?: () => void;
}

export function ChatSafetyAlert({ level, message, onDismiss }: ChatSafetyAlertProps) {
    const levelConfig = {
        LOW: {
            icon: "💡",
            title: "Reminder from iShield AI",
            color: "bg-blue-500/10 border-blue-500/30 text-blue-400",
            defaultMessage: "Stay safe! Never share personal information or payment details outside the platform.",
        },
        MEDIUM: {
            icon: "⚠️",
            title: "iShield AI Notice",
            color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
            defaultMessage: "We detected potentially risky content in this conversation. Please proceed with caution.",
        },
        HIGH: {
            icon: "🚨",
            title: "iShield AI Warning",
            color: "bg-red-500/10 border-red-500/30 text-red-400",
            defaultMessage: "This conversation has been flagged for suspicious activity. Do not proceed with any transactions outside the platform.",
        },
    };

    const config = levelConfig[level];

    return (
        <div className={`rounded-lg border p-3 ${config.color} flex items-start gap-3`}>
            <span className="text-xl flex-shrink-0">{config.icon}</span>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{config.title}</p>
                <p className="text-xs opacity-80 mt-0.5">
                    {message || config.defaultMessage}
                </p>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="text-current opacity-50 hover:opacity-100 transition-opacity text-lg leading-none"
                >
                    ×
                </button>
            )}
        </div>
    );
}
