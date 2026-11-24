document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const open = navMenu.classList.toggle('show');
            mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 2. OS Auto-Detection & Hero Download Switcher
    const platforms = {
        windows: {
            href: 'downloads/sendsnap-windows-x64.zip',
            download: 'sendsnap-windows-x64.zip',
            title: 'Download for Windows x64',
            sub: '.ZIP · 44.4 MB',
            cls: 'btn btn-primary btn-lg',
        },
        linux: {
            href: 'downloads/SendSnap-x86_64.AppImage',
            download: 'SendSnap-x86_64.AppImage',
            title: 'Download for Linux x64',
            sub: 'AppImage · 43.0 MB',
            cls: 'btn btn-primary btn-lg',
        },
        android: {
            href: 'https://play.google.com/store/apps/details?id=com.the356company.sendsnap',
            download: null,
            title: 'Google Play (Early Access)',
            sub: 'Android 7.0+',
            cls: 'btn btn-receive btn-lg',
        },
    };

    function detectOS() {
        const ua = (navigator.userAgent || '').toLowerCase();
        if (/android/i.test(ua)) return 'android';
        if (/linux/i.test(ua) && !/android/i.test(ua)) return 'linux';
        return 'windows';
    }

    function selectPlatform(os) {
        const cfg = platforms[os] || platforms.windows;
        document.querySelectorAll('.os-tab').forEach(tab => {
            const active = tab.getAttribute('data-platform') === os;
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        const btn = document.getElementById('hero-dl-btn');
        const title = document.getElementById('hero-dl-title');
        const sub = document.getElementById('hero-dl-sub');
        if (btn && title && sub) {
            btn.href = cfg.href;
            btn.className = cfg.cls;
            title.textContent = cfg.title;
            sub.textContent = cfg.sub;
            if (cfg.download) {
                btn.setAttribute('download', cfg.download);
                btn.removeAttribute('target');
                btn.removeAttribute('rel');
            } else {
                btn.removeAttribute('download');
                btn.setAttribute('target', '_blank');
                btn.setAttribute('rel', 'noopener noreferrer');
            }
        }

        document.querySelectorAll('[data-dl]').forEach(card => {
            card.classList.toggle('is-highlighted', card.getAttribute('data-dl') === os);
        });
    }

    document.querySelectorAll('.os-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            selectPlatform(tab.getAttribute('data-platform'));
        });
    });
    selectPlatform(detectOS());

    // 3. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-q');
        if (!trigger) return;
        trigger.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            faqItems.forEach(other => {
                other.classList.remove('active');
                const btn = other.querySelector('.faq-q');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
            if (!wasActive) {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
