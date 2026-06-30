/**
 * FINAL UNIFIED EMAIL SERVICE
 * Supports:
 * - Complaint Submitted
 * - Complaint Status Updated
 * - Welcome + Set Password (Auto Account Creation)
 */

import nodemailer from 'nodemailer';

/* =====================================================
   📧 EMAIL THEME CONFIGURATION
   ⚠️ EDIT HERE TO CHANGE ALL EMAILS AT ONCE
   
   HOW TO USE:
   1. Change primary color → Updates header, buttons, borders
   2. Edit footer text → Updates both emails
   3. Change fonts → Updates all text in emails
   4. All changes apply to BOTH emails automatically!
   
===================================================== */

const EMAIL_THEME = {
    // Colors - Change these to match your brand
    colors: {
        primary: '#4CAF50',        // Main green color (header, buttons) - TRY: '#FF5722', '#2196F3', '#9C27B0'
        primaryDark: '#388E3C',    // Darker green (button hover)
        background: '#f5f5f5',     // Email background (gray)
        cardBackground: '#ffffff', // Email card background (white)
        textPrimary: '#333333',    // Main text color (dark gray)
        textSecondary: '#777777',  // Secondary text color (light gray)
        border: '#e0e0e0',         // Border color
    },
    
    // Typography - Change font sizes and family
    fonts: {
        family: 'Arial, Helvetica, sans-serif',  // Font family - TRY: 'Georgia, serif'
        headingSize: '26px',                      // Header text size
        bodySize: '15px',                         // Body text size
        smallSize: '13px',                        // Small text size
    },
    
    // Footer - Customize footer text
    footer: {
        companyName: 'Snap2Fix Team',                           // Company name
        tagline: 'Thank you,',                                  // Footer tagline
        disclaimer: 'This is an automated email from Snap2Fix.', // Disclaimer text
        noteToUser: 'Please do not reply to this email.',       // Note to user
    },
    
    // Header - Customize header styling
    header: {
        padding: '30px',          // Header padding
        textColor: 'white',       // Header text color
    },
    
    // Button - Customize button styling
    button: {
        padding: '12px 35px',     // Button padding
        borderRadius: '6px',      // Button rounded corners
        fontWeight: '600',        // Button text weight (bold)
    },
};

/* =====================================================
   SMTP CONFIG
===================================================== */

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/* =====================================================
   SITE CONFIG
===================================================== */

const getSiteConfig = () => ({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Snap2Fix',
});

/* =====================================================
   STATUS COLOR HELPER
===================================================== */

const getStatusColor = (status: string) => {
    const map: Record<string, { bg: string; text: string }> = {
        pending: { bg: '#FFF3CD', text: '#856404' },
        assigned: { bg: '#E3F2FD', text: '#1565C0' },
        'in-progress': { bg: '#FFF3E0', text: '#E65100' },
        completed: { bg: '#E8F5E9', text: '#2E7D32' },
        rejected: { bg: '#FFEBEE', text: '#C62828' },
    };

    return map[status.toLowerCase()] || { bg: '#F5F5F5', text: '#333' };
};

/* =====================================================
   MASTER EMAIL TEMPLATE
===================================================== */

function buildEmailTemplate({
    heading,
    userName,
    message,
    complaintId,
    status,
    buttonText,
    buttonUrl,
    extraContent,
    siteName,
}: {
    heading: string;
    userName: string;
    message: string;
    complaintId?: string;
    status?: string;
    buttonText: string;
    buttonUrl: string;
    extraContent?: string;
    siteName: string;
}) {
    const statusColor = status ? getStatusColor(status) : null;
    const shortId = complaintId ? complaintId.substring(0, 8).toUpperCase() : null;

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${heading}</title>
<style>
@media only screen and (max-width: 600px) {
    .email-container {
        width: 100% !important;
        max-width: 100% !important;
    }
    .email-wrapper {
        padding: 10px !important;
    }
    .email-body {
        padding: 25px !important;
    }
    .email-header {
        padding: 20px !important;
    }
}
</style>
</head>

<body style="margin:0;padding:0;background:${EMAIL_THEME.colors.background};font-family:${EMAIL_THEME.fonts.family};">

<table width="100%" cellpadding="0" cellspacing="0" class="email-wrapper" style="padding:30px;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" class="email-container"
style="max-width:600px;background:${EMAIL_THEME.colors.cardBackground};border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">

<!-- Header -->
<tr>
<td class="email-header" style="background:${EMAIL_THEME.colors.primary};padding:${EMAIL_THEME.header.padding};text-align:center;">
<h1 style="margin:0;color:${EMAIL_THEME.header.textColor};font-size:${EMAIL_THEME.fonts.headingSize};font-weight:600;">
${heading}
</h1>
</td>
</tr>

<!-- Body -->
<tr>
<td class="email-body" style="padding:40px;">

<p style="font-size:16px;margin-bottom:20px;">
Hi <strong>${userName}</strong>,
</p>

<p style="font-size:${EMAIL_THEME.fonts.bodySize};color:${EMAIL_THEME.colors.textPrimary};line-height:1.6;">
${message}
</p>

${
    shortId
        ? `
<div style="
background:#f8f9fa;
padding:20px;
border-left:4px solid ${EMAIL_THEME.colors.primary};
border-radius:6px;
margin:30px 0;
">
<p style="margin:0 0 8px;font-size:${EMAIL_THEME.fonts.smallSize};color:${EMAIL_THEME.colors.textSecondary};">
COMPLAINT ID
</p>
<h2 style="margin:0;font-size:22px;color:${EMAIL_THEME.colors.textPrimary};">
#${shortId}
</h2>

${
    status
        ? `
<div style="
margin-top:12px;
display:inline-block;
padding:6px 16px;
border-radius:20px;
font-size:${EMAIL_THEME.fonts.smallSize};
font-weight:600;
background:${statusColor?.bg};
color:${statusColor?.text};
">
${status.toUpperCase()}
</div>
`
        : ''
}
</div>
`
        : ''
}

${extraContent ? extraContent : ''}

<div style="text-align:center;margin:30px 0;">
<a href="${buttonUrl}"
style="
background:${EMAIL_THEME.colors.primary};
color:white;
padding:${EMAIL_THEME.button.padding};
text-decoration:none;
border-radius:${EMAIL_THEME.button.borderRadius};
font-weight:${EMAIL_THEME.button.fontWeight};
display:inline-block;
">
${buttonText}
</a>
</div>

<p style="font-size:${EMAIL_THEME.fonts.smallSize};color:${EMAIL_THEME.colors.textSecondary};text-align:center;">
${EMAIL_THEME.footer.disclaimer}
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid ${EMAIL_THEME.colors.border};">
<p style="margin:0;font-size:${EMAIL_THEME.fonts.smallSize};color:#666;">
${EMAIL_THEME.footer.tagline}<br>
<strong>${EMAIL_THEME.footer.companyName}</strong>
</p>
<p style="margin-top:5px;font-size:12px;color:#999;">
${EMAIL_THEME.footer.noteToUser}
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
}

/* =====================================================
   1️⃣ COMPLAINT SUBMITTED EMAIL
===================================================== */

export async function sendConfirmationEmail({
    email,
    complaintId,
    userName,
    complaintDetails,
}: any) {
    try {
        const { siteUrl, siteName } = getSiteConfig();

        const extraContent = `
<p><strong>Issue:</strong> ${complaintDetails.title}</p>
<p><strong>Location:</strong> Floor ${complaintDetails.floor}, Room ${complaintDetails.room_number}</p>
<p><strong>Priority:</strong> ${complaintDetails.priority}</p>
<p style="margin-top:15px;">
<strong>Description:</strong><br>
${complaintDetails.description}
</p>
`;

        const html = buildEmailTemplate({
            heading: "Complaint Received",
            userName,
            message:
                "Your complaint has been successfully submitted and is now pending review by our maintenance team.",
            complaintId,
            status: "pending",
            buttonText: "Track Complaint",
            buttonUrl: `${siteUrl}/track/${complaintId}`,
            extraContent,
            siteName,
        });

        await transporter.sendMail({
            from: `"${siteName}" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Complaint #${complaintId.substring(0, 8)} Received`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

/* =====================================================
   2️⃣ STATUS UPDATE EMAIL
===================================================== */

export async function sendStatusUpdateEmail(
    email: string,
    complaintId: string,
    newStatus: string,
    userName: string
) {
    try {
        const { siteUrl, siteName } = getSiteConfig();

        const html = buildEmailTemplate({
            heading: "Complaint Status Updated",
            userName,
            message:
                "The status of your complaint has been updated. Please check the latest details below.",
            complaintId,
            status: newStatus,
            buttonText: "View Details",
            buttonUrl: `${siteUrl}/track/${complaintId}`,
            siteName,
        });

        await transporter.sendMail({
            from: `"${siteName}" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Complaint #${complaintId.substring(0, 8)} Status Updated`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

/* =====================================================
   2B️⃣ COMPLAINT COMPLETED EMAIL
===================================================== */

export async function sendCompletionEmail(
    email: string,
    complaintId: string,
    userName: string,
    complaintDetails: {
        title: string;
        floor: string;
        room_number: string;
        priority: string;
        description: string;
    },
    completionNotes?: string
) {
    try {
        const { siteUrl, siteName } = getSiteConfig();

        // Build complaint details section (same as confirmation email)
        let extraContent = `
<p><strong>Issue:</strong> ${complaintDetails.title}</p>
<p><strong>Location:</strong> Floor ${complaintDetails.floor}, Room ${complaintDetails.room_number}</p>
<p><strong>Priority:</strong> ${complaintDetails.priority}</p>
<p style="margin-top:15px;">
<strong>Description:</strong><br>
${complaintDetails.description}
</p>
`;

        // Add completion notes if they exist
        if (completionNotes) {
            extraContent += `
<div style="
background:#e8f5e9;
padding:20px;
border-left:4px solid ${EMAIL_THEME.colors.primary};
border-radius:6px;
margin:20px 0;
">
<p style="margin:0 0 8px;font-size:${EMAIL_THEME.fonts.smallSize};color:#2e7d32;font-weight:600;">
COMPLETION NOTES
</p>
<p style="margin:0;font-size:${EMAIL_THEME.fonts.bodySize};color:${EMAIL_THEME.colors.textPrimary};line-height:1.6;">
${completionNotes}
</p>
</div>
`;
        }

        const html = buildEmailTemplate({
            heading: "Complaint Completed",
            userName,
            message:
                "Great news! Your complaint has been successfully resolved by our maintenance team.",
            complaintId,
            status: "completed",
            buttonText: "View Completion Details",
            buttonUrl: `${siteUrl}/track/${complaintId}`,
            siteName,
            extraContent,
        });

        await transporter.sendMail({
            from: `"${siteName}" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Complaint #${complaintId.substring(0, 8)} Completed`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

/* =====================================================
   3️⃣ OTP VERIFICATION EMAIL
===================================================== */

export async function sendOtpEmail({
    email,
    otp,
}: {
    email: string;
    otp: string;
}) {
    try {
        const { siteName } = getSiteConfig();

        const subject = `Your ${siteName} Verification Code`;

        const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Your Verification Code</title>
</head>
<body style="margin:0;padding:0;background:${EMAIL_THEME.colors.background};font-family:${EMAIL_THEME.fonts.family};">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0"
  style="max-width:520px;background:${EMAIL_THEME.colors.cardBackground};border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
<!-- Header -->
<tr>
  <td style="background:${EMAIL_THEME.colors.primary};padding:30px;text-align:center;">
    <h1 style="margin:0;color:white;font-size:24px;font-weight:600;">Email Verification</h1>
  </td>
</tr>
<!-- Body -->
<tr>
  <td style="padding:40px;">
    <p style="font-size:15px;color:${EMAIL_THEME.colors.textPrimary};margin-bottom:10px;">
      Use the code below to verify your email address for <strong>${siteName}</strong>.
    </p>
    <div style="text-align:center;margin:30px 0;">
      <div style="
        display:inline-block;
        background:#f0f9ff;
        border:2px dashed ${EMAIL_THEME.colors.primary};
        border-radius:12px;
        padding:18px 40px;
      ">
        <span style="font-size:38px;font-weight:700;letter-spacing:10px;color:${EMAIL_THEME.colors.primary};">
          ${otp}
        </span>
      </div>
    </div>
    <p style="font-size:13px;color:${EMAIL_THEME.colors.textSecondary};text-align:center;margin-top:0;">
      This code expires in <strong>5 minutes</strong>.
    </p>
    <p style="font-size:12px;color:#aaa;text-align:center;margin-top:20px;">
      If you didn't request this, please ignore this email.
    </p>
  </td>
</tr>
<!-- Footer -->
<tr>
  <td style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid ${EMAIL_THEME.colors.border};">
    <p style="margin:0;font-size:13px;color:#666;">
      ${EMAIL_THEME.footer.tagline}<br>
      <strong>${EMAIL_THEME.footer.companyName}</strong>
    </p>
    <p style="margin-top:5px;font-size:12px;color:#999;">
      ${EMAIL_THEME.footer.noteToUser}
    </p>
  </td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>`;

        await transporter.sendMail({
            from: `"${siteName}" <${process.env.SMTP_USER}>`,
            to: email,
            subject,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error('sendOtpEmail error:', error);
        return { success: false };
    }
}

/* =====================================================
   4️⃣ WELCOME + SET PASSWORD EMAIL
===================================================== */

export async function sendWelcomeEmail({
    email,
    userName,
    setPasswordUrl,
    complaintId,
}: any) {
    try {
        const { siteUrl, siteName } = getSiteConfig();

        const html = buildEmailTemplate({
            heading: "Welcome to " + siteName,
            userName,
            message:
                "An account has been created for you after submitting your complaint. Please set your password to access your dashboard and manage your complaints.",
            complaintId,
            buttonText: "Set Your Password",
            buttonUrl: setPasswordUrl,
            extraContent: `
<p style="margin-top:15px;">
You can also track your complaint instantly using the link below:
</p>
<p>
<a href="${siteUrl}/track/${complaintId}">
${siteUrl}/track/${complaintId}
</a>
</p>
`,
            siteName,
        });

        await transporter.sendMail({
            from: `"${siteName}" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Welcome to ${siteName} - Set Your Password`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

/* =====================================================
   5️⃣ CONTACT FORM CONFIRMATION EMAIL
===================================================== */

export async function sendContactConfirmationEmail({
    email,
    userName,
    subject,
    message,
    messageId,
}: {
    email: string;
    userName: string;
    subject: string;
    message: string;
    messageId: string;
}) {
    try {
        const { siteUrl, siteName } = getSiteConfig();

        const shortId = messageId.substring(0, 8).toUpperCase();

        const extraContent = `
<div style="
background:#f8f9fa;
padding:20px;
border-left:4px solid ${EMAIL_THEME.colors.primary};
border-radius:6px;
margin:20px 0;
">
<p style="margin:0 0 12px;font-size:${EMAIL_THEME.fonts.smallSize};color:${EMAIL_THEME.colors.textSecondary};font-weight:600;">
YOUR MESSAGE DETAILS
</p>
<p style="margin:0 0 8px;font-size:${EMAIL_THEME.fonts.bodySize};color:${EMAIL_THEME.colors.textPrimary};">
<strong>Reference ID:</strong> #${shortId}
</p>
<p style="margin:0 0 8px;font-size:${EMAIL_THEME.fonts.bodySize};color:${EMAIL_THEME.colors.textPrimary};">
<strong>Subject:</strong> ${subject}
</p>
<p style="margin:0 0 8px;font-size:${EMAIL_THEME.fonts.bodySize};color:${EMAIL_THEME.colors.textPrimary};">
<strong>Message:</strong>
</p>
<p style="margin:0;font-size:${EMAIL_THEME.fonts.bodySize};color:${EMAIL_THEME.colors.textSecondary};line-height:1.6;font-style:italic;">
"${message}"
</p>
</div>
<p style="font-size:${EMAIL_THEME.fonts.bodySize};color:${EMAIL_THEME.colors.textPrimary};line-height:1.6;margin-top:20px;">
Our team will review your message and get back to you as soon as possible. If your inquiry is urgent, feel free to reach out to us directly at <a href="mailto:snap2fix.official@gmail.com" style="color:${EMAIL_THEME.colors.primary};text-decoration:none;font-weight:600;">snap2fix.official@gmail.com</a>.
</p>
`;

        const html = buildEmailTemplate({
            heading: "Message Received!",
            userName,
            message:
                "Thank you for reaching out to us! We have received your message and wanted to confirm that it has been successfully submitted.",
            buttonText: "Visit Snap2Fix",
            buttonUrl: siteUrl,
            extraContent,
            siteName,
        });

        await transporter.sendMail({
            from: `"${siteName}" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `We received your message - ${subject} | ${siteName}`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error('sendContactConfirmationEmail error:', error);
        return { success: false };
    }
}
