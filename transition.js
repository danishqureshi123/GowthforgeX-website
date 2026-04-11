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
});

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

function forceDownloadPDF(e) {
    e.preventDefault();
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
