document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;

    function refreshIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // -----------------------------------------------------------------------
    // 1. Light (Paper) / Dark (Chalkboard) Theme Toggle
    // -----------------------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    function syncThemeIcon() {
        const icon = document.getElementById('theme-icon');
        if (!icon) return;
        const isDark = root.getAttribute('data-theme') === 'dark';
        icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
        refreshIcons();
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextDark = root.getAttribute('data-theme') !== 'dark';
            if (nextDark) {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.removeAttribute('data-theme');
            }
            try {
                localStorage.setItem('sendsnap_theme', nextDark ? 'dark' : 'light');
            } catch (_) {}
            syncThemeIcon();
        });
    }

    // -----------------------------------------------------------------------
    // 2. Mobile Menu Toggle
    // -----------------------------------------------------------------------
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

    // -----------------------------------------------------------------------
    // 3. OS Auto-Detection & Hero Download Switcher
    // -----------------------------------------------------------------------
    const platformConfig = {
        windows: {
            href: 'downloads/sendsnap-windows-x64.zip',
            download: 'sendsnap-windows-x64.zip',
            label: 'Download for Windows x64',
            meta: '.ZIP · 44.4 MB',
            external: false,
            btnClass: 'btn-cobalt btn-lg',
        },
        linux: {
            href: 'downloads/SendSnap-x86_64.AppImage',
            download: 'SendSnap-x86_64.AppImage',
            label: 'Download for Linux x64',
            meta: 'AppImage · 43.0 MB',
            external: false,
            btnClass: 'btn-cobalt btn-lg',
        },
        android: {
            href: 'https://play.google.com/store/apps/details?id=com.the356company.sendsnap',
            download: null,
            label: 'Google Play (Early Access)',
            meta: 'Android 7.0+',
            external: true,
            btnClass: 'btn-emerald btn-lg',
        },
    };

    function detectOS() {
        const ua = (navigator.userAgent || '').toLowerCase();
        if (/android/i.test(ua)) return 'android';
        if (/linux/i.test(ua) && !/android/i.test(ua)) return 'linux';
        return 'windows';
    }

    function selectPlatform(platform) {
        const cfg = platformConfig[platform] || platformConfig.windows;
        document.querySelectorAll('.os-chip').forEach(chip => {
            const active = chip.getAttribute('data-platform') === platform;
            chip.classList.toggle('active', active);
            chip.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        const btn = document.getElementById('hero-primary-btn');
        const label = document.getElementById('hero-btn-label');
        const meta = document.getElementById('hero-btn-meta');
        if (btn && label && meta) {
            btn.href = cfg.href;
            btn.className = cfg.btnClass;
            label.textContent = cfg.label;
            meta.textContent = cfg.meta;
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

        document.querySelectorAll('[data-dl-card]').forEach(card => {
            card.classList.toggle('is-highlighted', card.getAttribute('data-dl-card') === platform);
        });
    }

    document.querySelectorAll('.os-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            selectPlatform(chip.getAttribute('data-platform'));
        });
    });
    selectPlatform(detectOS());

    // -----------------------------------------------------------------------
    // 4. Interactive Hero Air-Grab Transfer Simulator
    // -----------------------------------------------------------------------
    const simFiles = document.querySelectorAll('.sim-file');
    const simGrabBtn = document.getElementById('sim-grab-btn');
    const simPacket = document.getElementById('sim-packet');
    const simPacketLabel = document.getElementById('sim-packet-label');
    const simStatus = document.getElementById('sim-status');
    const simSpeed = document.getElementById('sim-speed');
    const simRecvFile = document.getElementById('sim-recv-file');
    const simRecvPct = document.getElementById('sim-recv-pct');
    const simBarFill = document.getElementById('sim-bar-fill');
    const simLog = document.getElementById('sim-log');
    const simReceiver = document.getElementById('sim-receiver');

    let selectedFile = {
        name: '4K_Clip.mp4',
        size: '1.8 GB',
        speed: 96.4,
    };
    let simRunning = false;

    simFiles.forEach(btn => {
        btn.addEventListener('click', () => {
            simFiles.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedFile = {
                name: btn.getAttribute('data-file') || '4K_Clip.mp4',
                size: btn.getAttribute('data-size') || '1.8 GB',
                speed: parseFloat(btn.getAttribute('data-speed') || '96.4'),
            };
            if (simPacketLabel) simPacketLabel.textContent = selectedFile.name;
        });
    });

    function runAirGrabSimulation() {
        if (simRunning || !simBarFill) return;
        simRunning = true;

        const file = { ...selectedFile };
        if (simGrabBtn) simGrabBtn.disabled = true;
        if (simStatus) simStatus.textContent = 'GRABBED · :53318';
        if (simRecvFile) simRecvFile.textContent = `Receiving ${file.name} (${file.size})…`;
        if (simRecvPct) simRecvPct.textContent = '0%';
        if (simReceiver) simReceiver.classList.add('is-receiving');
        simBarFill.style.width = '0%';

        // Restart flying packet animation
        if (simPacket) {
            simPacket.classList.remove('flying');
            void simPacket.offsetWidth;
            simPacket.classList.add('flying');
        }

        const duration = 1250;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(1, elapsed / duration);
            // Smooth cubic ease-out progress
            const eased = 1 - Math.pow(1 - progress, 2.2);
            const pct = Math.round(eased * 100);

            simBarFill.style.width = `${pct}%`;
            if (simRecvPct) simRecvPct.textContent = `${pct}%`;
            if (simSpeed) {
                if (progress < 1) {
                    const liveRate = (file.speed + (Math.sin(now * 0.025) * 2.1)).toFixed(1);
                    simSpeed.textContent = `${liveRate} MB/s`;
                } else {
                    simSpeed.textContent = `${file.speed.toFixed(1)} MB/s peak`;
                }
            }

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                if (simStatus) simStatus.textContent = 'DONE · VERIFIED';
                if (simRecvFile) simRecvFile.textContent = `Received ${file.name}`;
                if (simLog) simLog.innerHTML = `Saved to: <code>Downloads/SendSnap/${file.name}</code>`;
                if (simGrabBtn) simGrabBtn.disabled = false;
                simRunning = false;
                setTimeout(() => {
                    if (!simRunning && simReceiver) {
                        simReceiver.classList.remove('is-receiving');
                    }
                }, 900);
            }
        }

        requestAnimationFrame(tick);
    }

    if (simGrabBtn) {
        simGrabBtn.addEventListener('click', runAirGrabSimulation);
    }

    // -----------------------------------------------------------------------
    // 5. Interactive 6-Shot Filmstrip Gallery
    // -----------------------------------------------------------------------
    const thumbs = Array.from(document.querySelectorAll('.film-thumb'));
    const mainImg = document.getElementById('gallery-main-img');
    const counter = document.getElementById('gallery-counter');
    const gTag = document.getElementById('gallery-tag');
    const gTitle = document.getElementById('gallery-title');
    const gDesc = document.getElementById('gallery-desc');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    let galleryIdx = 0;

    function setGalleryIndex(idx) {
        if (!thumbs.length) return;
        galleryIdx = (idx + thumbs.length) % thumbs.length;
        const activeThumb = thumbs[galleryIdx];

        thumbs.forEach((t, i) => {
            const isAct = i === galleryIdx;
            t.classList.toggle('active', isAct);
            t.setAttribute('aria-selected', isAct ? 'true' : 'false');
        });

        const src = activeThumb.getAttribute('data-src');
        const tag = activeThumb.getAttribute('data-tag');
        const title = activeThumb.getAttribute('data-title');
        const desc = activeThumb.getAttribute('data-desc');

        if (mainImg && src) {
            mainImg.src = src;
            mainImg.alt = title || 'SendSnap preview';
        }
        if (counter) counter.textContent = `0${galleryIdx + 1} / 0${thumbs.length}`;
        if (gTag && tag) gTag.textContent = tag;
        if (gTitle && title) gTitle.textContent = title;
        if (gDesc && desc) gDesc.textContent = desc;
    }

    thumbs.forEach((t, i) => {
        t.addEventListener('click', () => setGalleryIndex(i));
    });
    if (prevBtn) prevBtn.addEventListener('click', () => setGalleryIndex(galleryIdx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => setGalleryIndex(galleryIdx + 1));

    // -----------------------------------------------------------------------
    // 6. Interactive Protocol Node Inspector
    // -----------------------------------------------------------------------
    const protoDetails = {
        discover: '<strong>UDP Multicast (224.0.0.167:53317) + BLE Beacon:</strong> Broadcasts presence on your local subnet and falls back to fast HTTP subnet probing when routers block multicast.',
        pair: '<strong>Wi-Fi Direct / Local Hotspot + QR Fallback:</strong> No router nearby? Android starts a local peer-to-peer hotspot and displays a QR code for one-scan pairing, or connect via manual IP.',
        stream: '<strong>Raw HTTP/TCP Socket (:53318):</strong> Streams files in buffered chunks directly between peers with live throughput telemetry, per-file cancel, pause, and byte-accurate resume.',
        disk: '<strong>Saved to Downloads/SendSnap/:</strong> Files land uncompressed and bit-for-bit identical in your standard Downloads folder and appear immediately in the in-app Recents shelf.',
    };

    const protoNodes = document.querySelectorAll('.proto-node');
    const protoInspector = document.getElementById('proto-inspector');
    protoNodes.forEach(node => {
        node.addEventListener('click', () => {
            const key = node.getAttribute('data-proto');
            protoNodes.forEach(n => {
                const match = n === node;
                n.classList.toggle('active', match);
                n.setAttribute('aria-selected', match ? 'true' : 'false');
            });
            if (protoInspector && key && protoDetails[key]) {
                protoInspector.innerHTML = protoDetails[key];
            }
        });
    });

    // -----------------------------------------------------------------------
    // 7. Interactive Multilingual & RTL Preview
    // -----------------------------------------------------------------------
    const langSamples = {
        en: { dir: 'ltr', title: 'Ready to send & receive', sub: 'Wi-Fi Connected · 2 nearby' },
        fr: { dir: 'ltr', title: 'Prêt à envoyer et recevoir', sub: 'Wi-Fi connecté · 2 appareils proches' },
        ar: { dir: 'rtl', title: 'جاهز للإرسال والاستقبال', sub: 'متصل بشبكة Wi-Fi · جهازان قريبان' },
        es: { dir: 'ltr', title: 'Listo para enviar y recibir', sub: 'Wi-Fi conectado · 2 cercanos' },
    };

    const langBtns = document.querySelectorAll('.lang-btn');
    const langPreview = document.getElementById('lang-preview');
    const langTitle = document.getElementById('lang-title');
    const langSub = document.getElementById('lang-sub');

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.getAttribute('data-lang');
            const data = langSamples[code];
            if (!data) return;
            langBtns.forEach(b => b.classList.toggle('active', b === btn));
            if (langPreview) langPreview.setAttribute('dir', data.dir);
            if (langTitle) langTitle.textContent = data.title;
            if (langSub) langSub.textContent = data.sub;
        });
    });

    // -----------------------------------------------------------------------
    // 8. Interactive File-Size Transfer Time Calculator
    // -----------------------------------------------------------------------
    const sizeSlider = document.getElementById('size-slider');
    const sizeDisplay = document.getElementById('calc-size-display');
    const timeSS = document.getElementById('time-sendsnap');
    const timeCloud = document.getElementById('time-cloud');
    const timeBT = document.getElementById('time-bt');
    const timeChat = document.getElementById('time-chat');
    const barSS = document.getElementById('bar-sendsnap');
    const barCloud = document.getElementById('bar-cloud');
    const barBT = document.getElementById('bar-bt');
    const barChat = document.getElementById('bar-chat');

    function formatSeconds(sec) {
        if (sec < 60) return `~${Math.max(1, Math.round(sec))} sec`;
        const mins = Math.floor(sec / 60);
        const rem = Math.round(sec % 60);
        if (mins >= 60) {
            const hrs = Math.floor(mins / 60);
            const rMins = mins % 60;
            return `~${hrs} hr ${rMins} min`;
        }
        return rem > 0 ? `~${mins} min ${rem} sec` : `~${mins} min`;
    }

    function updateCalculator() {
        if (!sizeSlider) return;
        const gb = parseFloat(sizeSlider.value);
        const mb = gb * 1024;

        let hint = '(~4 min of 4K video)';
        if (gb <= 1.0) hint = '(~150 RAW photos)';
        else if (gb >= 6.0) hint = '(full project backup)';
        else if (gb >= 3.5) hint = '(~10 min of 4K video)';

        if (sizeDisplay) {
            const label = gb < 1 ? `${Math.round(mb)} MB` : `${gb.toFixed(1)} GB`;
            sizeDisplay.innerHTML = `${label} <span class="mono calc-hint">${hint}</span>`;
        }

        const ssSec = mb / 85.0;          // 85 MB/s real-world 5 GHz LAN
        const cloudSec = (mb / 6.25) * 2; // 50 Mbps up + 50 Mbps down
        const btSec = mb / 2.5;           // 2.5 MB/s Bluetooth

        if (timeSS) timeSS.textContent = formatSeconds(ssSec);
        if (timeCloud) timeCloud.textContent = formatSeconds(cloudSec);
        if (timeBT) timeBT.textContent = formatSeconds(btSec);

        const maxRef = btSec;
        if (barSS) barSS.style.width = `${Math.max(4, Math.min(100, (ssSec / maxRef) * 100))}%`;
        if (barCloud) barCloud.style.width = `${Math.max(12, Math.min(100, (cloudSec / maxRef) * 100))}%`;
        if (barBT) barBT.style.width = '100%';

        if (gb > 2.0) {
            if (timeChat) timeChat.textContent = 'Blocked (> 2 GB limit)';
            if (barChat) {
                barChat.style.width = '100%';
                barChat.className = 'calc-fill fill-warn';
            }
        } else {
            const chatSec = (mb / 5.0) * 2;
            if (timeChat) timeChat.textContent = `${formatSeconds(chatSec)} (compressed)`;
            if (barChat) {
                barChat.style.width = `${Math.max(16, Math.min(100, (chatSec / maxRef) * 100))}%`;
                barChat.className = 'calc-fill fill-muted';
            }
        }
    }

    if (sizeSlider) {
        sizeSlider.addEventListener('input', updateCalculator);
        updateCalculator();
    }

    // -----------------------------------------------------------------------
    // 9. FAQ Accordion
    // -----------------------------------------------------------------------
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

    // Init icons
    syncThemeIcon();
    refreshIcons();
});
