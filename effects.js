
// ── Scroll-Reveal IntersectionObserver (Gridline-style) ──────────────────────
(function initScrollReveal() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target); // fire once
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal, .reveal.slide-left').forEach(function(el) {
        observer.observe(el);
    });
})();

document.addEventListener('DOMContentLoaded', () => {
    // Skip 3D tilt on touch-only devices to prevent sticky transforms on mobile
    if (!window.matchMedia('(hover: hover)').matches) return;

    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

            // Set mouse position for the glow effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
});

// ── Project data with media + review ────────────────────────────────────────
const PROJECT_DATA = {
    loyalty: {
        tag:   'SaaS · Web App',
        year:  '2024',
        title: 'Loyalty Platform',
        desc:  'Full-stack loyalty & rewards system featuring a digital wallet, KYC onboarding, tier-based gamification, and real-time analytics for a leading retail chain.',
        stack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Stripe'],
        media: [
            'assets/Loyalty program1.jpeg',
            'assets/Loyalty program2.jpeg',
            'assets/Loyalty program3.jpeg',
            'assets/Loyalty program4.jpeg'
        ],
        reviews: [
            {
                name:     'Arjun Mehta',
                role:     'CTO — RetailMart India Pvt. Ltd.',
                initials: 'AM',
                color:    '#c0392b',
                stars:    5,
                date:     'Jan 2025',
                quote:    'GrowthForgeX delivered something our in-house team had been struggling with for months — and they did it clean. The gamification layer and wallet integration worked exactly as scoped, no last-minute surprises. Genuinely impressive technical work.'
            },
            {
                name:     'Sneha Kulkarni',
                role:     'Product Manager — RetailMart India',
                initials: 'SK',
                color:    '#b7580e',
                stars:    5,
                date:     'Jan 2025',
                quote:    'Communication throughout was excellent. They kept us updated at every milestone and were very patient when we kept changing requirements. The final product feels polished and our customers love using it.'
            },
            {
                name:     'Rohit Deshmukh',
                role:     'Head of Engineering — RetailMart India',
                initials: 'RD',
                color:    '#1a6a3a',
                stars:    5,
                date:     'Feb 2025',
                quote:    'The codebase they handed over was clean, well-documented, and easy for our team to pick up. Integrating with our existing systems was smoother than I expected. Would definitely work with them again.'
            }
        ]
    },
    dashboard: {
        tag:   'Dashboard · Analytics',
        year:  '2024',
        title: 'Enterprise Dashboard Suite',
        desc:  'Multi-level analytics platform with drill-down district maps, hierarchy management, real-time inventory tracking, and predictive stock alerts across 6 states.',
        stack: ['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Mapbox', 'Chart.js'],
        media: [
            'assets/Dashboard1.png',
            'assets/Dashboard2.png',
            'assets/Dashboard3.png',
            'assets/Dashboard4.png'
        ],
        reviews: [
            {
                name:     'Priya Raghunathan',
                role:     'VP Analytics — MedSupply Distributors Ltd.',
                initials: 'PR',
                color:    '#1a6ea8',
                stars:    5,
                date:     'Mar 2025',
                quote:    'Before this dashboard, our regional managers were working off Excel sheets that were days old. Now they have live data at every level — zone, district, stockist. The UX is clean and even our field reps who are not tech-savvy picked it up quickly.'
            },
            {
                name:     'Karthik Subramaniam',
                role:     'Director of Operations — MedSupply',
                initials: 'KS',
                color:    '#6d3a8a',
                stars:    5,
                date:     'Apr 2025',
                quote:    'The drill-down map feature alone changed how our zonal heads make decisions. GrowthForgeX understood the complexity of our hierarchy and translated it into something actually usable. Very happy with the outcome.'
            }
        ]
    },
    'brand-film': {
        tag:   'Video · Motion Graphics',
        year:  '2025',
        title: 'Brand Film Production',
        desc:  'End-to-end brand films from concept to final delivery — scripting, shoot direction, colour grading, motion graphics, and full sound design for multiple D2C labels.',
        stack: ['After Effects', 'Premiere Pro', 'DaVinci Resolve', 'Cinema 4D'],
        media: [
            'assets/nike_final.mp4',
            'assets/redbull-final.mp4',
            'assets/FRESH_Lemonade Final.mp4',
            'assets/Recording 2026-03-26 213631 (1).mp4'
        ],
        reviews: [
            {
                name:     'Vikram Nair',
                role:     'Head of Marketing — URBN Fashion Co.',
                initials: 'VN',
                color:    '#6d3a8a',
                stars:    5,
                date:     'Feb 2025',
                quote:    'We have worked with bigger production houses and honestly the quality here was better. GrowthForgeX understood our brand voice without us having to over-explain it. The final films felt authentic and well-crafted.'
            },
            {
                name:     'Ananya Iyer',
                role:     'Founder — FRESH Beverages',
                initials: 'AI',
                color:    '#c0392b',
                stars:    5,
                date:     'Mar 2025',
                quote:    'They took a rough brief and turned it into something that looked premium. The colour grading and sound design especially stood out. Our team was involved throughout and they were always open to feedback.'
            },
            {
                name:     'Siddharth Rao',
                role:     'Creative Director — RedBull India Campaigns',
                initials: 'SR',
                color:    '#b7580e',
                stars:    5,
                date:     'Jan 2025',
                quote:    'Fast turnaround without compromising on quality. The motion graphics were exactly the vibe we were going for. GrowthForgeX is one of those teams that just gets it — minimal back and forth, solid output.'
            }
        ]
    }
};

// ── Modal state ──────────────────────────────────────────────────────────────
let currentImages = [];
let currentIndex  = 0;

// ── Helpers ──────────────────────────────────────────────────────────────────
function renderStars(n) {
    return Array.from({ length: 5 }, (_, i) =>
        `<span class="review-star">${i < n ? '★' : '☆'}</span>`
    ).join('');
}

function populateReviewPanel(data) {
    document.getElementById('modal-tag').textContent   = data.tag;
    document.getElementById('modal-year').textContent  = data.year;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').textContent  = data.desc;

    // Tech stack chips
    document.getElementById('modal-stack').innerHTML = data.stack
        .map(s => `<span class="stack-chip">${s}</span>`)
        .join('');

    // Build each review card
    const listEl = document.getElementById('reviews-list');
    listEl.innerHTML = data.reviews.map(rev => `
        <div class="review-card">
            <div class="review-card-header">
                <div class="review-stars">${renderStars(rev.stars)}</div>
                <span class="review-verified">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Verified Client
                </span>
            </div>
            <blockquote class="review-quote">${rev.quote}</blockquote>
            <div class="review-author">
                <div class="review-avatar" style="background:${rev.color}">${rev.initials}</div>
                <div class="review-author-info">
                    <span class="review-name">${rev.name}</span>
                    <span class="review-role">${rev.role}</span>
                </div>
                <span class="review-date">${rev.date}</span>
            </div>
        </div>
    `).join('');
}

// ── Public functions ─────────────────────────────────────────────────────────
function openProject(projectType) {
    const data = PROJECT_DATA[projectType];
    if (!data) return;

    currentImages = data.media;
    currentIndex  = 0;

    populateReviewPanel(data);
    updateModalMedia();

    // Build dots
    const indicator = document.getElementById('image-indicator');
    indicator.innerHTML = '';
    currentImages.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        indicator.appendChild(dot);
    });

    document.getElementById('project-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProject() {
    const video = document.getElementById('modal-video');
    video.pause();
    video.src = '';
    document.getElementById('project-modal').style.display = 'none';
    document.body.style.overflow = ''; // restore CSS default (overflow: hidden)
}

function changeImage(step) {
    currentIndex = (currentIndex + step + currentImages.length) % currentImages.length;
    updateModalMedia();
}

function updateModalMedia() {
    const modalImg = document.getElementById('modal-image');
    const modalVid = document.getElementById('modal-video');
    const dots      = document.querySelectorAll('.dot');
    const mediaPath = currentImages[currentIndex];
    const isVideo   = mediaPath.endsWith('.mp4');

    modalImg.style.opacity = '0';
    modalVid.style.opacity = '0';

    setTimeout(() => {
        if (isVideo) {
            modalImg.style.display = 'none';
            modalVid.style.display = 'block';
            modalVid.src = mediaPath;
            modalVid.play();
            modalVid.style.opacity = '1';
        } else {
            modalVid.style.display = 'none';
            modalVid.pause();
            modalVid.src = '';
            modalImg.style.display = 'block';
            modalImg.src = mediaPath;
            modalImg.style.opacity = '1';
        }
        dots.forEach((dot, i) => {
            dot.className = `dot ${i === currentIndex ? 'active' : ''}`;
        });
    }, 180);
}
