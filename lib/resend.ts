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
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Roboto',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:560px;width:100%;">
        
        <tr><td style="background:#1A1A1A;padding:24px 32px;">
          <p style="margin:0;color:#E07B39;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:'Roboto',Arial,sans-serif;font-weight:500;">IFVP Cape Town Summit 2026</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;font-family:'Roboto',Arial,sans-serif;">You're on the list</h1>
        </td></tr>

        <tr><td style="padding:32px;">
          <p style="margin:0 0 16px;color:#1A1A1A;font-size:16px;font-family:'Roboto',Arial,sans-serif;">Hi ${params.name},</p>
          <p style="margin:0 0 24px;color:#4B5563;font-size:15px;line-height:1.6;font-family:'Roboto',Arial,sans-serif;">
            Thanks for expressing your interest. We've noted you for:
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF0E7;border-radius:6px;border-left:4px solid #E07B39;padding:20px;margin-bottom:24px;">
            <tr><td>
              <p style="margin:0 0 4px;color:#E07B39;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-family:'Roboto',Arial,sans-serif;font-weight:500;">Session</p>
              <p style="margin:0 0 16px;color:#1A1A1A;font-size:16px;font-weight:700;font-family:'Roboto',Arial,sans-serif;">${params.sessionTitle}</p>
              <p style="margin:0 0 4px;color:#E07B39;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-family:'Roboto',Arial,sans-serif;font-weight:500;">When</p>
              <p style="margin:0;color:#1A1A1A;font-size:15px;font-family:'Roboto',Arial,sans-serif;">${params.sessionDay} · ${params.sessionTime}</p>
            </td></tr>
          </table>

          <p style="margin:0 0 24px;color:#4B5563;font-size:15px;line-height:1.6;font-family:'Roboto',Arial,sans-serif;">
            We'll be in touch as the summit gets closer. In the meantime, if you haven't registered yet, 
            you can secure your spot at the full summit here:
          </p>

          <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr><td style="background:#E07B39;border-radius:6px;padding:12px 24px;">
              <a href="https://book.stripe.com/bJe14pfwa0oK9upf5z5Rm00" 
                 style="color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;font-family:'Roboto',Arial,sans-serif;">
                Register for the Summit →
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 4px;color:#4B5563;font-size:14px;font-family:'Roboto',Arial,sans-serif;">See you in Cape Town.</p>
          <p style="margin:0;color:#1A1A1A;font-size:14px;font-weight:700;font-family:'Roboto',Arial,sans-serif;">The VPA Team</p>
        </td></tr>

        <tr><td style="background:#1A1A1A;padding:16px 32px;">
          <p style="margin:0;color:#888888;font-size:12px;font-family:'Roboto',Arial,sans-serif;">
            <a href="https://www.visualpractitionersafrica.com" style="color:#E07B39;text-decoration:none;">visualpractitionersafrica.com</a>
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
