/**
 * FINAL UNIFIED EMAIL SERVICE
 * Supports:
 * - Complaint Submitted
 * - Complaint Status Updated
 * - Welcome + Set Password (Auto Account Creation)
 */

import nodemailer from 'nodemailer';

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
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">

<!-- Header -->
<tr>
<td style="background:#4CAF50;padding:30px;text-align:center;">
<h1 style="margin:0;color:white;font-size:26px;font-weight:600;">
${heading}
</h1>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<p style="font-size:16px;margin-bottom:20px;">
Hi <strong>${userName}</strong>,
</p>

<p style="font-size:15px;color:#444;line-height:1.6;">
${message}
</p>

${
    shortId
        ? `
<div style="
background:#f8f9fa;
padding:20px;
border-left:4px solid #4CAF50;
border-radius:6px;
margin:30px 0;
">
<p style="margin:0 0 8px;font-size:13px;color:#777;">
COMPLAINT ID
</p>
<h2 style="margin:0;font-size:22px;color:#333;">
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
font-size:13px;
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
background:#4CAF50;
color:white;
padding:12px 35px;
text-decoration:none;
border-radius:6px;
font-weight:600;
display:inline-block;
">
${buttonText}
</a>
</div>

<p style="font-size:13px;color:#777;text-align:center;">
This is an automated email from ${siteName}.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #e0e0e0;">
<p style="margin:0;font-size:13px;color:#666;">
Thank you,<br>
<strong>${siteName} Team</strong>
</p>
<p style="margin-top:5px;font-size:12px;color:#999;">
Please do not reply to this email.
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
<p><strong>Location:</strong> ${complaintDetails.floor}, ${complaintDetails.room_number}</p>
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
    completionNotes?: string
) {
    try {
        const { siteUrl, siteName } = getSiteConfig();

        // Format completion notes if they exist
        const extraContent = completionNotes ? `
<div style="
background:#e8f5e9;
padding:20px;
border-left:4px solid #4CAF50;
border-radius:6px;
margin:20px 0;
">
<p style="margin:0 0 8px;font-size:13px;color:#2e7d32;font-weight:600;">
COMPLETION NOTES
</p>
<p style="margin:0;font-size:15px;color:#333;line-height:1.6;">
${completionNotes}
</p>
</div>
` : undefined;

        const html = buildEmailTemplate({
            heading: "✅ Complaint Completed",
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
            subject: `✅ Complaint #${complaintId.substring(0, 8)} Completed`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

/* =====================================================
   3️⃣ WELCOME + SET PASSWORD EMAIL
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
