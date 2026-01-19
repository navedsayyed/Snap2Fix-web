/**
 * Email Service using Resend
 * Handles sending confirmation emails to users
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendConfirmationEmailParams {
    email: string;
    complaintId: string;
    userName: string;
    complaintDetails: {
        title: string;
        floor: string;
        room_number: string;
        priority: string;
        description: string;
    };
}

/**
 * Send confirmation email to user after complaint submission
 */
export async function sendConfirmationEmail({
    email,
    complaintId,
    userName,
    complaintDetails,
}: SendConfirmationEmailParams): Promise<{ success: boolean; error?: string }> {
    try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'College Complaint System';
        const trackingUrl = `${siteUrl}/track/${complaintId}`;
        const shortId = complaintId.substring(0, 8).toUpperCase();

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complaint Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #4CAF50; padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                ✅ Complaint Received
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #333333; line-height: 1.6;">
                Dear <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; color: #333333; line-height: 1.6;">
                Your complaint has been successfully submitted and is now pending review by our maintenance team.
              </p>
              
              <!-- Complaint ID Box -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #4CAF50; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                  Complaint ID
                </p>
                <p style="margin: 0; font-size: 24px; color: #333333; font-weight: 700; font-family: 'Courier New', monospace;">
                  #${shortId}
                </p>
              </div>
              
              <!-- Complaint Details -->
              <h3 style="margin: 0 0 15px; font-size: 18px; color: #333333; font-weight: 600;">
                Complaint Details
              </h3>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #666666; font-size: 14px;">Issue:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                    <span style="color: #333333; font-size: 14px;">${complaintDetails.title}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #666666; font-size: 14px;">Location:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                    <span style="color: #333333; font-size: 14px;">${complaintDetails.floor}, ${complaintDetails.room_number}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #666666; font-size: 14px;">Priority:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                    <span style="color: #333333; font-size: 14px; font-weight: 600;">${complaintDetails.priority}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <strong style="color: #666666; font-size: 14px;">Status:</strong>
                  </td>
                  <td style="padding: 12px 0; text-align: right;">
                    <span style="display: inline-block; background-color: #FFF3CD; color: #856404; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                      Pending
                    </span>
                  </td>
                </tr>
              </table>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
                  <strong>Description:</strong><br>
                  ${complaintDetails.description}
                </p>
              </div>
              
              <!-- Track Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${trackingUrl}" style="display: inline-block; background-color: #4CAF50; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);">
                  Track Your Complaint
                </a>
              </div>
              
              <!-- Info Box -->
              <div style="background-color: #E3F2FD; border-left: 4px solid #2196F3; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; color: #1565C0; line-height: 1.6;">
                  <strong>📧 Email Updates:</strong> You will receive email notifications when the status of your complaint changes.
                </p>
              </div>
              
              <p style="margin: 0 0 10px; font-size: 14px; color: #666666; line-height: 1.6;">
                <strong>Expected Response Time:</strong> 24-48 hours
              </p>
              
              <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
                If you have any urgent concerns, please contact the administration office directly.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                Thank you,<br>
                <strong>${siteName} Team</strong>
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999;">
                This is an automated email. Please do not reply to this message.
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

        const { data, error } = await resend.emails.send({
            from: 'Smart Maintenance <onboarding@resend.dev>',
            to: email,
            subject: `✅ Complaint #${shortId} Received`,
            html: htmlContent,
        });

        if (error) {
            console.error('Email send error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Email send exception:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

/**
 * Send status update email to user
 */
export async function sendStatusUpdateEmail(
    email: string,
    complaintId: string,
    newStatus: string,
    userName: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'College Complaint System';
        const trackingUrl = `${siteUrl}/track/${complaintId}`;
        const shortId = complaintId.substring(0, 8).toUpperCase();

        const statusColors: Record<string, { bg: string; text: string }> = {
            'Assigned': { bg: '#E3F2FD', text: '#1565C0' },
            'In Progress': { bg: '#FFF3E0', text: '#E65100' },
            'Completed': { bg: '#E8F5E9', text: '#2E7D32' },
            'Rejected': { bg: '#FFEBEE', text: '#C62828' },
        };

        const statusColor = statusColors[newStatus] || { bg: '#F5F5F5', text: '#333333' };

        const { data, error } = await resend.emails.send({
            from: `${siteName} <noreply@${process.env.RESEND_DOMAIN || 'yourdomain.com'}>`,
            to: email,
            subject: `🔔 Complaint #${shortId} Status Updated: ${newStatus}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h1>Status Update</h1>
          </div>
          <div style="padding: 20px; background: #f5f5f5;">
            <p>Dear ${userName},</p>
            <p>Your complaint <strong>#${shortId}</strong> status has been updated to:</p>
            <div style="background: ${statusColor.bg}; color: ${statusColor.text}; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h2 style="margin: 0;">${newStatus}</h2>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${trackingUrl}" style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Details
              </a>
            </div>
            <p>Thank you,<br>${siteName} Team</p>
          </div>
        </div>
      `,
        });

        if (error) {
            console.error('Status update email error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Status update email exception:', error);
        return { success: false, error: 'Failed to send status update email' };
    }
}
