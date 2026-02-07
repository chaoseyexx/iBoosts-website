"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Settings,
    User,
    Shield,
    Bell,
    CreditCard,
    Trash2,
    ChevronRight,
    Upload,
    AlertTriangle,
    Loader2
} from "lucide-react";
import { updateProfile, uploadAvatarAction, getProfile } from "./actions";

// ----------------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------------

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            variant="ghost"
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 font-bold tracking-tight"
            disabled={pending}
        >
            {pending ? "SAVING..." : "SAVE"}
        </Button>
    );
}

function EditableRow({
    label,
    name,
    value,
    placeholder,
    helperText,
    multiline = false,
    onUpdate
}: {
    label: string,
    name: string,
    value: string,
    placeholder?: string,
    helperText?: string,
    multiline?: boolean,
    onUpdate?: () => void
}) {
    const [isEditing, setIsEditing] = React.useState(false);

    const actionWithCleanup = async (formData: FormData) => {
        const res = await updateProfile(null, formData);
        if (res?.success) {
            setIsEditing(false);
            if (onUpdate) onUpdate();
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start border-b border-[#2d333b] last:border-0">
            <div className="md:col-span-3 pt-2">
                <span className="text-sm font-bold text-white">{label}</span>
            </div>
            <div className="md:col-span-9">
                {isEditing ? (
                    <form action={actionWithCleanup} className="space-y-2">
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                {multiline ? (
                                    <Textarea
                                        name={name}
                                        defaultValue={value}
                                        placeholder={placeholder}
                                        className="bg-[#0a0e13] border-[#f5a623] text-white focus:border-[#f5a623] ring-1 ring-[#f5a623] min-h-[100px]"
                                        autoFocus
                                    />
                                ) : (
                                    <Input
                                        name={name}
                                        defaultValue={value}
                                        placeholder={placeholder}
                                        className="bg-[#0a0e13] border-[#f5a623] text-white focus:border-[#f5a623] ring-1 ring-[#f5a623]"
                                        autoFocus
                                    />
                                )}
                                {helperText && <p className="text-xs text-[#6b7280] mt-1.5">{helperText}</p>}
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-[#9ca3af] hover:text-white"
                                    onClick={() => setIsEditing(false)}
                                >
                                    CANCEL
                                </Button>
                                <SubmitButton />
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="flex items-center justify-between group">
                        <div className="flex-1 pr-4">
                            <div className="h-10 flex items-center px-3 rounded-md bg-black/40 border border-white/[0.05] text-[#9ca3af]">
                                {value || "Not set"}
                            </div>
                            {helperText && <p className="text-xs text-[#6b7280] mt-1.5">{helperText}</p>}
                        </div>
                        <Button
                            variant="ghost"
                            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 font-bold tracking-tight"
                            onClick={() => setIsEditing(true)}
                        >
                            EDIT
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface AvatarRowProps {
    url?: string | null;
    displayChar: string;
    onUpload: (file: File) => Promise<void>;
}

function AvatarRow({ url, displayChar, onUpload }: AvatarRowProps) {
    const [uploading, setUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }
            const file = event.target.files[0];
            await onUpload(file);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-[#2d333b]">
            <div className="md:col-span-3">
                <span className="text-sm font-bold text-white">Profile Picture:</span>
            </div>
            <div className="md:col-span-9 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-black/40 overflow-hidden border border-white/[0.05] flex items-center justify-center relative">
                        {url ? (
                            <img src={url} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold text-white">{displayChar}</span>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="h-5 w-5 text-[#f5a623] animate-spin" />
                            </div>
                        )}
                    </div>
                    <div className="text-sm text-[#6b7280]">
                        <p>Recommended dimensions: 200x200px</p>
                        <p>Max file size: 2MB</p>
                    </div>
                </div>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    <Button
                        variant="ghost"
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 font-bold tracking-tight"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? "UPLOADING..." : "UPLOAD"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

import { useRouter } from "next/navigation";
// ... (imports)

export default function SettingsPage() {
    const router = useRouter();
    const [activeSection, setActiveSection] = React.useState("profile");
    const [loading, setLoading] = React.useState(true);
    const [profile, setProfile] = React.useState<any>(null);
    const [user, setUser] = React.useState<any>(null);
    // ...

    const refreshProfile = React.useCallback(async () => {
        try {
            const profileData = await getProfile();
            setProfile(profileData || {});
            router.refresh(); // Sync layout/navbar
        } catch (error) {
            console.error("Error refreshing profile:", error);
        }
    }, [router]);

    React.useEffect(() => {
        const supabase = createClient();
        const loadData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUser(user);
                    // Fetch profile from Prisma via Server Action
                    await refreshProfile();
                }
            } catch (error) {
                console.error("Error loading settings:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [refreshProfile]);

    const handleAvatarUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const result = await uploadAvatarAction(formData);

            if (result.error) {
                alert(result.error);
                return;
            }
            await refreshProfile();
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert("Error uploading avatar");
        }
    };

    const isOAuth = user?.app_metadata?.provider && user.app_metadata.provider !== "email";

    const staticSections = {
        security: {
            id: "security",
            title: "Security",
            icon: Shield,
            items: [
                {
                    label: "Email",
                    value: user?.email || "demo@iboosts.gg",
                    action: isOAuth ? "Managed by Provider" : "Change",
                    verified: true,
                    disabled: true // Email changing always disabled for now as per user request to block if oauth, but generally good to lock for simplicity first
                },
                {
                    label: "Password",
                    value: "••••••••",
                    action: isOAuth ? "Not applicable" : "Change",
                    disabled: isOAuth
                },
                { label: "Two-Factor Authentication", value: "Not enabled", action: "Enable", warning: true },
                { label: "Active Sessions", value: "2 devices", action: "Manage" },
            ],
        },
        notifications: {
            id: "notifications",
            title: "Notification Preferences",
            icon: Bell,
            items: [
                { label: "Email Notifications", value: "Enabled", toggle: true, enabled: true },
                { label: "Order Updates", value: "Enabled", toggle: true, enabled: true },
                { label: "Marketing Emails", value: "Disabled", toggle: true, enabled: false },
                { label: "Security Alerts", value: "Enabled", toggle: true, enabled: true },
            ],
        },
        payments: {
            id: "payments",
            title: "Payment Methods",
            icon: CreditCard,
            items: [
                { label: "Withdrawal Method", value: "PayPal - demo@iboosts.gg", action: "Change" },
                { label: "Payout Currency", value: "USD", action: "Change" },
            ],
        },
    };

    if (loading) {
        return <div className="p-12 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-[#f5a623]" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/40 border border-white/[0.05]">
                    <Settings className="h-5 w-5 text-[#f5a623]" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Account Settings</h1>
                    <p className="text-sm text-[#6b7280]">Manage your account preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Navigation */}
                <Card className="col-span-1 border-white/[0.05] bg-[#0d1117] h-fit">
                    <CardContent className="p-2">
                        <button onClick={() => setActiveSection("profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === "profile" ? "bg-[#f5a623]/15 text-[#f5a623]" : "text-[#9ca3af] hover:text-white hover:bg-white/[0.02]"}`}>
                            <User className="h-5 w-5" />
                            <span className="text-sm font-medium">Profile Settings</span>
                        </button>
                        <button onClick={() => setActiveSection("security")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === "security" ? "bg-[#f5a623]/15 text-[#f5a623]" : "text-[#9ca3af] hover:text-white hover:bg-[#252b33]"}`}>
                            <Shield className="h-5 w-5" />
                            <span className="text-sm font-medium">Security</span>
                        </button>
                        <button onClick={() => setActiveSection("notifications")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === "notifications" ? "bg-[#f5a623]/15 text-[#f5a623]" : "text-[#9ca3af] hover:text-white hover:bg-[#252b33]"}`}>
                            <Bell className="h-5 w-5" />
                            <span className="text-sm font-medium">Notifications</span>
                        </button>
                        <button onClick={() => setActiveSection("payments")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === "payments" ? "bg-[#f5a623]/15 text-[#f5a623]" : "text-[#9ca3af] hover:text-white hover:bg-[#252b33]"}`}>
                            <CreditCard className="h-5 w-5" />
                            <span className="text-sm font-medium">Payment Methods</span>
                        </button>
                        <hr className="my-2 border-white/[0.05]" />
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors">
                            <Trash2 className="h-5 w-5" />
                            <span className="text-sm font-medium">Delete Account</span>
                        </button>
                    </CardContent>
                </Card>

                {/* Content */}
                <div className="col-span-1 md:col-span-3 space-y-4">
                    {activeSection === "profile" && (
                        <Card className="border-white/[0.05] bg-[#0d1117]">
                            <CardHeader className="border-b border-[#2d333b] py-4">
                                <CardTitle className="text-lg text-white">Public Profile</CardTitle>
                                <CardDescription className="text-[#9ca3af]">Control how you appear to other users.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <AvatarRow
                                    url={profile?.avatar || user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
                                    displayChar={(profile?.username || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User").charAt(0).toUpperCase()}
                                    onUpload={handleAvatarUpload}
                                />
                                <EditableRow
                                    label="Username:" name="username" value={profile?.username || user?.user_metadata?.full_name || user?.email?.split("@")[0] || ""}
                                    placeholder="Enter your username" helperText="Name that is visible to other Eldorado users. You can change your username once every 90 days."
                                    onUpdate={refreshProfile}
                                />
                                <EditableRow
                                    label="Bio:" name="bio" value={profile?.bio || ""}
                                    placeholder="Tell the community about yourself" helperText="A brief description for your profile (max 160 characters)." multiline
                                    onUpdate={refreshProfile}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Restored Static Sections */}
                    {activeSection !== "profile" && staticSections[activeSection as keyof typeof staticSections] && (
                        <Card className="border-white/[0.05] bg-[#0d1117]">
                            <CardHeader className="border-b border-[#2d333b] py-4">
                                <CardTitle className="text-lg text-white">{staticSections[activeSection as keyof typeof staticSections].title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {staticSections[activeSection as keyof typeof staticSections].items.map((item, index) => (
                                    <div key={index} className={`flex items-center justify-between p-4 ${index !== staticSections[activeSection as keyof typeof staticSections].items.length - 1 ? "border-b border-[#2d333b]" : ""}`}>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-white tracking-tight">{item.label}</span>
                                                {(item as any).verified && <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.1)]">Verified</Badge>}
                                                {(item as any).warning && <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest">Recommended</Badge>}
                                            </div>
                                            <p className="text-sm text-[#6b7280] mt-0.5">{item.value === "demo@iboosts.gg" && user?.email ? user.email : item.value}</p>
                                        </div>
                                        {(item as any).toggle ? (
                                            <button className={`relative h-6 w-11 rounded-full transition-colors ${(item as any).enabled ? "bg-[#f5a623]" : "bg-[#252b33]"}`}>
                                                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${(item as any).enabled ? "left-6" : "left-1"}`} />
                                            </button>
                                        ) : (
                                            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 font-bold tracking-tight">
                                                {(item as any).action}
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
