from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Response, Request, status, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from ..config import settings
from ..database import get_db
from ..models import User, Session as UserSession
from ..schemas import (
    UserSignup, UserLogin, UserResponse, TokenResponse,
    ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest, MessageResponse
)
from ..auth import (
    hash_password, verify_password, hash_token,
    create_access_token, create_refresh_token_session,
    create_verification_token, decode_verification_token,
    create_password_reset_token, decode_password_reset_token,
    get_current_user
)
from ..email_service import (
    send_verification_email,
    send_password_reset_email,
    send_welcome_email
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Rate-limiting simple in-memory tracker (5 attempts per 15 min per IP/email)
_LOGIN_ATTEMPTS = {}  # key: f"{ip}:{email}", value: list of timestamps

def check_login_rate_limit(request: Request, email: str):
    client_ip = request.client.host if request.client else "127.0.0.1"
    key = f"{client_ip}:{email.lower()}"
    now = datetime.now(timezone.utc).timestamp()
    fifteen_mins_ago = now - (15 * 60)

    attempts = _LOGIN_ATTEMPTS.get(key, [])
    attempts = [t for t in attempts if t > fifteen_mins_ago]
    
    if len(attempts) >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please wait 15 minutes before trying again."
        )
    attempts.append(now)
    _LOGIN_ATTEMPTS[key] = attempts


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserSignup, response: Response, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Create new user
    user = User(
        name=payload.name,
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        company=payload.company,
        email_verified=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate verification token & send verification email
    verify_token = create_verification_token(user.id)
    send_verification_email(user.email, verify_token)

    # Generate JWT & Refresh Session
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token_session(db, user.id)

    # Set httpOnly cookie for refresh_token
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,  # Set to True in HTTPS production
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, request: Request, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        check_login_rate_limit(request, payload.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Reset attempts on successful login
    client_ip = request.client.host if request.client else "127.0.0.1"
    key = f"{client_ip}:{payload.email.lower()}"
    _LOGIN_ATTEMPTS.pop(key, None)

    # Create session tokens
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token_session(db, user.id)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user)
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")

    token_hash = hash_token(refresh_token)
    session_rec = db.query(UserSession).filter(
        UserSession.refresh_token_hash == token_hash,
        UserSession.revoked == False,
        UserSession.expires_at > datetime.now(timezone.utc)
    ).first()

    if not session_rec:
        response.delete_cookie("refresh_token")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session")

    user = db.query(User).filter(User.id == session_rec.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    new_access_token = create_access_token(user.id)
    return TokenResponse(
        access_token=new_access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user)
    )


@router.post("/logout", response_model=MessageResponse)
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        token_hash = hash_token(refresh_token)
        session_rec = db.query(UserSession).filter(UserSession.refresh_token_hash == token_hash).first()
        if session_rec:
            session_rec.revoked = True
            db.commit()

    response.delete_cookie("refresh_token")
    return MessageResponse(message="Successfully logged out")


@router.get("/verify-email", response_model=MessageResponse)
def verify_email(token: str = Query(...), db: Session = Depends(get_db)):
    user_id = decode_verification_token(token)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.email_verified = True
    db.commit()

    # Send welcome email after verification success
    send_welcome_email(user.email, user.name)
    return MessageResponse(message="Email address successfully verified!")


@router.post("/resend-verification", response_model=MessageResponse)
def resend_verification(current_user: User = Depends(get_current_user)):
    if current_user.email_verified:
        return MessageResponse(message="Email is already verified.")

    verify_token = create_verification_token(current_user.id)
    send_verification_email(current_user.email, verify_token)
    return MessageResponse(message=f"Verification email resent to {current_user.email}")


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user:
        # Don't leak user existence for security
        return MessageResponse(message="If an account exists for that email, a password reset link has been sent.")

    reset_token = create_password_reset_token(user.id)
    send_password_reset_email(user.email, reset_token)
    return MessageResponse(message="If an account exists for that email, a password reset link has been sent.")


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user_id = decode_password_reset_token(payload.token)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Update password
    user.password_hash = hash_password(payload.new_password)

    # Invalidate ALL existing refresh token sessions for this user (forces re-login everywhere)
    db.query(UserSession).filter(UserSession.user_id == user.id).update({"revoked": True})
    db.commit()

    return MessageResponse(message="Password successfully reset. Please log in with your new password.")


# ─── OAuth Endpoint Handlers (GitHub & Google) ────────────────────────────────
@router.get("/oauth/github")
def oauth_github_redirect():
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="GitHub OAuth not configured in backend settings")
    github_url = f"https://github.com/login/oauth/authorize?client_id={settings.GITHUB_CLIENT_ID}&redirect_uri={settings.get_github_callback_url}&scope=user:email"
    return RedirectResponse(url=github_url)


@router.get("/oauth/google")
def oauth_google_redirect():
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Google OAuth not configured in backend settings")
    google_url = f"https://accounts.google.com/o/oauth2/v2/auth?client_id={settings.GOOGLE_CLIENT_ID}&response_type=code&scope=openid%20email%20profile&redirect_uri={settings.get_google_callback_url}&access_type=offline"
    return RedirectResponse(url=google_url)


@router.get("/callback/github")
def oauth_github_callback(code: str = Query(None), error: str = Query(None), response: Response = None, db: Session = Depends(get_db)):
    """Real GitHub OAuth callback — exchanges the code for an access token and upserts the user."""
    import httpx

    # Handle provider-side error or user denial
    if error or not code:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_cancelled")

    # 1. Exchange code for GitHub access token
    token_res = httpx.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.get_github_callback_url,
        },
        timeout=10,
    )
    if not token_res.is_success:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_token_failed")

    token_data = token_res.json()
    gh_access_token = token_data.get("access_token")
    if not gh_access_token:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_token_missing")

    # 2. Fetch user profile from GitHub
    user_res = httpx.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {gh_access_token}", "Accept": "application/json"},
        timeout=10,
    )
    if not user_res.is_success:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_profile_failed")

    gh_user = user_res.json()
    gh_id = str(gh_user.get("id", ""))
    gh_name = gh_user.get("name") or gh_user.get("login") or "GitHub User"
    gh_email = gh_user.get("email")

    # If GitHub doesn't return a public email, fetch from the emails endpoint
    if not gh_email:
        emails_res = httpx.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {gh_access_token}", "Accept": "application/json"},
            timeout=10,
        )
        if emails_res.is_success:
            emails = emails_res.json()
            primary = next((e["email"] for e in emails if e.get("primary") and e.get("verified")), None)
            gh_email = primary or next((e["email"] for e in emails if e.get("verified")), None)

    if not gh_email:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_no_email")

    gh_email = gh_email.lower()

    # 3. Upsert user in DB
    user = db.query(User).filter(User.email == gh_email).first()
    if user:
        user.oauth_provider = "github"
        user.oauth_id = f"github_{gh_id}"
        user.email_verified = True
        db.commit()
    else:
        user = User(
            name=gh_name,
            email=gh_email,
            oauth_provider="github",
            oauth_id=f"github_{gh_id}",
            email_verified=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 4. Issue tokens and redirect to frontend
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token_session(db, user.id)

    redirect_target = f"{settings.FRONTEND_URL}?token={access_token}"
    res = RedirectResponse(url=redirect_target)
    res.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
    )
    return res


@router.get("/callback/google")
def oauth_google_callback(code: str = Query(None), error: str = Query(None), response: Response = None, db: Session = Depends(get_db)):
    """Real Google OAuth callback — exchanges the code for an ID token and upserts the user."""
    import httpx

    if error or not code:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_cancelled")

    # 1. Exchange authorization code for Google tokens
    token_res = httpx.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.get_google_callback_url,
            "grant_type": "authorization_code",
        },
        timeout=10,
    )
    if not token_res.is_success:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_token_failed")

    token_data = token_res.json()
    google_access_token = token_data.get("access_token")
    if not google_access_token:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_token_missing")

    # 2. Fetch user profile from Google
    user_res = httpx.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {google_access_token}"},
        timeout=10,
    )
    if not user_res.is_success:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_profile_failed")

    goog_user = user_res.json()
    goog_id = str(goog_user.get("id", ""))
    goog_name = goog_user.get("name") or "Google User"
    goog_email = goog_user.get("email")
    goog_verified = goog_user.get("verified_email", False)

    if not goog_email or not goog_verified:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_email_unverified")

    goog_email = goog_email.lower()

    # 3. Upsert user in DB
    user = db.query(User).filter(User.email == goog_email).first()
    if user:
        user.oauth_provider = "google"
        user.oauth_id = f"google_{goog_id}"
        user.email_verified = True
        db.commit()
    else:
        user = User(
            name=goog_name,
            email=goog_email,
            oauth_provider="google",
            oauth_id=f"google_{goog_id}",
            email_verified=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 4. Issue tokens and redirect to frontend
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token_session(db, user.id)

    redirect_target = f"{settings.FRONTEND_URL}?token={access_token}"
    res = RedirectResponse(url=redirect_target)
    res.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
    )
    return res


@router.get("/oauth/callback-mock")
def oauth_mock_callback(provider: str, email: str, name: str, response: Response, db: Session = Depends(get_db)):
    """Simulated OAuth callback for frontend testing when OAuth keys are not present."""
    email_clean = email.lower()
    user = db.query(User).filter(User.email == email_clean).first()
    linked = False

    if user:
        user.oauth_provider = provider
        user.oauth_id = f"{provider}_{email_clean}"
        user.email_verified = True
        linked = True
        db.commit()
    else:
        user = User(
            name=name,
            email=email_clean,
            oauth_provider=provider,
            oauth_id=f"{provider}_{email_clean}",
            email_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token_session(db, user.id)

    redirect_target = f"{settings.FRONTEND_URL}?token={access_token}&linked={str(linked).lower()}"
    res = RedirectResponse(url=redirect_target)
    res.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )
    return res


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
