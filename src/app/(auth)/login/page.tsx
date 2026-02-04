"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { login, signInWithProvider } from "../actions";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        try {
            const result = await login(formData);
            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            }
        } catch (e) {
            setError("Invalid credentials.");
            setIsLoading(false);
        }
    }

    return (
        <Card className="bg-[#161b22] border-[#30363d] shadow-2xl">
            <CardContent className="pt-6 pb-6">
                <form action={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                            {error}
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
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-[#f5a623] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                className="bg-[#0d1117] border-[#30363d] focus:border-[#f5a623] pr-10"
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
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" className="border-[#30363d] data-[state=checked]:bg-[#f5a623] data-[state=checked]:border-[#f5a623]" />
                        <Label htmlFor="remember" className="text-sm font-normal text-[#c9d1d9] cursor-pointer">
                            Remember me for 30 days
                        </Label>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-[#f5a623] text-black hover:bg-[#e09612] font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#30363d]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#161b22] px-2 text-[#8b949e]">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        className="border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:bg-[#1f2937] hover:text-white"
                        onClick={() => signInWithProvider("google")}
                        type="button"
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </Button>
                    <Button
                        variant="outline"
                        className="border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:bg-[#5865F2] hover:text-white transition-colors"
                        onClick={() => signInWithProvider("discord")}
                        type="button"
                    >
                        <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                        </svg>
                        Discord
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="justify-center border-t border-[#30363d] py-4 bg-[#0d1117]/50 rounded-b-xl">
                <p className="text-sm text-[#8b949e]">
                    Don't have an account?{" "}
                    <Link href="/signup" className="font-medium text-[#f5a623] hover:underline">
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
