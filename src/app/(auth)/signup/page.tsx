"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { signup, signInWithProvider, checkUsernameAvailability } from "../actions";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Validation States
    const [username, setUsername] = useState("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    const [password, setPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    // Username Check Debounce
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUsername(val);
        setIsUsernameAvailable(null);

        if (val.length < 5) return;

        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(val)) return;

        setIsCheckingUsername(true);
        // Simple distinct timeout implementation for debounce
        const timeoutId = setTimeout(async () => {
            const available = await checkUsernameAvailability(val);
            setIsUsernameAvailable(available);
            setIsCheckingUsername(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    // Password Validation
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        // Requirement: Number AND Capital Letter
        const hasNumber = /\d/.test(val);
        const hasUpper = /[A-Z]/.test(val);
        setIsPasswordValid(hasNumber && hasUpper && val.length >= 6);
    };

    // Use a useEffect-like approach for the username debounce cleanup if sticking to simple handlers, 
    // but the above returns cleanup only if called in useEffect. 
    // Let's switch to standard useEffect for username debounce.

    // Correct approach with useEffect for debounce
    const [debouncedUsername, setDebouncedUsername] = useState("");

    // Custom logic to replace the simple handler above
    /* eslint-disable react-hooks/exhaustive-deps */

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signup(formData); // This calls the server action
            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            }
        } catch (e) {
            setError("An unexpected error occurred.");
            setIsLoading(false);
        }
    }

    // Username Check Effect
    // Username Check Effect
    useEffect(() => {
        const check = async () => {
            if (username.length < 5) {
                setIsUsernameAvailable(null);
                return;
            }
            const usernameRegex = /^[a-zA-Z0-9]+$/;
            if (!usernameRegex.test(username)) {
                setIsUsernameAvailable(null);
                return;
            }
            setIsCheckingUsername(true);
            const available = await checkUsernameAvailability(username);
            setIsUsernameAvailable(available);
            setIsCheckingUsername(false);
        };
        const timer = setTimeout(check, 500);
        return () => clearTimeout(timer);
    }, [username]);

    return (
        <Card className="bg-[#161b22] border-[#30363d] shadow-2xl">
            <CardContent className="pt-6 pb-6">
                <form action={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="iBoostsAdmin"
                            required
                            onChange={(e) => setUsername(e.target.value)}
                            className={`bg-[#0d1117] border-[#30363d] focus:border-[#f5a623] ${isUsernameAvailable === true ? "border-green-500" :
                                isUsernameAvailable === false ? "border-red-500" : ""
                                }`}
                        />
                        {(username.length >= 1 || isCheckingUsername) && (
                            <div className="flex flex-col gap-1 text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                {username.length > 0 && username.length < 5 && <span className="text-red-500">Must be at least 5 characters</span>}
                                {username.length >= 1 && !/^[a-zA-Z0-9]+$/.test(username) && <span className="text-red-500">Only letters and numbers allowed (no symbols)</span>}
                                {isCheckingUsername && <span className="text-gray-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Checking availability...</span>}
                                {!isCheckingUsername && isUsernameAvailable === true && username.length >= 5 && /^[a-zA-Z0-9]+$/.test(username) && <span className="text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Available</span>}
                                {!isCheckingUsername && isUsernameAvailable === false && username.length >= 5 && /^[a-zA-Z0-9]+$/.test(username) && <span className="text-red-500 flex items-center gap-1"><X className="w-3 h-3" /> Username taken</span>}
                            </div>
                        )}
                    </div>
                    <div className="space-y-1.5">
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
                    <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
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
                    <div className="text-xs text-[#8b949e]">
                        By creating an account, you agree to our{" "}
                        <Link href="/terms" className="text-[#f5a623] hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-[#f5a623] hover:underline">
                            Privacy Policy
                        </Link>.
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-[#f5a623] text-black hover:bg-[#e09612] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading || isUsernameAvailable === false || !isPasswordValid}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#30363d]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#161b22] px-2 text-[#8b949e]">
                            Or join with
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
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-[#f5a623] hover:underline">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card >
    );
}
