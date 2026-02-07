"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updatePasswordAction } from "../actions";

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Validation
    const [password, setPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        const hasNumber = /\d/.test(val);
        const hasUpper = /[A-Z]/.test(val);
        setIsPasswordValid(hasNumber && hasUpper && val.length >= 6);
    };

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        try {
            const result = await updatePasswordAction(formData);
            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            }
        } catch (e) {
            setError("An unexpected error occurred.");
            setIsLoading(false);
        }
    }

    return (
        <Card className="bg-[#161b22] border-[#30363d] shadow-2xl w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Set New Password
                </CardTitle>
                <CardDescription className="text-[#8b949e]">
                    Enter your new password below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Min 6 chars, 1 number, 1 capital"
                                required
                                onChange={handlePasswordChange}
                                className={`bg-[#0d1117] border-[#30363d] focus:border-[#f5a623] pr-10 ${password && !isPasswordValid ? "border-red-500" :
                                    password && isPasswordValid ? "border-green-500" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {password && (
                            <div className="text-xs space-y-1 mt-1">
                                <p className={`flex items-center gap-1 ${/\d/.test(password) ? "text-green-500" : "text-gray-500"}`}>
                                    {/\d/.test(password) ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 inline-block" />} Must contain a number
                                </p>
                                <p className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? "text-green-500" : "text-gray-500"}`}>
                                    {/[A-Z]/.test(password) ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 inline-block" />} Must contain a capital letter
                                </p>
                            </div>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-[#f5a623] text-black hover:bg-[#e09612] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading || !isPasswordValid}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
