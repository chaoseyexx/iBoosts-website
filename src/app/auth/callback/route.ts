import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Check for Discord metadata and ensure profile exists
            const { data: { user } } = await supabase.auth.getUser();

            if (user && user.user_metadata.full_name) {
                // Upsert profile with Discord username
                await supabase.from('profiles').upsert({
                    id: user.id,
                    username: user.user_metadata.full_name,
                    email: user.email,
                    avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'id' });
            }

            return NextResponse.redirect(new URL(next, request.url));
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
}
