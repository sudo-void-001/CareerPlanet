"""
CareerPlanet Email Service
Sends beautiful HTML emails for application lifecycle events.
Uses SMTP if configured in env, otherwise logs to console (no-op mode for testing).
"""
import os
import resend
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "CareerPlanet <onboarding@resend.dev>") # Using resend sandbox by default
EMAIL_ENABLED = bool(RESEND_API_KEY)

if EMAIL_ENABLED:
    resend.api_key = RESEND_API_KEY

BRAND_COLOR = "#6366f1"
BRAND_NAME = "CareerPlanet"

def _base_template(content: str, footer_note: str = "") -> str:
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>{BRAND_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f8f9fa;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      
      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
        <div style="font-size:28px;font-weight:900;color:white;letter-spacing:-0.03em;">
          🪐 {BRAND_NAME}
        </div>
        <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:4px;">
          AI-Powered Career Platform
        </div>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:white;padding:40px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        {content}
        
        <!-- Footer -->
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #f3f4f6;text-align:center;">
          <p style="font-size:12px;color:#9ca3af;margin:0;">
            {footer_note or f'This email was sent by {BRAND_NAME} · <a href="#" style="color:{BRAND_COLOR};">Unsubscribe</a>'}
          </p>
          <p style="font-size:12px;color:#9ca3af;margin:4px 0 0;">
            © 2024 {BRAND_NAME}. Empowering careers with AI.
          </p>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
"""

def _send(to_email: str, subject: str, html: str) -> bool:
    """Send email via Resend API. Falls back to console log if not configured."""
    if not EMAIL_ENABLED:
        logger.info(f"[EMAIL - NO-OP] To: {to_email} | Subject: {subject}")
        logger.info(f"[EMAIL BODY PREVIEW]: {html[:200]}...")
        return True  # Return True so tracking still updates

    try:
        r = resend.Emails.send({
            "from": FROM_EMAIL,
            "to": to_email,
            "subject": subject,
            "html": html
        })
        logger.info(f"Email sent successfully to {to_email}: {r}")
        return True
    except Exception as e:
        logger.error(f"Email failed to {to_email}: {e}")
        return False


def send_application_email(
    recruiter_email: str,
    recruiter_name: str,
    student_name: str,
    student_email: str,
    job_title: str,
    company_name: str,
    resume_download_url: str,
    ai_summary: str,
    match_score: int,
    matched_skills: str,
    missing_skills: str,
    recommendations: str,
    cover_letter: str = None,
    backend_base_url: str = "http://localhost:8000"
) -> bool:
    """Send professional application notification email to recruiter."""
    
    score_color = "#10b981" if match_score >= 80 else "#f59e0b" if match_score >= 60 else "#ef4444"
    score_label = "Excellent Match" if match_score >= 80 else "Good Match" if match_score >= 60 else "Needs Review"
    
    matched_chips = "".join([
        f'<span style="display:inline-block;background:#d1fae5;color:#065f46;padding:4px 10px;border-radius:20px;font-size:12px;margin:3px;font-weight:600;">{s.strip()}</span>'
        for s in (matched_skills or "").split(",") if s.strip()
    ])
    
    missing_chips = "".join([
        f'<span style="display:inline-block;background:#fee2e2;color:#991b1b;padding:4px 10px;border-radius:20px;font-size:12px;margin:3px;font-weight:600;">{s.strip()}</span>'
        for s in (missing_skills or "").split(",") if s.strip()
    ])

    content = f"""
    <h1 style="font-size:22px;font-weight:800;color:#111827;margin:0 0 8px;">
      New Application Received 🎯
    </h1>
    <p style="color:#6b7280;font-size:15px;margin:0 0 28px;">
      Hello <strong>{recruiter_name}</strong>, a student has applied to your job posting on {BRAND_NAME}.
    </p>

    <!-- Job Card -->
    <div style="background:linear-gradient(135deg,rgba(99,102,241,0.06),rgba(139,92,246,0.06));border:1px solid rgba(99,102,241,0.15);border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="font-size:12px;color:{BRAND_COLOR};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Job Position</div>
      <div style="font-size:20px;font-weight:800;color:#111827;">{job_title}</div>
      <div style="font-size:14px;color:#6b7280;margin-top:4px;">📍 {company_name}</div>
    </div>
    
    {f'''<!-- Cover Letter -->
    <div style="background:#f9fafb;border-left:3px solid {BRAND_COLOR};padding:16px;border-radius:0 8px 8px 0;margin-bottom:24px;">
      <div style="font-size:13px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Applicant Cover Letter</div>
      <p style="font-size:15px;color:#374151;line-height:1.6;margin:0;">{cover_letter}</p>
    </div>''' if cover_letter else ''}

    <!-- Applicant Card -->
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">👤 Applicant Details</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:4px 0;">
            <span style="color:#6b7280;font-size:13px;">Name</span><br/>
            <strong style="color:#111827;font-size:15px;">{student_name}</strong>
          </td>
          <td style="padding:4px 0;">
            <span style="color:#6b7280;font-size:13px;">Email</span><br/>
            <a href="mailto:{student_email}" style="color:{BRAND_COLOR};font-size:15px;font-weight:600;text-decoration:none;">{student_email}</a>
          </td>
        </tr>
      </table>
    </div>

    <!-- AI Score Banner -->
    <div style="background:linear-gradient(135deg,#111827,#1f2937);border-radius:12px;padding:24px;margin-bottom:24px;text-align:center;">
      <div style="font-size:11px;color:rgba(255,255,255,0.6);font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">✦ CareerPlanet AI Analysis</div>
      <div style="display:inline-block;background:{score_color};color:white;border-radius:50px;padding:8px 28px;font-size:28px;font-weight:900;margin-bottom:8px;">{match_score}%</div>
      <div style="color:rgba(255,255,255,0.8);font-size:13px;font-weight:600;">{score_label}</div>
    </div>

    <!-- AI Summary -->
    <div style="margin-bottom:24px;">
      <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:10px;">📋 AI Resume Summary</div>
      <div style="background:#f9fafb;border-left:3px solid {BRAND_COLOR};padding:16px;border-radius:0 8px 8px 0;font-size:14px;color:#4b5563;line-height:1.7;">
        {ai_summary or "Candidate profile analyzed by CareerPlanet AI."}
      </div>
    </div>

    <!-- Skills Analysis -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td width="50%" style="padding-right:8px;vertical-align:top;">
          <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:8px;">✅ Matched Skills</div>
          <div>{matched_chips or '<span style="color:#9ca3af;font-size:13px;">Not analyzed</span>'}</div>
        </td>
        <td width="50%" style="padding-left:8px;vertical-align:top;">
          <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:8px;">⚠️ Missing Skills</div>
          <div>{missing_chips or '<span style="color:#9ca3af;font-size:13px;">None identified</span>'}</div>
        </td>
      </tr>
    </table>

    <!-- AI Recommendation -->
    {f'''<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px;margin-bottom:28px;">
      <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:8px;">💡 AI Recommendation</div>
      <div style="font-size:13px;color:#78350f;line-height:1.6;">{recommendations}</div>
    </div>''' if recommendations else ''}

    <!-- CTA Buttons -->
    <div style="text-align:center;margin:32px 0;">
      <a href="{backend_base_url}{resume_download_url}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:14px 32px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;margin:4px;">
        ⬇️ Download Resume
      </a>
      <a href="http://localhost:5173/recruiter/dashboard" style="display:inline-block;background:#111827;color:white;padding:14px 32px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;margin:4px;">
        👁 View on Dashboard
      </a>
    </div>
    """

    html = _base_template(content, f"Application notification from {BRAND_NAME}")
    return _send(
        recruiter_email,
        f"🎯 New Application: {student_name} → {job_title} at {company_name}",
        html
    )


def send_shortlist_email(
    student_email: str,
    student_name: str,
    job_title: str,
    company_name: str,
    recruiter_name: str
) -> bool:
    """Send congratulatory shortlist email to student."""
    first_name = student_name.split()[0] if student_name else "there"
    
    content = f"""
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:64px;margin-bottom:16px;">🌟</div>
      <h1 style="font-size:28px;font-weight:900;color:#111827;margin:0 0 8px;">
        Congratulations, {first_name}!
      </h1>
      <p style="color:#6b7280;font-size:16px;margin:0;">
        You've been shortlisted for an exciting opportunity.
      </p>
    </div>

    <!-- Highlight Card -->
    <div style="background:linear-gradient(135deg,#d1fae5,#a7f3d0);border-radius:16px;padding:28px;margin-bottom:28px;text-align:center;">
      <div style="font-size:13px;color:#065f46;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">You have been SHORTLISTED for</div>
      <div style="font-size:24px;font-weight:900;color:#064e3b;">{job_title}</div>
      <div style="font-size:16px;color:#065f46;margin-top:6px;">🏢 {company_name}</div>
    </div>

    <!-- What This Means -->
    <div style="margin-bottom:28px;">
      <h3 style="font-size:16px;font-weight:700;color:#111827;margin-bottom:16px;">🎯 What happens next?</h3>
      <div style="display:flex;flex-direction:column;gap:12px;">
        {"".join([f'''<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
          <span style="width:32px;height:32px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:white;font-size:14px;font-weight:700;flex-shrink:0;">{i}</span>
          <span style="font-size:14px;color:#374151;">{step}</span>
        </div>''' for i, step in enumerate([
            f"The recruiter ({recruiter_name}) will review your profile in detail.",
            "You may be contacted for a technical interview or skill assessment.",
            "Keep your email and phone ready for quick responses.",
            "Check your CareerPlanet dashboard for real-time status updates."
        ], 1)])}
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0;">
      <a href="http://localhost:5173/applications" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:16px 40px;border-radius:50px;font-weight:700;font-size:15px;text-decoration:none;">
        📊 Track Application Status
      </a>
    </div>

    <p style="text-align:center;font-size:14px;color:#6b7280;">
      Keep up the momentum, {first_name}! The {BRAND_NAME} team is rooting for you. 🚀
    </p>
    """

    html = _base_template(content)
    return _send(student_email, f"🌟 Shortlisted! {job_title} at {company_name}", html)


def send_interview_email(
    student_email: str,
    student_name: str,
    job_title: str,
    company_name: str,
    recruiter_name: str
) -> bool:
    """Send interview scheduled email to student."""
    first_name = student_name.split()[0] if student_name else "there"

    content = f"""
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:64px;margin-bottom:16px;">🎤</div>
      <h1 style="font-size:26px;font-weight:900;color:#111827;margin:0 0 8px;">
        Interview Invitation!
      </h1>
      <p style="color:#6b7280;font-size:15px;margin:0;">
        Hi {first_name}, you've been selected for an interview!
      </p>
    </div>

    <!-- Interview Card -->
    <div style="background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:16px;padding:28px;margin-bottom:28px;">
      <div style="font-size:13px;color:#1e40af;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Interview Scheduled For</div>
      <div style="font-size:22px;font-weight:900;color:#1e3a8a;">{job_title}</div>
      <div style="font-size:15px;color:#1e40af;margin-top:6px;">🏢 {company_name}</div>
      <table style="margin-top:20px;width:100%;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;width:50%;">
            <div style="font-size:12px;color:#3b82f6;font-weight:600;">📅 DATE</div>
            <div style="font-size:15px;color:#1e3a8a;font-weight:700;">To be confirmed</div>
          </td>
          <td style="padding:8px 0;width:50%;">
            <div style="font-size:12px;color:#3b82f6;font-weight:600;">⏰ TIME</div>
            <div style="font-size:15px;color:#1e3a8a;font-weight:700;">To be confirmed</div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;" colspan="2">
            <div style="font-size:12px;color:#3b82f6;font-weight:600;">👤 INTERVIEWER</div>
            <div style="font-size:15px;color:#1e3a8a;font-weight:700;">{recruiter_name}</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Interview Tips -->
    <h3 style="font-size:16px;font-weight:700;color:#111827;margin-bottom:16px;">💡 Interview Preparation Tips</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:28px;">
      {"".join([f'''<div style="padding:12px 16px;background:#f9fafb;border-radius:10px;border-left:3px solid #6366f1;font-size:14px;color:#374151;">{tip}</div>''' for tip in [
          "🔍 Research the company thoroughly — culture, products, and recent news.",
          "📝 Prepare concise examples using the STAR method (Situation, Task, Action, Result).",
          "💼 Review the job description and align your experience with key requirements.",
          "⏱ Join 5 minutes early for virtual interviews; ensure stable internet and good lighting.",
          "❓ Prepare thoughtful questions to ask the interviewer at the end."
      ]])}
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0;">
      <a href="http://localhost:5173/applications" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:16px 40px;border-radius:50px;font-weight:700;font-size:15px;text-decoration:none;">
        🚀 View Interview Details
      </a>
    </div>

    <p style="text-align:center;font-size:14px;color:#6b7280;">
      Best of luck, {first_name}! You've got this! 💪<br/>
      The {BRAND_NAME} AI team is cheering you on.
    </p>
    """

    html = _base_template(content)
    return _send(student_email, f"🎤 Interview Invitation — {job_title} at {company_name}", html)


def send_selection_email(
    student_email: str,
    student_name: str,
    job_title: str,
    company_name: str,
    recruiter_name: str
) -> bool:
    """Send offer/selection email to student."""
    first_name = student_name.split()[0] if student_name else "there"

    content = f"""
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:72px;margin-bottom:16px;">🎉</div>
      <h1 style="font-size:28px;font-weight:900;color:#111827;margin:0 0 8px;">
        You're SELECTED!
      </h1>
      <p style="color:#6b7280;font-size:16px;margin:0;">
        Congratulations {first_name} — this is a life-changing moment! 🥂
      </p>
    </div>

    <!-- Offer Card -->
    <div style="background:linear-gradient(135deg,#111827,#1f2937);border-radius:16px;padding:32px;margin-bottom:28px;text-align:center;">
      <div style="font-size:12px;color:rgba(255,255,255,0.6);font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px;">✨ OFFER LETTER</div>
      <div style="font-size:26px;font-weight:900;color:white;margin-bottom:6px;">{job_title}</div>
      <div style="font-size:16px;color:rgba(255,255,255,0.75);margin-bottom:24px;">🏢 {company_name}</div>
      
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:12px;background:rgba(255,255,255,0.05);border-radius:10px;text-align:center;width:33%;">
            <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px;">SALARY</div>
            <div style="font-size:15px;color:white;font-weight:700;">To be discussed</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;background:rgba(255,255,255,0.05);border-radius:10px;text-align:center;width:33%;">
            <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px;">JOINING DATE</div>
            <div style="font-size:15px;color:white;font-weight:700;">To be confirmed</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;background:rgba(255,255,255,0.05);border-radius:10px;text-align:center;width:33%;">
            <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px;">RECRUITER</div>
            <div style="font-size:15px;color:white;font-weight:700;">{recruiter_name}</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Next Steps -->
    <h3 style="font-size:16px;font-weight:700;color:#111827;margin-bottom:16px;">✅ Next Steps</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:28px;">
      {"".join([f'''<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0;">
        <span style="font-size:18px;">{icon}</span>
        <span style="font-size:14px;color:#374151;">{step}</span>
      </div>''' for icon, step in [
          ("📧", f"Expect a formal offer letter email from {company_name} within 2-3 business days."),
          ("📞", "HR will contact you to discuss compensation and benefits package."),
          ("📋", "Prepare your documents: ID proof, educational certificates, previous experience letters."),
          ("🎊", f"Welcome to your new journey with {company_name}!")
      ]])}
    </div>

    <!-- Welcome Message -->
    <div style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08));border:1px solid rgba(99,102,241,0.15);border-radius:12px;padding:24px;margin-bottom:28px;text-align:center;">
      <p style="font-size:15px;color:#4b5563;margin:0;line-height:1.7;">
        "{first_name}, your hard work and talent have brought you here. 
        {BRAND_NAME} is proud to have been part of your journey. 
        This is just the beginning of something extraordinary!"
      </p>
      <p style="font-size:13px;color:{BRAND_COLOR};font-weight:700;margin-top:12px;">
        — The {BRAND_NAME} Team
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0;">
      <a href="http://localhost:5173/applications" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:16px 40px;border-radius:50px;font-weight:700;font-size:15px;text-decoration:none;">
        🏆 View Your Offer
      </a>
    </div>
    """

    html = _base_template(content)
    return _send(student_email, f"🎉 Congratulations! Offer from {company_name} — {job_title}", html)


def send_rejection_email(
    student_email: str,
    student_name: str,
    job_title: str,
    company_name: str
) -> bool:
    """Send respectful rejection email to student."""
    first_name = student_name.split()[0] if student_name else "there"

    content = f"""
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:56px;margin-bottom:16px;">💪</div>
      <h1 style="font-size:24px;font-weight:900;color:#111827;margin:0 0 8px;">
        Keep Moving Forward
      </h1>
      <p style="color:#6b7280;font-size:15px;margin:0;">
        Hi {first_name}, thank you for your time and effort.
      </p>
    </div>

    <!-- Status Card -->
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:28px;">
      <p style="font-size:15px;color:#374151;line-height:1.7;margin:0;">
        After careful consideration, <strong>{company_name}</strong> has decided to move forward with another candidate for the <strong>{job_title}</strong> position.
      </p>
      <p style="font-size:14px;color:#6b7280;margin-top:12px;line-height:1.7;">
        This was an extremely competitive process and your application stood out among many. 
        We strongly encourage you to continue applying — the right opportunity is just around the corner.
      </p>
    </div>

    <!-- Encouragement Tips -->
    <h3 style="font-size:16px;font-weight:700;color:#111827;margin-bottom:16px;">🌟 What to do next?</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:28px;">
      {"".join([f'''<div style="padding:12px 16px;background:#f9fafb;border-radius:10px;border-left:3px solid #6366f1;font-size:14px;color:#374151;">{tip}</div>''' for tip in [
          "📝 Use CareerPlanet AI to get personalized resume improvement suggestions.",
          "🎯 Explore similar roles that match your skill profile — new jobs are posted daily!",
          "📚 Enhance your skills with online certifications to strengthen future applications.",
          "💬 Use the AI Career Assistant to prepare better for your next interview.",
          "🔔 Set up job alerts for roles matching your experience on CareerPlanet."
      ]])}
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0;">
      <a href="http://localhost:5173/jobs" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:16px 40px;border-radius:50px;font-weight:700;font-size:15px;text-decoration:none;margin:4px;">
        🔍 Browse More Jobs
      </a>
      <a href="http://localhost:5173/resume" style="display:inline-block;background:#f3f4f6;color:#374151;padding:16px 40px;border-radius:50px;font-weight:700;font-size:15px;text-decoration:none;margin:4px;">
        📊 Improve My Resume
      </a>
    </div>

    <p style="text-align:center;font-size:14px;color:#6b7280;font-style:italic;">
      "Every rejection is a redirection to something better." — {BRAND_NAME} AI
    </p>
    """

    html = _base_template(content)
    return _send(student_email, f"Your application for {job_title} at {company_name} — Update", html)

def send_custom_message_email(
    student_email: str,
    student_name: str,
    job_title: str,
    company_name: str,
    recruiter_name: str,
    recruiter_message: str
) -> bool:
    """Send a custom text letter from the recruiter to the student."""
    first_name = student_name.split()[0] if student_name else "there"

    content = f"""
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:56px;margin-bottom:16px;">✉️</div>
      <h1 style="font-size:24px;font-weight:900;color:#111827;margin:0 0 8px;">
        New Message from {company_name}
      </h1>
      <p style="color:#6b7280;font-size:15px;margin:0;">
        Hi {first_name}, {recruiter_name} has sent you a message regarding your application for <strong>{job_title}</strong>.
      </p>
    </div>

    <!-- Message Box -->
    <div style="background:#f9fafb;border-left:3px solid #6366f1;border-radius:0 8px 8px 0;padding:24px;margin-bottom:28px;">
      <p style="font-size:15px;color:#374151;line-height:1.7;margin:0;white-space:pre-wrap;">{recruiter_message}</p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0;">
      <a href="http://localhost:5173/applications" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:16px 40px;border-radius:50px;font-weight:700;font-size:15px;text-decoration:none;margin:4px;">
        📝 View Your Applications
      </a>
    </div>
    """

    html = _base_template(content)
    return _send(student_email, f"New Message: Application for {job_title} at {company_name}", html)
