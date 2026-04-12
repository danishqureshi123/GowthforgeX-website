/**
 * GrowthForgeX — Page Loader
 * Full-screen loading overlay with progress counter (0→100) over 2.5s
 * Each page gets its own themed background image from Unsplash CDN
 */

// ── Per-page config ───────────────────────────────────────────────────────────
const PAGE_LOADER_CONFIG = {
    'index.html': {
        label:    'Home',
        tagline:  'Building the future, one line at a time.',
        image:    'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1400&q=75&fit=crop',
        // dark tech/code abstract
    },
    'about.html': {
        label:    'About Us',
        tagline:  'A team built to disrupt.',
        image:    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=75&fit=crop',
        // team collaboration
    },
    'services.html': {
        label:    'Our Services',
        tagline:  'Precision-crafted solutions.',
        image:    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=75&fit=crop',
        // analytics / dashboard dark
    },
    'portfolio.html': {
        label:    'Portfolio',
        tagline:  'Work that speaks for itself.',
        image:    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1400&q=75&fit=crop',
        // creative design screen
    },
    'contact.html': {
        label:    'Contact',
        tagline:  'Let\'s build something great.',
        image:    'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1400&q=75&fit=crop',
        // phone / communication
    },
    'hire.html': {
        label:    'Career',
        tagline:  'Your next expert is here.',
        image:    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=75&fit=crop',
        // laptop working professional
    },
};

// ── Detect current page ───────────────────────────────────────────────────────
function getCurrentPage() {
    // Normalize pathname (supports cleanUrls like /about -> about.html)
    const path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    let file = path.split('/').pop() || '';

    // Root -> index.html
    if (file === '' || file === '/') file = 'index';

    // If no extension (clean URL), append .html
    if (!file.includes('.')) file += '.html';

    return file;
}

// ── Build loader HTML ─────────────────────────────────────────────────────────
function buildLoader(config) {
    const el = document.createElement('div');
    el.id = 'gfx-loader';
    el.innerHTML = `
        <div class="gfx-loader-bg" id="gfx-loader-bg"></div>
        <div class="gfx-loader-overlay"></div>

        <div class="gfx-loader-content">
            <div class="gfx-loader-logo">
                Growth<span>ForgeX</span>
                <div class="gfx-rocket-trail" id="gfx-rocket-trail"></div>
                <div class="gfx-rocket" id="gfx-rocket">🚀</div>
            </div>

            <div class="gfx-loader-page-label" id="gfx-loader-label">
                ${config.label}
            </div>

            <div class="gfx-loader-tagline" id="gfx-loader-tagline">
                ${config.tagline}
            </div>

            <div class="gfx-loader-bar-wrap">
                <div class="gfx-loader-bar-track">
                    <div class="gfx-loader-bar-fill" id="gfx-loader-bar"></div>
                </div>
                <div class="gfx-loader-counter" id="gfx-loader-counter">0</div>
            </div>

            <div class="gfx-loader-status" id="gfx-loader-status">Initializing...</div>
        </div>
    `;
    return el;
}

// ── Inject styles ─────────────────────────────────────────────────────────────
function injectLoaderStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Hide page content while loader is active to avoid flashes */
        html.gfx-loading body {
            visibility: hidden;
        }

        #gfx-loader {
            position: fixed;
            inset: 0;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            font-family: 'Outfit', sans-serif;
        }

        /* Background image */
        .gfx-loader-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            transform: scale(1.08);
            transition: transform 2.8s ease;
            filter: brightness(0.28) saturate(0.7);
        }
        #gfx-loader.loaded .gfx-loader-bg {
            transform: scale(1.0);
        }

        /* Dark gradient overlay */
        .gfx-loader-overlay {
            position: absolute;
            inset: 0;
            background:
                linear-gradient(135deg, rgba(5,5,5,0.88) 0%, rgba(20,0,0,0.70) 60%, rgba(5,5,5,0.88) 100%),
                radial-gradient(ellipse at 60% 40%, rgba(255,0,0,0.10) 0%, transparent 65%);
        }

        /* Content */
        .gfx-loader-content {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0;
            text-align: center;
            padding: 0 24px;
            width: 100%;
            max-width: 520px;
        }

        /* Logo — relative so rocket can launch from its center */
        .gfx-loader-logo {
            position: relative;
            overflow: visible;
            font-size: 1.05rem;
            font-weight: 700;
            color: rgba(255,255,255,0.35);
            letter-spacing: 0.06em;
            text-transform: uppercase;
            margin-bottom: 28px;
            opacity: 0;
            transform: translateY(-12px);
            animation: loaderFadeUp 0.5s ease 0.1s both;
        }
        .gfx-loader-logo span { color: #FF0000; }

        /* Page label */
        .gfx-loader-page-label {
            font-size: clamp(2.4rem, 7vw, 4.2rem);
            font-weight: 700;
            color: #FFFFFF;
            letter-spacing: -2px;
            line-height: 1.05;
            margin-bottom: 12px;
            opacity: 0;
            transform: translateY(20px);
            animation: loaderFadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.2s both;
        }

        /* Tagline */
        .gfx-loader-tagline {
            font-size: 0.92rem;
            color: rgba(255,255,255,0.42);
            letter-spacing: 0.02em;
            margin-bottom: 44px;
            opacity: 0;
            animation: loaderFadeUp 0.5s ease 0.35s both;
        }

        /* Progress bar */
        .gfx-loader-bar-wrap {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 14px;
            opacity: 0;
            animation: loaderFadeUp 0.5s ease 0.45s both;
        }

        .gfx-loader-bar-track {
            flex: 1;
            height: 3px;
            background: rgba(255,255,255,0.08);
            border-radius: 3px;
            overflow: hidden;
            position: relative;
        }

        .gfx-loader-bar-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #cc0000, #FF0000, #ff4444);
            border-radius: 3px;
            transition: width 0.04s linear;
            position: relative;
        }

        /* Glowing tip on the progress bar */
        .gfx-loader-bar-fill::after {
            content: '';
            position: absolute;
            right: -1px;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #ff4444;
            box-shadow: 0 0 8px 3px rgba(255,0,0,0.7);
        }

        .gfx-loader-counter {
            font-size: 0.82rem;
            font-weight: 700;
            color: #FF0000;
            letter-spacing: 0.04em;
            width: 34px;
            text-align: right;
            font-variant-numeric: tabular-nums;
        }

        /* Status text */
        .gfx-loader-status {
            font-size: 0.70rem;
            color: rgba(255,255,255,0.22);
            letter-spacing: 0.10em;
            text-transform: uppercase;
            opacity: 0;
            animation: loaderFadeUp 0.4s ease 0.55s both;
            min-height: 18px;
        }

        /* ── Rocket — launches from the center of the GrowthForgeX logo ── */
        .gfx-rocket {
            position: absolute;
            /* horizontally centred over the logo text */
            left: 50%;
            /* sits right at the top edge of the logo line */
            bottom: 100%;
            transform: translateX(-50%) translateY(0px) rotate(-45deg);
            font-size: 1.75rem;
            line-height: 1;
            pointer-events: none;
            z-index: 10;
            filter: drop-shadow(0 0 10px rgba(255,100,0,1));
        }

        /* Flame trail — anchored at the logo, grows upward as rocket rises */
        .gfx-rocket-trail {
            position: absolute;
            left: 50%;
            bottom: 100%;
            transform: translateX(-50%);
            width: 3px;
            height: 0;   /* JS sets this */
            /* gradient: bright orange at bottom fading to transparent at top */
            background: linear-gradient(to top,
                rgba(255,80,0,0.85),
                rgba(255,160,40,0.45),
                rgba(255,220,80,0.10),
                transparent
            );
            border-radius: 3px;
            pointer-events: none;
            z-index: 9;
        }

        /* Exit animation */
        #gfx-loader.gfx-loader-exit {
            animation: loaderExit 0.45s cubic-bezier(0.4, 0, 0.8, 0.6) both;
        }

        @keyframes loaderFadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes loaderExit {
            0%   { opacity: 1; transform: scale(1) translateY(0); }
            100% { opacity: 0; transform: scale(0.95) translateY(-20px); }
        }

        /* Mobile notice modal */
        .gfx-mobile-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.75);
            backdrop-filter: blur(6px);
            z-index: 999998;
            display: grid;
            place-items: center;
            padding: 24px;
        }
        .gfx-mobile-card {
            width: min(420px, 96vw);
            background: #0d0d0f;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 18px;
            box-shadow: 0 18px 50px rgba(0,0,0,0.45);
            padding: 22px 20px 18px;
            color: #fff;
            font-family: 'Outfit', sans-serif;
            text-align: left;
        }
        .gfx-mobile-title {
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 8px;
            color: #ffffff;
        }
        .gfx-mobile-text {
            font-size: 0.95rem;
            color: rgba(255,255,255,0.75);
            line-height: 1.5;
            margin-bottom: 14px;
        }
        .gfx-mobile-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            flex-wrap: wrap;
        }
        .gfx-btn {
            border: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.06);
            color: #fff;
            padding: 10px 14px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
        }
        .gfx-btn:hover {
            border-color: rgba(255,255,255,0.35);
            background: rgba(255,255,255,0.12);
        }
        .gfx-btn-primary {
            border-color: rgba(255,0,0,0.7);
            background: rgba(255,0,0,0.14);
        }
        .gfx-btn-primary:hover {
            background: rgba(255,0,0,0.22);
        }
    `;
    document.head.appendChild(style);
}

// Show mobile development notice once per session
function showMobileNotice() {
    const isMobile = ('ontouchstart' in window) || window.matchMedia('(max-width: 900px)').matches;
    if (!isMobile) return;
    if (sessionStorage.getItem('gfx-mobile-notice') === '1') return;
    sessionStorage.setItem('gfx-mobile-notice', '1');

    const backdrop = document.createElement('div');
    backdrop.className = 'gfx-mobile-backdrop';

    const card = document.createElement('div');
    card.className = 'gfx-mobile-card';
    card.innerHTML = `
        <div class="gfx-mobile-title">Mobile build in progress</div>
        <div class="gfx-mobile-text">
            We’re still crafting the mobile experience. For a smooth, full-featured ride, please open this on desktop for now.
        </div>
    `;
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
}

function isPreviewHost() {
    return /\.vercel\.app$/i.test(window.location.hostname);
}

// ── Status messages per progress checkpoint ───────────────────────────────────
const STATUS_MESSAGES = [
    { at:  0,  text: 'Initializing...' },
    { at: 20,  text: 'Loading assets...' },
    { at: 45,  text: 'Preparing scene...' },
    { at: 70,  text: 'Almost there...' },
    { at: 90,  text: 'Finalizing...' },
    { at: 100, text: 'Ready.' },
];

// ── Easing: ease-out quad ─────────────────────────────────────────────────────
function easeOutQuad(t) { return 1 - (1 - t) * (1 - t); }

// ── Main init ─────────────────────────────────────────────────────────────────
(function initLoader() {
    const page   = getCurrentPage();
    const config = PAGE_LOADER_CONFIG[page] || PAGE_LOADER_CONFIG['index.html'];

    injectLoaderStyles();
    document.documentElement.classList.add('gfx-loading');

    const loader = buildLoader(config);
    document.documentElement.appendChild(loader);

    // Set background image
    const bg = document.getElementById('gfx-loader-bg');
    bg.style.backgroundImage = `url('${config.image}')`;

    // Trigger slow zoom on bg
    requestAnimationFrame(() => loader.classList.add('loaded'));

    // ── Animate progress 0 → 100 over 2500ms ─────────────────────────────────
    const DURATION  = 2500;
    const start     = performance.now();
    const barEl     = document.getElementById('gfx-loader-bar');
    const counterEl = document.getElementById('gfx-loader-counter');
    const statusEl  = document.getElementById('gfx-loader-status');

    // Rocket elements — live inside the logo div, launch upward from there
    const rocketEl  = document.getElementById('gfx-rocket');
    const trailEl   = document.getElementById('gfx-rocket-trail');

    // How far the rocket travels (px) over the full load duration
    const TRAVEL_PX = window.innerHeight * 0.42;

    function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / DURATION, 1);
        const eased    = easeOutQuad(progress);
        const pct      = Math.round(eased * 100);

        // Update bar & counter
        barEl.style.width       = pct + '%';
        counterEl.textContent   = pct;

        // ── Rocket: translate upward from the logo (linear so it feels steady) ──
        if (rocketEl) {
            const upPx   = progress * TRAVEL_PX;  // linear — no rush at the start
            // Gentle left-right wobble for a realistic launch arc
            const wobble = Math.sin(elapsed / 200) * 5;
            rocketEl.style.transform =
                `translateX(calc(-50% + ${wobble}px)) translateY(-${upPx}px) rotate(-45deg)`;

            // Trail: bottom stays at logo, height grows to reach the rocket
            const trailH = Math.max(0, upPx - 24); // 24px gap between nozzle & trail top
            trailEl.style.height    = trailH + 'px';
            // Fade the trail out as rocket nears the top so it doesn't look weird
            const trailOpacity = Math.max(0, 1 - (eased * eased));
            trailEl.style.opacity   = trailOpacity;
        }

        // Update status message
        for (let i = STATUS_MESSAGES.length - 1; i >= 0; i--) {
            if (pct >= STATUS_MESSAGES[i].at) {
                statusEl.textContent = STATUS_MESSAGES[i].text;
                break;
            }
        }

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            // Hold at 100 for 300ms, then exit
            counterEl.textContent = '100';
            barEl.style.width = '100%';
            statusEl.textContent = 'Ready.';

            setTimeout(() => {
                loader.classList.add('gfx-loader-exit');
                setTimeout(() => {
                    loader.remove();
                    document.documentElement.classList.remove('gfx-loading');
                    if (isPreviewHost()) {
                        showMobileNotice();
                    }
                }, 460);
            }, 300);
        }
    }

    requestAnimationFrame(tick);
})();
