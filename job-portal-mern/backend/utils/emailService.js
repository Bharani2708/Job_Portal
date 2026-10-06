const nodemailer = require("nodemailer");

const createTransporter = () => {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user.trim(),
      pass: pass.trim().replace(/\s+/g, "") // strip spaces from App Password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendOtpEmail = async (toEmail, name, otp) => {
  const userEnv = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const passEnv = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
  const frontendUrl = process.env.FRONTEND_URL || "https://job-portal-sw24.onrender.com";
  const verifyUrl = `${frontendUrl}/verify-email?email=${encodeURIComponent(toEmail)}&otp=${otp}`;

  console.log(`\n=========================================================`);
  console.log(`📨 [OTP DISPATCH INITIATED]`);
  console.log(`👤 Recipient: ${name || 'User'} <${toEmail}>`);
  console.log(`🔑 Verification OTP Code: ${otp}`);
  console.log(`🔗 1-Click Verify Link: ${verifyUrl}`);
  console.log(`⚙️ GMAIL_USER configured: ${userEnv ? `YES (${userEnv})` : 'NO'}`);
  console.log(`⚙️ GMAIL_APP_PASSWORD configured: ${passEnv ? `YES (${passEnv.replace(/\s+/g, '').length} chars)` : 'NO'}`);
  console.log(`=========================================================\n`);

  const transporter = createTransporter();

  if (!transporter) {
    console.warn(`⚠️ [SMTP SKIPPED] No Gmail credentials configured on Render.`);
    return { success: true, simulated: true, otp, verifyUrl };
  }

  const senderEmail = userEnv;
  const mailOptions = {
    from: `"JobConnect India" <${senderEmail}>`,
    to: toEmail,
    subject: `🔐 Verify Your JobConnect India Account: ${otp}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); padding: 32px 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">JobConnect India</h1>
          <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Verify your email address to activate your account</p>
        </div>
        <div style="padding: 32px 28px; color: #1e293b;">
          <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #0f172a;">Hello ${name || 'User'},</h2>
          <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #475569;">
            Welcome to <strong>JobConnect India</strong>! To verify that you own this email address and activate your account, please click the button below:
          </p>

          <!-- 1-Click Verification Button -->
          <div style="text-align: center; margin: 28px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; padding: 14px 32px; border-radius: 30px; font-size: 16px; font-weight: 700; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
              Verify Email & Activate Account →
            </a>
          </div>
          
          <div style="text-align: center; margin: 24px 0 16px;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">Or enter this 6-digit OTP on the verification page:</p>
            <div style="background: #f0f9ff; border: 2px dashed #0284c7; border-radius: 12px; padding: 14px 20px; display: inline-block;">
              <span style="font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #0369a1; font-family: monospace;">${otp}</span>
            </div>
            <p style="margin: 8px 0 0; font-size: 12px; color: #94a3b8;">Valid for 10 minutes only</p>
          </div>

          <p style="font-size: 12.5px; color: #94a3b8; line-height: 1.5; margin: 24px 0 0; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            If you did not create an account on JobConnect India, you can safely ignore this email.
          </p>
        </div>
        <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          © ${new Date().getFullYear()} JobConnect India • Career & Talent Network
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [EMAIL SUCCESS] Sent OTP to ${toEmail} | Message ID: ${info.messageId}`);
    return { success: true, simulated: false, verifyUrl };
  } catch (error) {
    console.error(`❌ [EMAIL ERROR] Failed sending to ${toEmail}:`, error.message);
    return { success: false, simulated: true, otp, verifyUrl, error: error.message };
  }
};

const sendStageUpdateEmail = async (toEmail, name, jobTitle, company, stage, details = {}) => {
  const transporter = createTransporter();
  const userEnv = process.env.GMAIL_USER || process.env.EMAIL_USER;

  if (!transporter) {
    console.log(`📧 [STAGE EMAIL LOG] To: ${toEmail} | Stage: ${stage} | Job: ${jobTitle} @ ${company}`);
    return { success: true, simulated: true };
  }

  let stageSpecificContent = "";
  if (stage === "Online Assessment") {
    stageSpecificContent = `
      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h4 style="margin: 0 0 8px; color: #1e40af;">📝 Online Assessment Details:</h4>
        <p style="margin: 4px 0;"><strong>Link:</strong> <a href="${details.link || '#'}" style="color: #2563eb;">${details.link || 'Will be shared shortly'}</a></p>
        ${details.deadline ? `<p style="margin: 4px 0;"><strong>Deadline:</strong> ${new Date(details.deadline).toLocaleString('en-IN')}</p>` : ''}
        ${details.instructions ? `<p style="margin: 4px 0;"><strong>Instructions:</strong> ${details.instructions}</p>` : ''}
      </div>
    `;
  } else if (stage === "Technical Interview" || stage === "HR Interview") {
    stageSpecificContent = `
      <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h4 style="margin: 0 0 8px; color: #15803d;">📅 ${stage} Details:</h4>
        ${details.scheduledAt ? `<p style="margin: 4px 0;"><strong>Date & Time:</strong> ${new Date(details.scheduledAt).toLocaleString('en-IN')}</p>` : ''}
        ${details.meetingLink ? `<p style="margin: 4px 0;"><strong>Meeting Link:</strong> <a href="${details.meetingLink}" style="color: #16a34a; font-weight: bold;">Join Video Call</a></p>` : ''}
        ${details.interviewer ? `<p style="margin: 4px 0;"><strong>Interviewer:</strong> ${details.interviewer}</p>` : ''}
        ${details.notes ? `<p style="margin: 4px 0;"><strong>Notes:</strong> ${details.notes}</p>` : ''}
      </div>
    `;
  } else if (stage === "Offer Released") {
    stageSpecificContent = `
      <div style="background: #faf5ff; border: 2px solid #a855f7; padding: 20px; border-radius: 12px; margin: 16px 0; text-align: center;">
        <h3 style="margin: 0 0 8px; color: #7e22ce; font-size: 20px;">🎉 Congratulations on your Job Offer!</h3>
        <p style="font-size: 22px; font-weight: 800; color: #6b21a8; margin: 8px 0;">Offered CTC: ₹ ${details.ctc || 'As discussed'} LPA</p>
        ${details.joiningDate ? `<p style="margin: 6px 0; color: #4b5563;">Expected Joining Date: <strong>${new Date(details.joiningDate).toLocaleDateString('en-IN')}</strong></p>` : ''}
        ${details.offerLetterNotes ? `<p style="margin: 6px 0; color: #4b5563;">${details.offerLetterNotes}</p>` : ''}
        <p style="margin: 12px 0 0; font-size: 14px; color: #7e22ce; font-weight: 600;">Please log in to your JobConnect portal to review & digitally accept the offer letter.</p>
      </div>
    `;
  }

  const mailOptions = {
    from: `"JobConnect India" <${userEnv}>`,
    to: toEmail,
    subject: `Application Update: ${stage} for ${jobTitle} at ${company}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
        <div style="background: #0f172a; padding: 24px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 22px;">Job Application Status Update</h2>
          <p style="margin: 6px 0 0; font-size: 14px; color: #94a3b8;">${jobTitle} • ${company}</p>
        </div>
        <div style="padding: 28px; color: #1e293b;">
          <p style="font-size: 16px; margin: 0 0 16px;">Hello <strong>${name}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px;">
            Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has moved to the next step:
          </p>
          <div style="display: inline-block; background: #0284c7; color: white; padding: 8px 18px; border-radius: 20px; font-weight: 700; font-size: 14px; margin-bottom: 16px;">
            ${stage}
          </div>
          ${stageSpecificContent}
          <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
            Please visit your <a href="https://job-portal-sw24.onrender.com/applications" style="color: #0284c7; font-weight: 600;">JobConnect Applications Dashboard</a> for more details and next steps.
          </p>
        </div>
      </div>
    `
  };

  try {
    transporter.sendMail(mailOptions).catch((e) => console.error("Async stage email err:", e.message));
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send stage email:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOtpEmail, sendStageUpdateEmail };
