import logging
import resend
from .config import settings

logger = logging.getLogger("solvane.email")


def _get_base_html(title: str, preheader: str, body_content: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#F3F4F6; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#111827; -webkit-font-smoothing:antialiased;">
  <!-- Preheader text (hidden, shown in email clients) -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">{preheader}</div>

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F3F4F6; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%;">

          <!-- Logo Header -->
          <tr>
            <td style="padding:0 24px 24px 24px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div style="display:inline-flex; align-items:center; gap:8px;">
                      <span style="display:inline-block; width:32px; height:32px; background-color:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; text-align:center; line-height:32px; font-size:16px;">🛡️</span>
                      <span style="font-size:18px; font-weight:800; color:#111827; letter-spacing:-0.025em;">Solvane</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="padding:0 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color:#FFFFFF; border:1px solid #E5E7EB; border-radius:16px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);">
                <tr>
                  <!-- Blue accent bar at top -->
                  <td style="height:4px; background:linear-gradient(90deg, #2563EB 0%, #4F46E5 100%);"></td>
                </tr>
                <tr>
                  <td style="padding:36px 36px 32px 36px;">
                    {body_content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 24px 0 24px; text-align:center;">
              <p style="margin:0 0 6px 0; font-size:12px; color:#9CA3AF; line-height:1.5;">
                © 2025 Solvane Inc. · AI-Powered Security Testing Platform
              </p>
              <p style="margin:0; font-size:11px; color:#D1D5DB; line-height:1.5;">
                If you didn't request this, you can safely ignore this email — no action is required.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def _send_email(to: str, subject: str, html_content: str) -> bool:
    api_key = settings.RESEND_API_KEY.strip()

    # Dev Mode Fallback Logging when Resend Key is not configured
    if not api_key or "placeholder" in api_key.lower() or "your_" in api_key.lower():
        logger.info(f"[DEV EMAIL LOG] To: {to} | Subject: '{subject}'")
        try:
            print("\n=======================================================")
            print(f"[EMAIL SIMULATOR] To: {to}")
            print(f"Subject: {subject}")
            print(f"From: {settings.EMAIL_FROM}")
            print("=======================================================\n")
        except Exception:
            pass
        return True

    try:
        resend.api_key = api_key
        params = {
            "from": settings.EMAIL_FROM,
            "to": [to],
            "subject": subject,
            "html": html_content,
        }
        response = resend.Emails.send(params)
        logger.info(f"Email sent successfully via Resend to {to}. ID: {response.get('id')}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to} via Resend: {str(e)}")
        try:
            print(f"[RESEND ERROR] Could not send email to {to}: {str(e)}")
        except Exception:
            pass
        return False


def send_verification_email(to: str, token: str) -> bool:
    verify_url = f"{settings.FRONTEND_URL.rstrip('/')}/verify-email?token={token}"

    body = f"""
      <!-- Icon -->
      <div style="text-align:center; margin-bottom:24px;">
        <div style="display:inline-block; width:56px; height:56px; background-color:#EFF6FF; border:1px solid #BFDBFE; border-radius:50%; text-align:center; line-height:56px; font-size:24px;">✉️</div>
      </div>

      <h1 style="font-size:22px; font-weight:700; color:#111827; margin:0 0 8px 0; text-align:center; letter-spacing:-0.025em;">Verify your email address</h1>
      <p style="font-size:14px; color:#6B7280; line-height:1.6; margin:0 0 28px 0; text-align:center;">
        Click the button below to confirm your Solvane account and unlock automated security scanning.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center; margin:0 0 28px 0;">
        <a href="{verify_url}"
          style="display:inline-block; background-color:#2563EB; color:#FFFFFF; font-size:15px; font-weight:600; text-decoration:none; padding:14px 32px; border-radius:10px; letter-spacing:-0.01em; box-shadow:0 4px 6px -1px rgba(37,99,235,0.3);">
          Verify Solvane Account
        </a>
      </div>

      <!-- Link expires notice -->
      <div style="background-color:#F9FAFB; border:1px solid #E5E7EB; border-radius:8px; padding:12px 16px; margin-bottom:24px; text-align:center;">
        <p style="margin:0; font-size:12px; color:#6B7280;">
          ⏱️ This link expires in <strong style="color:#111827;">24 hours</strong>
        </p>
      </div>

      <!-- Fallback link -->
      <p style="font-size:12px; color:#9CA3AF; margin:0; line-height:1.6; text-align:center;">
        Or copy and paste this URL into your browser:<br>
        <a href="{verify_url}" style="color:#2563EB; word-break:break-all; text-decoration:none;">{verify_url}</a>
      </p>
    """

    html = _get_base_html("Verify your Solvane account", "Confirm your email to activate your Solvane account.", body)
    return _send_email(to, "Verify your Solvane account ✉️", html)


def send_password_reset_email(to: str, token: str) -> bool:
    reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?token={token}"

    body = f"""
      <!-- Icon -->
      <div style="text-align:center; margin-bottom:24px;">
        <div style="display:inline-block; width:56px; height:56px; background-color:#FEF3C7; border:1px solid #FCD34D; border-radius:50%; text-align:center; line-height:56px; font-size:24px;">🔑</div>
      </div>

      <h1 style="font-size:22px; font-weight:700; color:#111827; margin:0 0 8px 0; text-align:center; letter-spacing:-0.025em;">Reset your password</h1>
      <p style="font-size:14px; color:#6B7280; line-height:1.6; margin:0 0 24px 0; text-align:center;">
        We received a request to reset the password on your Solvane account.<br>
        Click the button below to choose a new password.
      </p>

      <!-- Expiry warning alert -->
      <div style="background-color:#FEF3C7; border:1px solid #FCD34D; border-radius:10px; padding:14px 18px; margin-bottom:28px;">
        <p style="margin:0; font-size:13px; color:#92400E; line-height:1.5;">
          ⏰ <strong>This link expires in 1 hour.</strong> If you don't reset your password within that time, you'll need to request a new link.
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center; margin:0 0 28px 0;">
        <a href="{reset_url}"
          style="display:inline-block; background-color:#2563EB; color:#FFFFFF; font-size:15px; font-weight:600; text-decoration:none; padding:14px 32px; border-radius:10px; letter-spacing:-0.01em; box-shadow:0 4px 6px -1px rgba(37,99,235,0.3);">
          Reset Password
        </a>
      </div>

      <!-- Security notice -->
      <div style="background-color:#F0FDF4; border:1px solid #BBF7D0; border-radius:10px; padding:14px 18px; margin-bottom:24px;">
        <p style="margin:0; font-size:12px; color:#166534; line-height:1.6;">
          🔒 <strong>Security tip:</strong> We will never ask for your password via email. If you didn't request this reset, your account is safe — just ignore this email. For extra security, consider enabling two-factor authentication.
        </p>
      </div>

      <!-- Fallback link -->
      <p style="font-size:12px; color:#9CA3AF; margin:0; line-height:1.6; text-align:center;">
        Or copy and paste this URL into your browser:<br>
        <a href="{reset_url}" style="color:#2563EB; word-break:break-all; text-decoration:none;">{reset_url}</a>
      </p>
    """

    html = _get_base_html("Reset your Solvane password", "You requested a password reset for your Solvane account.", body)
    return _send_email(to, "Reset your Solvane password 🔑", html)


def send_welcome_email(to: str, name: str) -> bool:
    dashboard_url = f"{settings.FRONTEND_URL.rstrip('/')}/dashboard"
    first_name = name.split()[0] if name else "there"

    body = f"""
      <!-- Icon -->
      <div style="text-align:center; margin-bottom:24px;">
        <div style="display:inline-block; width:56px; height:56px; background-color:#F0FDF4; border:1px solid #86EFAC; border-radius:50%; text-align:center; line-height:56px; font-size:24px;">✅</div>
      </div>

      <h1 style="font-size:22px; font-weight:700; color:#111827; margin:0 0 8px 0; text-align:center; letter-spacing:-0.025em;">You're all set, {first_name}!</h1>
      <p style="font-size:14px; color:#6B7280; line-height:1.6; margin:0 0 24px 0; text-align:center;">
        Your Solvane account is verified and ready to run automated security audits on your websites, APIs, and mobile apps.
      </p>

      <!-- Feature list -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td style="padding:12px 16px; background-color:#F9FAFB; border:1px solid #E5E7EB; border-radius:10px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:6px 0;">
                  <p style="margin:0; font-size:13px; color:#374151; line-height:1.5;">
                    🌐 <strong>Website Scanner</strong> — Full-surface DOM crawl, TLS &amp; CSP audits, header analysis
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0; border-top:1px solid #F3F4F6;">
                  <p style="margin:0; font-size:13px; color:#374151; line-height:1.5;">
                    ⚡ <strong>API Scanner</strong> — OpenAPI &amp; GraphQL fuzzer for BOLA, auth bypass, and data leaks
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0; border-top:1px solid #F3F4F6;">
                  <p style="margin:0; font-size:13px; color:#374151; line-height:1.5;">
                    📱 <strong>APK Scanner</strong> — Static &amp; dynamic Android bytecode analysis for hardcoded secrets
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- CTA Button -->
      <div style="text-align:center; margin:0 0 16px 0;">
        <a href="{dashboard_url}"
          style="display:inline-block; background-color:#2563EB; color:#FFFFFF; font-size:15px; font-weight:600; text-decoration:none; padding:14px 32px; border-radius:10px; letter-spacing:-0.01em; box-shadow:0 4px 6px -1px rgba(37,99,235,0.3);">
          Go to Dashboard →
        </a>
      </div>

      <p style="font-size:12px; color:#9CA3AF; margin:0; text-align:center;">
        Questions? Reply to this email — we're happy to help.
      </p>
    """

    html = _get_base_html("Welcome to Solvane", f"Your Solvane account is now active, {first_name}!", body)
    return _send_email(to, f"Welcome to Solvane, {first_name}! 🎉", html)
