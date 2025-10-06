/**
 * Email notification system using Nodemailer
 * Sends confirmation emails to prospects and alert emails to Stella
 */

import nodemailer from 'nodemailer';
import type { PriceEstimate } from '@/lib/pricing/calc';

interface Lead {
  id: string;
  inputs: {
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    age_band?: string;
    concern?: string;
    coverage_area?: string;
    norwood?: string;
    finish?: string;
    timing?: string;
    scar_addon?: boolean;
    womens_density_addon?: boolean;
  };
  estimate: PriceEstimate;
  timestamp: string;
}

/**
 * Create Nodemailer transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

/**
 * Send confirmation email to prospect with their estimate
 */
export async function sendConfirmationEmail({
  to,
  name,
  estimate,
  leadId,
  bookingUrl
}: {
  to: string;
  name: string;
  estimate: PriceEstimate;
  leadId: string;
  bookingUrl: string;
}) {
  const transporter = createTransporter();
  
  const subject = `Your SMP Estimate: ${estimate.currency} ${estimate.low.toLocaleString()}-${estimate.high.toLocaleString()}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SMP Estimate</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(41, 57, 25, 0.15);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #293919; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-family: Georgia, serif;">Stella's Ink Chamber</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 16px;">Your Personalized SMP Estimate</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #293919; font-size: 24px;">Hi ${name},</h2>
              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for using our instant price calculator! Based on your answers, here's your personalized SMP estimate.
              </p>
            </td>
          </tr>

          <!-- Estimate Card -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 30px;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Your Estimate</p>
                    <p style="margin: 0 0 15px 0; color: #293919; font-size: 36px; font-weight: bold; font-family: Georgia, serif;">
                      ${estimate.currency} ${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}
                    </p>
                    <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px;">
                      Typical: ${estimate.currency} ${estimate.mid.toLocaleString()}
                    </p>
                    <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.5;">
                      ${estimate.sessions.description}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gift Card Offer -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #293919 0%, #3d5226 100%); border-radius: 8px; padding: 25px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 20px; font-weight: bold;">✨ $100 Gift Card Offer</p>
                    <p style="margin: 0; color: #ffffff; opacity: 0.95; font-size: 15px; line-height: 1.5;">
                      Book your free consultation this month and receive a <strong>$100 gift card</strong> toward your first SMP session.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 0 30px 30px 30px;">
              <a href="${bookingUrl}?ref=estimate&lead=${leadId}" style="display: inline-block; background-color: #293919; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-size: 18px; font-weight: 600;">
                Book Free Consultation
              </a>
              <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">
                Free 30-minute consultation • No obligation • Expert guidance
              </p>
            </td>
          </tr>

          <!-- Disclaimer -->
          <tr>
            <td style="padding: 0 30px 30px 30px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                <strong>Important:</strong> ${estimate.disclaimer}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Stella's Ink Chamber<br>
                Scalp Micropigmentation Specialist
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Have questions? Reply to this email or call us at (555) 123-4567<br>
                <a href="https://stellasinkchamber.com/unsubscribe?email=${encodeURIComponent(to)}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Hi ${name},

Your Personalized SMP Estimate from Stella's Ink Chamber

${estimate.currency} ${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}
Typical: ${estimate.currency} ${estimate.mid.toLocaleString()}
${estimate.sessions.description}

✨ $100 GIFT CARD OFFER
Book your free consultation this month and receive a $100 gift card toward your first SMP session.

Book your free consultation: ${bookingUrl}?ref=estimate&lead=${leadId}

${estimate.disclaimer}

Questions? Reply to this email or call (555) 123-4567

Stella's Ink Chamber
Scalp Micropigmentation Specialist
Unsubscribe: https://stellasinkchamber.com/unsubscribe?email=${encodeURIComponent(to)}
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_SENDER || "Stella's Ink Chamber <hello@stellasinkchamber.com>",
    to,
    subject,
    text,
    html
  });
}

/**
 * Send alert email to Stella with lead details
 */
export async function sendAlertEmail({
  to,
  lead,
  estimate
}: {
  to: string;
  lead: Lead;
  estimate: PriceEstimate;
}) {
  const transporter = createTransporter();
  
  const subject = `🔔 New SMP Lead: ${lead.inputs.name} (${estimate.currency} ${estimate.mid.toLocaleString()})`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Lead Alert</title>
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <h2 style="margin: 0 0 20px 0; color: #293919;">🎯 New Calculator Lead</h2>
    
    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
      <tr>
        <td colspan="2" style="background-color: #f9fafb; padding: 15px; border-radius: 6px;">
          <strong style="color: #293919; font-size: 18px;">${lead.inputs.name}</strong><br>
          <span style="color: #6b7280; font-size: 14px;">Lead ID: ${lead.id}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 150px;">Email:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;"><a href="mailto:${lead.inputs.email}">${lead.inputs.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Phone:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;"><a href="tel:${lead.inputs.phone}">${lead.inputs.phone}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Estimate:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: bold;">${estimate.currency} ${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Sessions:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${estimate.sessions.count} sessions</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Gender/Age:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${lead.inputs.gender} / ${lead.inputs.age_band}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Concern:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${lead.inputs.concern}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Coverage:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${lead.inputs.coverage_area}${lead.inputs.norwood ? ' (Norwood ' + lead.inputs.norwood + ')' : ''}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Finish:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${lead.inputs.finish}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Timing:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: ${lead.inputs.timing === 'asap' ? 'bold' : 'normal'}; color: ${lead.inputs.timing === 'asap' ? '#10b981' : '#111827'};">${lead.inputs.timing}${lead.inputs.timing === 'asap' ? ' 🔥' : ''}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #6b7280;">Add-ons:</td>
        <td style="padding: 10px 0; color: #111827;">${[lead.inputs.scar_addon && 'Scar camouflage', lead.inputs.womens_density_addon && "Women's density"].filter(Boolean).join(', ') || 'None'}</td>
      </tr>
    </table>

    <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>⏰ Follow-up Action Required</strong><br>
        Respond within 1 hour for best conversion rates.
      </p>
    </div>

    <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 13px;">
      Submitted: ${new Date(lead.timestamp).toLocaleString()}
    </p>
  </div>
</body>
</html>
  `;

  const text = `
🎯 NEW CALCULATOR LEAD

${lead.inputs.name}
Lead ID: ${lead.id}

Contact:
Email: ${lead.inputs.email}
Phone: ${lead.inputs.phone}

Estimate: ${estimate.currency} ${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}
Sessions: ${estimate.sessions.count}

Details:
- Gender/Age: ${lead.inputs.gender} / ${lead.inputs.age_band}
- Concern: ${lead.inputs.concern}
- Coverage: ${lead.inputs.coverage_area}${lead.inputs.norwood ? ' (Norwood ' + lead.inputs.norwood + ')' : ''}
- Finish: ${lead.inputs.finish}
- Timing: ${lead.inputs.timing}
- Add-ons: ${[lead.inputs.scar_addon && 'Scar camouflage', lead.inputs.womens_density_addon && "Women's density"].filter(Boolean).join(', ') || 'None'}

⏰ Follow-up within 1 hour for best conversion!

Submitted: ${new Date(lead.timestamp).toLocaleString()}
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_SENDER || "Stella's Ink Chamber <hello@stellasinkchamber.com>",
    to,
    subject,
    text,
    html
  });
}
