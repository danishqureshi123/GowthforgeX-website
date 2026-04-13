/**
 * GrowthForgeX — Transition & Animation Engine
 * Lightweight overlay-based page transitions — no iframe, no blur filters
 */

document.addEventListener('DOMContentLoaded', () => {
    createTransitionOverlay();
    setupPageTransitions();
    animateCardsEntrance();
    createGlitterCanvas();
    revealPageIn();
    hideSplineBadges();
});

// ─── Hide "Built with Spline" badge — inject CSS into each shadow root ────────
function hideSplineBadges() {
    const viewers = document.querySelectorAll('spline-viewer');
    if (!viewers.length) return;

    viewers.forEach(viewer => {
        function injectHideStyle(shadow) {
            // Bail if we already injected
            if (shadow.querySelector('#gfx-hide-badge')) return;
            const s = document.createElement('style');
            s.id = 'gfx-hide-badge';
            s.textContent = '#logo,a[href*="spline"],a[href*="spline.design"],[class*="logo"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}';
            shadow.appendChild(s);
        }

        // Poll until the shadow root exists, then inject + watch for future nodes
        const probe = setInterval(() => {
            const shadow = viewer.shadowRoot;
            if (!shadow) return;
            clearInterval(probe);
            injectHideStyle(shadow);
            // MutationObserver catches badge nodes added after initial render
            new MutationObserver(() => injectHideStyle(shadow))
                .observe(shadow, { childList: true, subtree: true });
        }, 50);
    });
}

// ─── Overlay element (reused for every transition) ───────────────────────────
let overlay;

function createTransitionOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.style.cssText = [
        'position:fixed',
        'inset:0',
        'z-index:99999',
        'background:#050505',
        'pointer-events:none',
        'opacity:1',                         // starts opaque (covers flash on load)
        'transition:opacity 0.32s ease'
    ].join(';');
    document.body.appendChild(overlay);
}

// ─── On every page load: overlay starts opaque → fades out (reveal) ──────────
function revealPageIn() {
    // tiny delay so the page has painted before we reveal
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.style.opacity = '0';
        });
    });
}

// ─── Page Transitions ─────────────────────────────────────────────────────────
function setupPageTransitions() {
    let transitioning = false;

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.includes('javascript')) return;

        link.addEventListener('click', e => {
            e.preventDefault();
            if (transitioning) return;
            transitioning = true;

            const destination = href;

            // Card press feel
            const card = link.closest('.card') || (link.classList.contains('card') ? link : null);
            if (card) {
                card.style.transition = 'transform 0.12s ease';
                card.style.transform  = 'scale(0.93) translateY(4px)';
            }

            const pressDelay = card ? 100 : 0;

            setTimeout(() => {
                // Step 1 — current page scales back (cheap transform only, no blur)
                document.body.style.transition  = 'transform 0.38s cubic-bezier(0.4,0,1,1), opacity 0.38s ease';
                document.body.style.transform   = 'scale(0.92) translateY(-18px)';
                document.body.style.opacity     = '0.15';
                document.body.style.pointerEvents = 'none';

                // Step 2 — overlay fades in over the receding page
                setTimeout(() => {
                    overlay.style.transition = 'opacity 0.22s ease';
                    overlay.style.opacity    = '1';
                }, 180);

                // Step 3 — navigate once fully covered
                setTimeout(() => {
                    window.location.href = destination;
                }, 420);

            }, pressDelay);
        });
    });
}

// ─── Staggered Card Entrance ──────────────────────────────────────────────────
function animateCardsEntrance() {
    const cards = document.querySelectorAll('.bottom-cards-section .card');
    cards.forEach((card, i) => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(36px) scale(0.96)';
        card.style.transition = 'none';
        setTimeout(() => {
            card.style.transition = 'transform 0.50s cubic-bezier(0.22,1,0.36,1), opacity 0.40s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0) scale(1)';
        }, 220 + i * 65);
    });
}

// ─── Glitter Canvas ───────────────────────────────────────────────────────────
function createGlitterCanvas() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = [
        'position:fixed', 'top:0', 'left:0',
        'width:100%', 'height:100%',
        'pointer-events:none',
        'z-index:0',
        'opacity:0.45'
    ].join(';');
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let W, H, particles, animId;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        buildParticles();
    }

    function buildParticles() {
        // 15 on mobile, 30 on desktop
        const count = window.innerWidth <= 768 ? 15 : 30;
        particles = Array.from({ length: count }, () => ({
            x:       Math.random() * W,
            y:       Math.random() * H,
            r:       Math.random() * 1.2 + 0.3,
            speed:   Math.random() * 0.18 + 0.04,
            opacity: Math.random(),
            opDir:   Math.random() > 0.5 ? 1 : -1,
            opSpeed: Math.random() * 0.006 + 0.002,
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        for (const p of particles) {
            p.y -= p.speed;
            if (p.y < -4) p.y = H + 4;
            p.opacity += p.opDir * p.opSpeed;
            if (p.opacity >= 0.85) { p.opacity = 0.85; p.opDir = -1; }
            if (p.opacity <= 0.04) { p.opacity = 0.04; p.opDir =  1; }

            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        animId = requestAnimationFrame(draw);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(animId);
        else animId = requestAnimationFrame(draw);
    });

    window.addEventListener('resize', resize, { passive: true });
    resize();
    draw();
}

// ─── Deferred PDF Download ────────────────────────────────────────────────────
let pdfLoaded = false;
let brochureAuthorized = false;
let authStatusStylesInjected = false;

// Replace with your deployed Google Apps Script Web App URL that appends rows to a Sheet
const BROCHURE_CAPTURE_URL = 'https://script.google.com/macros/s/AKfycby_5nPm9D1GHGFLAE4kwZ5DyC9c80nvxnG2QP_l1lU0mcUPqflRM6K_lr8OxIPIUCHu2Q/exec';
// Google OAuth client ID (Google Identity Services)
const GOOGLE_CLIENT_ID = '166398935590-f12a2rje617t169oj3tih09peto3vqmv.apps.googleusercontent.com';

let gsiLoaded = false;

// Restore auth state per session
if (sessionStorage.getItem('brochureAuthorized') === '1') {
    brochureAuthorized = true;
}

function forceDownloadPDF(e) {
    e.preventDefault();
    if (!brochureAuthorized) {
        _showBrochureAuthModal();
        return;
    }
    if (pdfLoaded) { _doPDFDownload(); return; }

    const btn  = e.currentTarget;
    const orig = btn.innerHTML;
    btn.innerHTML = orig.replace('Download', 'Loading…');
    btn.style.opacity = '0.7';

    const s   = document.createElement('script');
    s.src     = 'pdf_base64.js';
    s.onload  = () => {
        pdfLoaded = true;
        btn.innerHTML = orig;
        btn.style.opacity = '1';
        _doPDFDownload();
    };
    s.onerror = () => {
        btn.innerHTML = orig;
        btn.style.opacity = '1';
        const a = document.createElement('a');
        a.href = 'GrowthForgeX Brouchre.pdf';
        a.download = 'GrowthForgeX Brochure.pdf';
        a.click();
    };
    document.head.appendChild(s);
}

function _doPDFDownload() {
    const a = document.createElement('a');
    if (typeof window.getPDFBase64 === 'function') {
        a.href = 'data:application/pdf;base64,' + window.getPDFBase64();
    } else if (typeof window.PDF_BASE64 !== 'undefined') {
        a.href = 'data:application/pdf;base64,' + window.PDF_BASE64;
    } else {
        a.href = 'GrowthForgeX Brouchre.pdf';
    }
    a.download = 'GrowthForgeX Brochure.pdf';
    a.click();
}

function _ensureAuthStatusStyles() {
    if (authStatusStylesInjected) return;
    authStatusStylesInjected = true;
    const style = document.createElement('style');
    style.textContent = `
      .auth-status-pill {
        position: fixed;
        top: 14px;
        right: 14px;
        background: rgba(15,15,18,0.92);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 12px;
        padding: 10px 14px;
        font-family: 'Outfit', sans-serif;
        font-size: 0.9rem;
        box-shadow: 0 12px 30px rgba(0,0,0,0.35);
        z-index: 200001;
        display: flex;
        gap: 8px;
        align-items: center;
        opacity: 0;
        transform: translateY(-6px);
        transition: opacity 0.25s ease, transform 0.25s ease;
      }
      .auth-status-pill.show {
        opacity: 1;
        transform: translateY(0);
      }
      .auth-status-pill .dot {
        width: 10px; height: 10px;
        border-radius: 50%;
        background: #27c93f;
        box-shadow: 0 0 12px rgba(39,201,63,0.6);
      }
    `;
    document.head.appendChild(style);
}

function _showAuthStatus(provider, contact) {
    _ensureAuthStatusStyles();
    const existing = document.getElementById('auth-status-pill');
    const pill = existing || document.createElement('div');
    pill.id = 'auth-status-pill';
    pill.className = 'auth-status-pill';

    let who = '';
    if (provider === 'google') {
        who = contact.email || contact.name || contact.sub || 'Google user';
    } else if (provider === 'phone') {
        who = contact || 'Verified phone';
    } else {
        who = 'Signed in';
    }
    pill.innerHTML = `<span class="dot"></span><span>Signed in via ${provider}: ${who}</span>`;
    document.body.appendChild(pill);

    requestAnimationFrame(() => pill.classList.add('show'));
    setTimeout(() => pill.classList.remove('show'), 6000);
}

async function _sendBrochureCapture(data) {
    if (!BROCHURE_CAPTURE_URL || BROCHURE_CAPTURE_URL.startsWith('<YOUR_')) return;
    try {
        await fetch(BROCHURE_CAPTURE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                ts: new Date().toISOString(),
                userAgent: navigator.userAgent || ''
            })
        });
    } catch (err) {
        // swallow errors silently; download should not be blocked
        console.warn('Capture failed', err);
    }
}

// ── Booking form capture to Sheet ───────────────────────────────────────────
function _initBookingFormCapture() {
    const forms = document.querySelectorAll('form.contact-form-container');
    forms.forEach((form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pl = {
                type: 'meet_request',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                company: '',
                service: '',
                brief: '',
                timestamp: new Date().toISOString(),
                path: window.location.pathname
            };

            const fields = form.querySelectorAll('input, textarea, select');
            fields.forEach((field) => {
                const label = (field.placeholder || field.name || '').toLowerCase();
                const val = field.value || '';
                if (label.includes('first')) pl.firstName = val;
                else if (label.includes('last')) pl.lastName = val;
                else if (label.includes('email')) pl.email = val;
                else if (label.includes('phone') || label.includes('mobile')) pl.phone = val;
                else if (label.includes('company') || label.includes('organization')) pl.company = val;
                else if (label.includes('service')) pl.service = val;
                else if (field.tagName === 'TEXTAREA' || label.includes('brief') || label.includes('message')) pl.brief = val;
            });

            await _sendBrochureCapture(pl);

            // Simple UX feedback
            const btn = form.querySelector('button[type="submit"], .submit-btn');
            if (btn) {
                const prev = btn.textContent;
                btn.textContent = 'Request Sent';
                btn.disabled = true;
                setTimeout(() => { btn.textContent = prev; btn.disabled = false; }, 2600);
            }
        });
    });
}

// ── Lightweight auth modal (Google / mobile) ────────────────────────────────
let brochureModalInjected = false;

function _ensureBrochureModalStyles() {
    if (brochureModalInjected) return;
    brochureModalInjected = true;
    const style = document.createElement('style');
    style.textContent = `
        .brochure-auth-backdrop {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.65);
            backdrop-filter: blur(6px);
            z-index: 200000;
            display: grid; place-items: center;
            padding: 20px;
        }
        .brochure-auth-card {
            width: min(420px, 94vw);
            background: #0f0f12;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 18px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.45);
            padding: 22px 20px 18px;
            color: #fff;
            font-family: 'Outfit', sans-serif;
        }
        .brochure-auth-title {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .brochure-auth-text {
            color: rgba(255,255,255,0.75);
            line-height: 1.55;
            margin-bottom: 16px;
        }
        .brochure-auth-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .brochure-btn {
            flex: 1 1 100%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            border: 1px solid rgba(255,255,255,0.25);
            background: rgba(255,255,255,0.08);
            color: #fff;
            padding: 12px 14px;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
        }
        .brochure-btn:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.12); }
        .brochure-btn.google { background: linear-gradient(90deg,#4285F4,#34A853,#FBBC05,#EA4335); color: #0f0f12; border: none; }
        .brochure-btn.google span { background: #fff; color: #222; padding: 4px 8px; border-radius: 8px; font-weight: 700; }
        .brochure-input {
            width: 100%;
            background: #18181d;
            border: 1px solid rgba(255,255,255,0.14);
            color: #fff;
            border-radius: 10px;
            padding: 12px 12px;
            margin-bottom: 10px;
            font-size: 0.95rem;
        }
        .brochure-hint { font-size: 0.82rem; color: rgba(255,255,255,0.55); margin-bottom: 10px; }
        .brochure-submit {
            width: 100%;
            background: #FF0000;
            color: #fff;
            border: none;
            border-radius: 12px;
            padding: 12px 14px;
            font-weight: 700;
            letter-spacing: 0.4px;
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        .brochure-submit:hover { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(255,0,0,0.25); }
    `;
    document.head.appendChild(style);
}

function _ensureGSIScript() {
    if (gsiLoaded || document.getElementById('gsi-client')) return;
    const s = document.createElement('script');
    s.id = 'gsi-client';
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => { gsiLoaded = true; };
    document.head.appendChild(s);
}

function _startGoogleSignIn() {
    return new Promise((resolve, reject) => {
        if (!GOOGLE_CLIENT_ID) {
            reject(new Error('Missing GOOGLE_CLIENT_ID'));
            return;
        }
        if (!gsiLoaded) {
            const check = setInterval(() => {
                if (window.google && window.google.accounts && window.google.accounts.id) {
                    clearInterval(check);
                    proceed();
                }
            }, 50);
            setTimeout(() => {
                if (!window.google || !window.google.accounts || !window.google.accounts.id) {
                    clearInterval(check);
                    reject(new Error('Google Identity not loaded'));
                }
            }, 5000);
        } else {
            proceed();
        }

        function proceed() {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response) => {
                    try {
                        const jwt = response.credential;
                        // Decode payload for email (no verification here; for gating only)
                        const payload = JSON.parse(atob(jwt.split('.')[1]));
                        resolve(payload);
                    } catch (err) {
                        resolve({ sub: 'google-oauth' });
                    }
                },
                auto_select: false,
                cancel_on_tap_outside: true,
            });
            window.google.accounts.id.prompt((notif) => {
                if (notif && notif.isNotDisplayed()) reject(new Error('Prompt not displayed'));
                if (notif && notif.isSkippedMoment()) reject(new Error('Prompt skipped'));
            });
        }
    });
}

function _showBrochureAuthModal() {
    _ensureBrochureModalStyles();
    _ensureGSIScript();

    const backdrop = document.createElement('div');
    backdrop.className = 'brochure-auth-backdrop';

    const card = document.createElement('div');
    card.className = 'brochure-auth-card';
    card.innerHTML = `
        <div class="brochure-auth-title">Access the brochure</div>
        <div class="brochure-auth-text">
            Sign in or verify your number to download the latest GrowthForgeX brochure.
        </div>
        <div class="brochure-auth-actions">
            <button class="brochure-btn google" id="brochure-google">
                <span>G</span> Continue with Google
            </button>
            <div class="brochure-hint">Or verify with mobile</div>
            <input type="tel" class="brochure-input" id="brochure-phone" placeholder="Enter mobile number">
            <button class="brochure-submit" id="brochure-phone-submit">Verify & Download</button>
        </div>
    `;
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

function authorizeAndDownload(provider, contact) {
    brochureAuthorized = true;
    sessionStorage.setItem('brochureAuthorized', '1');
    const payload = {
        type: 'download',
        name: provider === 'google' && contact && contact.name ? contact.name : '',
        email: provider === 'google' ? (contact && (contact.email || contact.sub) || '') : '',
        phone: provider === 'phone' ? contact : '',
        brochure: 'GrowthForgeX Brochure',
        timestamp: new Date().toISOString(),
        path: window.location.pathname
    };
    _sendBrochureCapture(payload);
    _showAuthStatus(provider, contact);
    backdrop.remove();
    if (pdfLoaded) _doPDFDownload(); else {
        const fakeEvent = { preventDefault: () => {}, currentTarget: null };
        forceDownloadPDF(fakeEvent);
    }
    }

    card.querySelector('#brochure-google').addEventListener('click', async () => {
        try {
            const profile = await _startGoogleSignIn();
            authorizeAndDownload('google', profile || {});
        } catch (err) {
            console.warn('Google sign-in failed', err);
        }
    });

    const phoneInput = card.querySelector('#brochure-phone');
    const phoneBtn   = card.querySelector('#brochure-phone-submit');
    phoneBtn.addEventListener('click', () => {
        const val = (phoneInput.value || '').trim();
        if (val.length < 8) {
            phoneInput.focus();
            phoneInput.style.borderColor = '#ff5555';
            return;
        }
        authorizeAndDownload('phone', val);
    });
}

// Initialize booking form capture on DOM ready
document.addEventListener('DOMContentLoaded', _initBookingFormCapture);
