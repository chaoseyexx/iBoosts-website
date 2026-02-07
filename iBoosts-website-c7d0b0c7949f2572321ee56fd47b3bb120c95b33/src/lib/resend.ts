import { Resend } from 'resend';

// Initialize Resend with API Key from environment variables
// Make sure RESEND_API_KEY is set in your .env file
export const resend = new Resend(process.env.RESEND_API_KEY);

// Domain to send emails from (must be verified in Resend dashboard)
const EMAIL_FROM = 'iBoosts <noreply@iboosts.gg>'; // Replace with your verified domain

export async function sendWelcomeEmail(email: string, username: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is missing. Skipping welcome email.');
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: EMAIL_FROM,
            to: email,
            subject: 'Welcome to iBoosts! 🚀',
            html: `
        <div style="font-family: sans-serif; background-color: #0d1117; color: #c9d1d9; padding: 40px;">
          <div style="max-w-md mx-auto bg-white border border-[#30363d] rounded-lg overflow-hidden shadow-lg">
             <div style="background-color: #161b22; padding: 24px; text-center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to <span style="color: #f5a623;">iBoosts</span></h1>
             </div>
             <div style="background-color: #0d1117; padding: 32px; color: #c9d1d9;">
                <p style="font-size: 16px;">Hi <strong>${username}</strong>,</p>
                <p style="font-size: 16px; line-height: 1.5;">Welcome to the premier marketplace for digital assets and boosting services. We're excited to have you on board!</p>
                <p style="font-size: 16px; line-height: 1.5;">Here's what you can do next:</p>
                <ul style="font-size: 16px; line-height: 1.5; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">Explore high-tier game accounts</li>
                  <li style="margin-bottom: 10px;">Book professional boosting services</li>
                  <li style="margin-bottom: 10px;">Join our secure trading community</li>
                </ul>
                <div style="text-align: center; margin-top: 32px;">
                  <a href="https://iboosts.gg/dashboard" style="background-color: #f5a623; color: #000000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">Go to Dashboard</a>
                </div>
             </div>
             <div style="background-color: #161b22; padding: 16px; text-center; font-size: 12px; color: #8b949e;">
                &copy; ${new Date().getFullYear()} iBoosts Inc. All rights reserved.
             </div>
          </div>
        </div>
      `,
        });

        if (error) {
            console.error('Error sending welcome email via Resend:', error);
            return { error };
        }

        return { data };
    } catch (e) {
        console.error('Unexpected error sending welcome email:', e);
        return { error: e };
    }
}
