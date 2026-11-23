document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle (Light / Dark Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    function syncThemeIcon() {
        const icon = document.getElementById('theme-icon');
        if (!icon) return;
        const isDark = root.getAttribute('data-theme') === 'dark';
        icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = root.getAttribute('data-theme') === 'dark';
            const nextTheme = isDark ? 'light' : 'dark';
            if (nextTheme === 'dark') {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.removeAttribute('data-theme');
            }
            try {
                localStorage.setItem('sendsnap_theme', nextTheme);
            } catch (_) {}
            syncThemeIcon();
        });
    }

    // 2. Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
            });
        });
    }

    // 3. Navbar Scroll Elevation
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.style.boxShadow = 'var(--shadow-card)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        }, { passive: true });
    }

    // 4. Download Station Platform Tabs & OS Auto-Detection
    function detectPlatform() {
        const ua = (navigator.userAgent || '').toLowerCase();
        if (/android/i.test(ua)) return 'android';
        if (/linux/i.test(ua) && !/android/i.test(ua)) return 'linux';
        if (/win/i.test(ua)) return 'windows';
        return 'windows';
    }

    function switchStationTab(platform) {
        const tabs = document.querySelectorAll('.station-tab');
        const panels = document.querySelectorAll('.station-panel');

        tabs.forEach(tab => {
            const matches = tab.getAttribute('data-platform') === platform;
            tab.classList.toggle('active', matches);
            tab.setAttribute('aria-selected', matches ? 'true' : 'false');
        });

        panels.forEach(panel => {
            const matches = panel.getAttribute('id') === `panel-${platform}`;
            panel.classList.toggle('active', matches);
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    const stationTabs = document.querySelectorAll('.station-tab');
    if (stationTabs.length > 0) {
        stationTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const platform = tab.getAttribute('data-platform');
                if (platform) {
                    switchStationTab(platform);
                }
            });
        });

        // Auto-select detected OS
        const detected = detectPlatform();
        switchStationTab(detected);
    }

    // 5. FAQ Accordion
    const faqRows = document.querySelectorAll('.faq-row');
    faqRows.forEach(row => {
        const trigger = row.querySelector('.faq-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                const isOpen = row.classList.contains('active');
                faqRows.forEach(other => other.classList.remove('active'));
                if (!isOpen) {
                    row.classList.add('active');
                }
            });
        }
    });

    // 6. Smooth Scroll for Internal Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    syncThemeIcon();
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
