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

    // 2. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
            });
        });
    }

    // 3. Header Scroll Elevation
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // 4. Platform Download Tabs & OS Auto-Detection
    function detectPlatform() {
        const ua = (navigator.userAgent || '').toLowerCase();
        if (/android/i.test(ua)) return 'android';
        if (/linux/i.test(ua) && !/android/i.test(ua)) return 'linux';
        if (/win/i.test(ua)) return 'windows';
        return 'windows';
    }

    function switchPlatformTab(platform) {
        const tabs = document.querySelectorAll('.platform-tab');
        const panels = document.querySelectorAll('.platform-panel');

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

    const platformTabs = document.querySelectorAll('.platform-tab');
    if (platformTabs.length > 0) {
        platformTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const platform = tab.getAttribute('data-platform');
                if (platform) {
                    switchPlatformTab(platform);
                }
            });
        });

        // Set default based on detected OS
        const detected = detectPlatform();
        switchPlatformTab(detected);
    }

    // 5. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(other => other.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // 6. Smooth Scroll for Internal Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
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
