"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { forgotPasswordAction } from "../actions";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const result = await forgotPasswordAction(formData);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                setMessage(result.message || "Reset link sent.");
            }
        } catch (e) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="bg-[#161b22] border-[#30363d] shadow-2xl w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Reset Password
                </CardTitle>
                <CardDescription className="text-[#8b949e]">
                    Enter your email to receive a reset link.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="p-3 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-md">
                            {message}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            className="bg-[#0d1117] border-[#30363d] focus:border-[#f5a623]"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-[#f5a623] text-black hover:bg-[#e09612] font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reset Link
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center border-t border-[#30363d] py-4 bg-[#0d1117]/50 rounded-b-xl">
                <p className="text-sm text-[#8b949e]">
                    Remember your password?{" "}
                    <Link href="/login" className="font-medium text-[#f5a623] hover:underline">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
