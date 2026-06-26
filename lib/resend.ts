import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export function confirmationEmail(params: {
  name: string;
  email: string;
  sessionTitle: string;
  sessionDay: string;
  sessionTime: string;
}) {
  return {
    from: process.env.RESEND_FROM!,
    to: params.email,
    subject: `You're on the list — ${params.sessionTitle}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:560px;width:100%;">
        
        <tr><td style="background:#1A2E44;padding:24px 32px;">
          <p style="margin:0;color:#99B8D4;font-size:12px;letter-spacing:2px;text-transform:uppercase;">IFVP Cape Town Summit 2026</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">You're on the list</h1>
        </td></tr>

        <tr><td style="padding:32px;">
          <p style="margin:0 0 16px;color:#1A2E44;font-size:16px;">Hi ${params.name},</p>
          <p style="margin:0 0 24px;color:#4B5563;font-size:15px;line-height:1.6;">
            Thanks for expressing your interest. We've noted you for:
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;border-radius:6px;padding:20px;margin-bottom:24px;">
            <tr><td>
              <p style="margin:0 0 4px;color:#6B7C8D;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Session</p>
              <p style="margin:0 0 16px;color:#1A2E44;font-size:16px;font-weight:700;">${params.sessionTitle}</p>
              <p style="margin:0 0 4px;color:#6B7C8D;font-size:12px;text-transform:uppercase;letter-spacing:1px;">When</p>
              <p style="margin:0;color:#1A2E44;font-size:15px;">${params.sessionDay} · ${params.sessionTime}</p>
            </td></tr>
          </table>

          <p style="margin:0 0 24px;color:#4B5563;font-size:15px;line-height:1.6;">
            We'll be in touch as the summit gets closer. In the meantime, if you haven't registered yet, 
            you can secure your spot at the full summit here:
          </p>

          <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr><td style="background:#2E5E8E;border-radius:6px;padding:12px 24px;">
              <a href="https://book.stripe.com/bJe14pfwa0oK9upf5z5Rm00" 
                 style="color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">
                Register for the Summit →
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 4px;color:#4B5563;font-size:14px;">See you in Cape Town.</p>
          <p style="margin:0;color:#4B5563;font-size:14px;font-weight:700;">The VPA Team</p>
        </td></tr>

        <tr><td style="background:#F4F6F8;padding:16px 32px;border-top:1px solid #E5E7EB;">
          <p style="margin:0;color:#9CA3AF;font-size:12px;">
            <a href="https://www.visualpractitionersafrica.com" style="color:#6B7C8D;text-decoration:none;">visualpractitionersafrica.com</a>
            &nbsp;·&nbsp; Century City Conference Centre, Cape Town &nbsp;·&nbsp; 6–9 October 2026
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}
