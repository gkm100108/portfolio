document.addEventListener('DOMContentLoaded', () => {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  applyBrandMeta(data.brand);
  mountWorkspace(data);
  setupPointerTracking();
  runIntroSwarm(data.agents, () => {
    startChoreography(data);
  });
});

/* =========================================================
   0. 브랜딩 메타·파비콘 적용 & DOM 유틸리티
   ========================================================= */
function applyBrandMeta(brand) {
  const fullTitle = `${brand.name} — ${brand.tagline}`;
  document.title = fullTitle;

  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.type = 'image/svg+xml';
  favicon.href = './favicon.svg';

  let metaTitle = document.querySelector('meta[name="title"]');
  if (!metaTitle) {
    metaTitle = document.createElement('meta');
    metaTitle.name = 'title';
    document.head.appendChild(metaTitle);
  }
  metaTitle.content = fullTitle;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = `${brand.name}: ${brand.tagline} ${brand.description}`;
}

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, val]) => {
    if (key === 'className') node.className = val;
    else if (key === 'text') node.textContent = val;
    else if (key === 'dataset') Object.assign(node.dataset, val);
    else if (key === 'style') Object.assign(node.style, val);
    else node.setAttribute(key, val);
  });
  children.forEach((child) => {
    if (child == null) return;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

/* =========================================================
   1. 전체 워크스페이스 DOM 마운트 (사람 실루엣 제외, 전체 섹션 복구)
   ========================================================= */
function mountWorkspace(data) {
  const { brand, profile, marquee, about, projects, experience, deploys, skills, contact } = data;
  document.body.replaceChildren();

  const introSplash = el('div', { className: 'intro-splash', id: 'intro-splash', 'aria-hidden': 'true' }, [
    el('div', { className: 'intro-core-orb' }, [el('span', { text: 'GM' })]),
    el('canvas', { id: 'intro-canvas' })
  ]);

  const hud = el('div', { className: 'build-hud', id: 'build-hud' }, [
    el('span', { className: 'hud-dot' }),
    el('span', { id: 'hud-text', text: `${brand.name} // AGENTS BUILDING...` })
  ]);
  const trailCanvas = el('canvas', { className: 'cursor-trail-canvas', id: 'cursor-trail-canvas', 'aria-hidden': 'true' });
  const cursorStage = el('div', { className: 'cursor-stage', id: 'cursor-stage', 'aria-hidden': 'true' });

  const header = el('header', { className: 'site-header' }, [
    el('div', { className: 'pill-nav' }, [
      el('a', { className: 'brand', href: '#top', 'aria-label': brand.name }, [
        el('span', { className: 'brand-dot' }),
        el('span', { className: 'brand-main', text: brand.mainName }),
        el('span', { className: 'brand-sub', text: brand.subName })
      ]),
      el('nav', { className: 'nav-links', 'aria-label': '주요 섹션' }, [
        el('a', { href: '#about', text: 'About' }),
        el('a', { href: '#projects', text: 'Work' }),
        el('a', { href: '#experience', text: 'Impact' }),
        el('a', { href: '#skills', text: 'Stack' }),
        el('a', { href: '#contact', text: 'Contact' })
      ]),
      el('div', { className: 'header-actions' }, [
        el('button', { type: 'button', className: 'btn-pill', id: 'skip-build-btn', text: 'SKIP' }),
        el('button', { type: 'button', className: 'btn-pill btn-pill-red', id: 'replay-build-btn', text: 'REPLAY' })
      ])
    ])
  ]);

  // 1) HERO (중앙 사람 카드 없이 좌·우 2열 균형 배치)
  const heroLeft = el(
    'div',
    { className: 'hero-left-card build-block', dataset: { wireLabel: 'LAYOUT // IDENTITY', agent: 'layout' } },
    [
      el('h1', { className: 'hero-display-name', text: profile.name }),
      el('span', { className: 'badge-red', text: profile.role }),
      el('p', { className: 'hero-location', text: brand.name }),
      el(
        'div',
        { className: 'hero-links' },
        profile.links.map((l, idx) =>
          el('a', {
            className: `hero-link-chip${idx === 0 ? ' is-primary' : ''}`,
            href: l.url,
            target: '_blank',
            rel: 'noopener noreferrer',
            text: `${l.label} ↗`
          })
        )
      )
    ]
  );

  const heroRight = el(
    'div',
    { className: 'hero-right-card build-block', dataset: { wireLabel: 'DEVELOPMENT // OVERVIEW_STATS', agent: 'development' } },
    [
      el('span', { className: 'eyebrow', text: 'CURRENTLY' }),
      el('h2', { className: 'hero-headline', dataset: { typeText: profile.headline }, text: profile.headline }),
      el('p', { className: 'hero-summary', text: profile.summary }),
      el(
        'div',
        { className: 'hero-stats' },
        profile.stats.map((s) =>
          el('div', { className: 'stat-box' }, [
            el('span', { className: 'stat-value', text: s.value }),
            el('span', { className: 'stat-label', text: s.label })
          ])
        )
      )
    ]
  );

  const heroSection = el('section', { className: 'section hero-section', id: 'hero', dataset: { agent: 'layout' } }, [
    el('div', { className: 'container' }, [
      el('div', { className: 'hero-giant-title', 'aria-hidden': 'true', text: 'PORTFOLIO' }),
      el('div', { className: 'hero-stage-grid' }, [heroLeft, heroRight])
    ])
  ]);

  // 마퀴 티커
  const marqueeItems = [...marquee, ...marquee].map((item) => el('span', { className: 'marquee-item', text: item }));
  const marqueeSection = el('section', { className: 'marquee-wrap', 'aria-label': '핵심 역량 티커' }, [
    el('div', { className: 'marquee-track' }, marqueeItems)
  ]);

  // 2) Background & Philosophy
  const philosophyLead = el('p', {
    className: 'philosophy-lead build-block',
    dataset: { wireLabel: 'DESIGN // PHILOSOPHY_STATEMENT', agent: 'design' }
  });
  appendHighlightedText(philosophyLead, about.lead);

  const aboutSection = el('section', { className: 'section', id: 'about', dataset: { agent: 'design' } }, [
    el('div', { className: 'container' }, [
      el('div', { className: 'section-split' }, [
        el('div', { className: 'section-side build-block', dataset: { wireLabel: 'LAYOUT // SECTION_01', agent: 'layout' } }, [
          el('span', { className: 'eyebrow', text: '01 / ABOUT' }),
          el('h2', { className: 'section-heading' }, ['Background &', el('br'), 'Philosophy'])
        ]),
        el('div', { className: 'section-body' }, [
          philosophyLead,
          el(
            'div',
            { className: 'strengths-grid' },
            about.cards.map((c, idx) =>
              el(
                'article',
                { className: 'strength-card build-block', dataset: { wireLabel: `DESIGN // PILLAR_0${idx + 1}`, agent: 'design' } },
                [
                  el('h3', { text: c.title }),
                  el('p', { text: c.description }),
                  el('div', { className: 'tag-list' }, c.tags.map((t) => el('span', { className: 'tag', text: t })))
                ]
              )
            )
          )
        ])
      ])
    ])
  ]);

  // 3) THINGS I'VE SHIPPED.
  const projectsSection = el('section', { className: 'section', id: 'projects', dataset: { agent: 'development' } }, [
    el('div', { className: 'container' }, [
      el('div', { className: 'section-header-row build-block', dataset: { wireLabel: 'DEVELOPMENT // SHIPPED_HEADER', agent: 'development' } }, [
        el('div', {}, [
          el('span', { className: 'eyebrow', text: '02 / SELECTED WORK' }),
          el('h2', { className: 'display-title' }, ["THINGS I'VE", el('br'), el('span', { className: 'text-red', text: 'SHIPPED.' })])
        ]),
        el('p', { className: 'section-subcopy', text: 'UI/UX 설계부터 React 컴포넌트 구현과 인터랙션까지 직접 완성한 프로젝트입니다.' })
      ]),
      el(
        'div',
        { className: 'projects-list' },
        projects.map((p, idx) =>
          el(
            'article',
            { className: 'project-row build-block', dataset: { wireLabel: `DEVELOPMENT // SHIP_0${idx + 1}`, agent: 'development' } },
            [
              el('div', { className: 'project-row-left' }, [
                el('h3', { className: 'project-row-title', text: p.title })
              ]),
              el('div', { className: 'project-row-center' }, [
                el('p', { className: 'project-desc', text: p.description }),
                el('div', { className: 'tag-list' }, p.techStack.map((t) => el('span', { className: 'tag', text: t })))
              ]),
              el('div', { className: 'project-row-right' }, [
                el('span', { className: 'project-metric', text: p.metric }),
                el('span', { className: 'project-metric-sub', text: p.metricSub }),
                el('a', {
                  className: 'project-period-link',
                  href: p.url,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  text: `${p.period} ↗`
                })
              ])
            ]
          )
        )
      )
    ])
  ]);

  // 4) FAST HANDS. REAL RESULTS. + 0%->100% 카운터
  const experienceSection = el('section', { className: 'section', id: 'experience', dataset: { agent: 'motion' } }, [
    el('div', { className: 'container' }, [
      el('div', { className: 'experience-layout' }, [
        el('div', { className: 'experience-highlight build-block', dataset: { wireLabel: 'MOTION // IMPACT_COUNTER', agent: 'motion' } }, [
          el('span', { className: 'eyebrow', text: '03 / IMPACT' }),
          el('h2', { className: 'display-title' }, ['FAST HANDS.', el('br'), el('span', { className: 'text-red', text: 'REAL RESULTS.' })]),
          el('div', { className: 'big-metric', id: 'impact-counter', dataset: { targetPercent: String(experience.targetPercent) }, text: '0%' }),
          el('p', { className: 'section-subcopy', text: experience.caption })
        ]),
        el(
          'div',
          { className: 'timeline-list' },
          experience.items.map((item, idx) =>
            el(
              'article',
              { className: 'timeline-item build-block', dataset: { wireLabel: `MOTION // RECORD_0${idx + 1}`, agent: 'motion' } },
              [
                el('div', { className: 'timeline-body' }, [
                  el('h3', { text: item.title }),
                  el('p', { text: `${item.org} · ${item.badge}` })
                ]),
                el('div', { className: 'timeline-period', text: item.period })
              ]
            )
          )
        )
      ])
    ])
  ]);

  // 5) LESS TALK. MORE DEPLOYS.
  const quoteBox = el('div', { className: 'deploys-red-slab build-block', dataset: { wireLabel: 'DESIGN // ACCENT_SLAB', agent: 'design' } }, [
    el('p', { className: 'slab-quote', dataset: { typeText: deploys.quote }, text: deploys.quote })
  ]);

  const deploysSection = el('section', { className: 'section', id: 'deploys', dataset: { agent: 'interaction' } }, [
    el('div', { className: 'container' }, [
      el('div', { className: 'deploys-grid' }, [
        el('div', { className: 'deploys-left build-block', dataset: { wireLabel: 'INTERACTION // DEPLOYS_STATEMENT', agent: 'interaction' } }, [
          el('span', { className: 'eyebrow', text: '04 / MINDSET' }),
          el('h2', { className: 'display-title' }, ['LESS TALK.', el('br'), el('span', { className: 'text-red', text: 'MORE DEPLOYS.' })]),
          el('p', { className: 'section-subcopy', style: { marginTop: '14px' }, text: deploys.subcopy })
        ]),
        quoteBox
      ])
    ])
  ]);

  // 6) THE TOOLKIT.
  const skillsSection = el('section', { className: 'section', id: 'skills', dataset: { agent: 'interaction' } }, [
    el('div', { className: 'container' }, [
      el('div', { className: 'section-header-row build-block', dataset: { wireLabel: 'INTERACTION // TOOLKIT_HEADER', agent: 'interaction' } }, [
        el('div', {}, [
          el('span', { className: 'eyebrow', text: '05 / STACK' }),
          el('h2', { className: 'display-title' }, ['THE ', el('span', { className: 'text-red', text: 'TOOLKIT.' })])
        ]),
        el('p', { className: 'section-subcopy', text: '프론트엔드 시스템 설계와 인터랙션 구현에 활용하는 핵심 도구입니다.' })
      ]),
      el(
        'div',
        { className: 'skills-grid' },
        skills.map((g, idx) =>
          el(
            'article',
            { className: 'skill-group build-block', dataset: { wireLabel: `INTERACTION // KIT_0${idx + 1}`, agent: 'interaction' } },
            [
              el('h3', { text: g.category }),
              el('p', { className: 'skill-desc', text: g.description }),
              el('div', { className: 'tag-list' }, g.items.map((item) => el('span', { className: 'tag', text: item })))
            ]
          )
        )
      )
    ])
  ]);

  // 7) CONTACT + 3D 커서 구체
  const contactSection = el('section', { className: 'section contact-section', id: 'contact', dataset: { agent: 'motion' } }, [
    el('div', { className: 'container' }, [
      el('div', { className: 'contact-layout' }, [
        el('div', { className: 'contact-card build-block', dataset: { wireLabel: 'MOTION // CONTACT_CTA', agent: 'motion' } }, [
          el('span', { className: 'eyebrow', text: '06 / CONTACT' }),
          el('h2', { className: 'display-title' }, ["LET'S BUILD", el('br'), 'SOMETHING ', el('span', { className: 'text-red', text: 'BOLD.' })]),
          el('p', { className: 'section-subcopy', style: { marginTop: '12px' }, text: contact.message }),
          el('p', { className: 'hero-location', text: contact.subMessage }),
          el('div', { className: 'contact-links' }, [
            el('a', { className: 'hero-link-chip is-primary', href: `mailto:${contact.email}`, text: contact.email }),
            el('a', { className: 'hero-link-chip', href: contact.github, target: '_blank', rel: 'noopener noreferrer', text: 'GitHub ↗' }),
            el('a', { className: 'hero-link-chip', href: contact.blog, target: '_blank', rel: 'noopener noreferrer', text: 'Blog ↗' })
          ])
        ]),
        el('div', { className: 'contact-swarm-box build-block', id: 'contact-swarm-box', dataset: { wireLabel: 'TEAM // 3D_SPHERE', agent: 'motion' } }, [
          el('canvas', { id: 'contact-swarm-canvas' }),
          el('p', { className: 'swarm-caption', text: 'THE BUILD TEAM IS ALREADY HERE' })
        ])
      ])
    ])
  ]);

  const footer = el('footer', { className: 'site-footer' }, [
    el('div', { className: 'container' }, [
      el('div', { className: 'footer-giant-outline', text: profile.name }),
      el('div', { className: 'footer-inner' }, [
        el('div', { className: 'footer-tagline', text: `${brand.name} — ${brand.tagline}` }),
        el('a', { className: 'back-to-top', href: '#top', text: 'Back to top ↑' })
      ])
    ])
  ]);

  const main = el('main', { id: 'top', className: 'main-content' }, [
    heroSection,
    marqueeSection,
    aboutSection,
    projectsSection,
    experienceSection,
    deploysSection,
    skillsSection,
    contactSection
  ]);

  document.body.append(introSplash, hud, trailCanvas, cursorStage, header, main, footer);
  setupTrailCanvas();
}

function appendHighlightedText(container, rawText) {
  const parts = rawText.split(/(\[\[.*?\]\])/g);
  parts.forEach((part) => {
    if (part.startsWith('[[') && part.endsWith(']]')) {
      container.appendChild(el('span', { className: 'highlight-red', text: part.slice(2, -2) }));
    } else if (part) {
      container.appendChild(document.createTextNode(part));
    }
  });
}

/* =========================================================
   2. 인트로 코어 커서 스웜 오프닝
   ========================================================= */
function runIntroSwarm(agents, onComplete) {
  const splash = document.getElementById('intro-splash');
  const canvas = document.getElementById('intro-canvas');
  if (!splash || !canvas) {
    onComplete();
    return;
  }

  splash.classList.remove('is-done');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const particles = Array.from({ length: 26 }, (_, i) => ({
    angle: (Math.PI * 2 * i) / 26,
    radius: 150 + (i % 5) * 30,
    speed: 0.024 + (i % 4) * 0.005,
    color: agents[i % agents.length].color
  }));

  let frame = 0;
  const tick = () => {
    frame += 1;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((p) => {
      p.angle += p.speed;
      if (frame < 46) {
        p.radius += (76 - p.radius) * 0.065;
      } else {
        p.radius += 22;
      }

      const x = cx + Math.cos(p.angle) * p.radius;
      const y = cy + Math.sin(p.angle) * p.radius;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(p.angle + Math.PI / 2);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(13, 6);
      ctx.lineTo(6, 13);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    if (frame < 66) {
      requestAnimationFrame(tick);
    } else {
      splash.classList.add('is-done');
      setTimeout(onComplete, 180);
    }
  };

  requestAnimationFrame(tick);
}

/* =========================================================
   3. 마우스 추적 & 5-커서 합체/시계 회전/트레일 엔진
   ========================================================= */
const pointerState = {
  targetX: window.innerWidth * 0.5,
  targetY: window.innerHeight * 0.5,
  clusterX: window.innerWidth * 0.5,
  clusterY: window.innerHeight * 0.5,
  clusterRadius: 0,
  currentRadius: 76,
  orbitRadius: 76,
  orbitAngle: 0,
  angularVelocity: 0,
  targetAngularSpeed: 0.0072,
  lastMoveTime: 0
};

function clampOrbitCenter(rawX, rawY) {
  const r = pointerState.orbitRadius;
  return {
    x: Math.max(r + 24, Math.min(window.innerWidth - r - 96, rawX)),
    y: Math.max(r + 70, Math.min(window.innerHeight - r - 32, rawY))
  };
}

function updatePointerTarget(rawX, rawY) {
  pointerState.targetX = rawX;
  pointerState.targetY = rawY;
  pointerState.lastMoveTime = performance.now();
}

function setupPointerTracking() {
  window.addEventListener('mousemove', (e) => updatePointerTarget(e.clientX, e.clientY), { passive: true });
  window.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches && e.touches[0]) updatePointerTarget(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );
  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches && e.touches[0]) updatePointerTarget(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );
}

let buildTimers = [];
let buildObserver = null;
let syncRafId = null;
let sphereRafId = null;

const activeBoxTrackers = new Set();
const cursorStates = {};
let mouseOrbitMode = false;

function clearTimers() {
  buildTimers.forEach((id) => clearTimeout(id));
  buildTimers = [];
}

function schedule(fn, delay) {
  const id = setTimeout(fn, delay);
  buildTimers.push(id);
  return id;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function lerpHexColor(hexA, hexB, t) {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const r1 = (a >> 16) & 255;
  const g1 = (a >> 8) & 255;
  const b1 = a & 255;
  const r2 = (b >> 16) & 255;
  const g2 = (b >> 8) & 255;
  const b2 = b & 255;
  return `rgb(${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(b1 + (b2 - b1) * t)})`;
}

function updateTrackerElements() {
  const now = performance.now();

  activeBoxTrackers.forEach((tracker) => {
    if (!tracker.targetEl.isConnected) {
      tracker.boxEl.remove();
      activeBoxTrackers.delete(tracker);
      return;
    }
    const rect = tracker.targetEl.getBoundingClientRect();
    const rawProgress = Math.min(1, (now - tracker.startTime) / tracker.duration);
    const p = easeOutCubic(rawProgress);

    tracker.boxEl.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
    tracker.boxEl.style.width = `${Math.max(14, rect.width * p)}px`;
    tracker.boxEl.style.height = `${Math.max(14, rect.height * p)}px`;
  });

  if (!mouseOrbitMode) {
    Object.values(cursorStates).forEach((c) => {
      const prevX = c.x;
      const prevY = c.y;
      if (c.targetEl && c.targetEl.isConnected) {
        const rect = c.targetEl.getBoundingClientRect();
        const tx = Math.max(16, Math.min(window.innerWidth - 130, rect.left + rect.width * c.offsetX));
        const ty = Math.max(70, Math.min(window.innerHeight - 44, rect.top + Math.min(48, rect.height * c.offsetY)));
        c.x += (tx - c.x) * 0.24;
        c.y += (ty - c.y) * 0.24;
      }
      c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;

      const speed = Math.hypot(c.x - prevX, c.y - prevY);
      if (speed > 0.6) {
        c.trail.push({ x: c.x + 4, y: c.y + 4, life: 1.0, decay: 0.07 });
        if (c.trail.length > 18) c.trail.shift();
      }
    });
  } else {
    const clamped = clampOrbitCenter(pointerState.targetX, pointerState.targetY);
    const distToTarget = Math.hypot(clamped.x - pointerState.clusterX, clamped.y - pointerState.clusterY);
    const isMoving = now - pointerState.lastMoveTime < 110 || distToTarget > 12;

    if (isMoving) {
      pointerState.angularVelocity *= 0.8;
      pointerState.currentRadius += (pointerState.clusterRadius - pointerState.currentRadius) * 0.24;
      if (pointerState.currentRadius < 0.6) pointerState.currentRadius = 0;
      pointerState.clusterX += (clamped.x - pointerState.clusterX) * 0.13;
      pointerState.clusterY += (clamped.y - pointerState.clusterY) * 0.13;
    } else {
      pointerState.clusterX += (clamped.x - pointerState.clusterX) * 0.18;
      pointerState.clusterY += (clamped.y - pointerState.clusterY) * 0.18;
      pointerState.currentRadius += (pointerState.orbitRadius - pointerState.currentRadius) * 0.08;

      const bloomProgress = pointerState.currentRadius / pointerState.orbitRadius;
      if (bloomProgress > 0.65) {
        pointerState.angularVelocity += (pointerState.targetAngularSpeed - pointerState.angularVelocity) * 0.045;
      }
    }
    pointerState.orbitAngle += pointerState.angularVelocity;

    const mergeRatio = 1 - Math.min(1, pointerState.currentRadius / pointerState.orbitRadius);

    Object.values(cursorStates).forEach((c) => {
      c.el.classList.add('is-visible', 'is-compact');
      c.el.classList.toggle('is-merged', mergeRatio > 0.35);
      c.el.classList.toggle('is-tags-hidden', mergeRatio > 0.25);

      if (c.stop1 && c.stop2 && c.tagEl) {
        const col1 = lerpHexColor(c.meta.color, '#D9867A', mergeRatio);
        const col2 = lerpHexColor(c.meta.color, '#8C88C9', mergeRatio);
        c.stop1.setAttribute('stop-color', col1);
        c.stop2.setAttribute('stop-color', col2);
        c.tagEl.style.background = `linear-gradient(135deg, ${col1}, ${col2})`;
      }

      const prevX = c.x;
      const prevY = c.y;
      const angle = pointerState.orbitAngle + c.orbitSlot;
      const destX = pointerState.clusterX + Math.cos(angle) * pointerState.currentRadius;
      const destY = pointerState.clusterY + Math.sin(angle) * pointerState.currentRadius;

      c.x += (destX - c.x) * 0.36;
      c.y += (destY - c.y) * 0.36;
      c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;

      const speed = Math.hypot(c.x - prevX, c.y - prevY);
      if (speed > 0.35) {
        c.trail.push({
          x: c.x + 4,
          y: c.y + 4,
          life: 1.0,
          decay: speed > 4.5 ? 0.042 : 0.068
        });
        if (c.trail.length > 22) c.trail.shift();
      }
    });
  }

  renderCursorTrails();
  syncRafId = requestAnimationFrame(updateTrackerElements);
}

let trailCtx = null;

function setupTrailCanvas() {
  const canvas = document.getElementById('cursor-trail-canvas');
  if (!canvas) return;
  trailCtx = canvas.getContext('2d');

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    trailCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });
}

function renderCursorTrails() {
  if (!trailCtx) return;
  trailCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  Object.values(cursorStates).forEach((c) => {
    if (!c.trail || c.trail.length === 0) return;

    for (let i = c.trail.length - 1; i >= 0; i -= 1) {
      const pt = c.trail[i];
      pt.life -= pt.decay;
      if (pt.life <= 0) {
        c.trail.splice(i, 1);
        continue;
      }
      trailCtx.save();
      trailCtx.globalAlpha = pt.life * 0.36;
      trailCtx.fillStyle = c.meta.color;
      trailCtx.beginPath();
      trailCtx.arc(pt.x, pt.y, 1.5 + pt.life * 2, 0, Math.PI * 2);
      trailCtx.fill();
      trailCtx.restore();
    }
  });
}

function startSyncLoop() {
  if (syncRafId) cancelAnimationFrame(syncRafId);
  syncRafId = requestAnimationFrame(updateTrackerElements);
}

function createAgentCursor(agent) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');

  const defs = document.createElementNS(svgNS, 'defs');
  const grad = document.createElementNS(svgNS, 'linearGradient');
  const gradId = `cursor-grad-${agent.id}`;
  grad.setAttribute('id', gradId);
  grad.setAttribute('x1', '0%');
  grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%');
  grad.setAttribute('y2', '100%');

  const stop1 = document.createElementNS(svgNS, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', agent.color);

  const stop2 = document.createElementNS(svgNS, 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', agent.color);

  grad.append(stop1, stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', 'M4 2L20 11L12 13.5L9.5 21L4 2Z');
  path.setAttribute('fill', `url(#${gradId})`);
  svg.appendChild(path);

  const tag = el('span', { className: 'agent-tag', text: agent.name, style: { backgroundColor: agent.color } });
  const container = el('div', { className: 'agent-cursor', dataset: { agentId: agent.id } }, [svg, tag]);
  return { el: container, stop1, stop2, tagEl: tag };
}

function spawnRippleOnTarget(targetEl, offsetX, offsetY, color) {
  const rect = targetEl.getBoundingClientRect();
  const x = Math.max(16, Math.min(window.innerWidth - 20, rect.left + rect.width * offsetX));
  const y = Math.max(70, Math.min(window.innerHeight - 20, rect.top + Math.min(48, rect.height * offsetY)));
  const ripple = el('div', { className: 'click-ripple', style: { left: `${x}px`, top: `${y}px`, borderColor: color } });
  document.body.appendChild(ripple);
  schedule(() => ripple.remove(), 520);
}

function spawnTrackedDragBox(targetEl, colorA, colorB, labelText) {
  const rect = targetEl.getBoundingClientRect();
  const boxEl = el('div', {
    className: 'drag-box',
    dataset: { boxLabel: labelText || 'BUILDING' },
    style: {
      transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
      width: '14px',
      height: '14px',
      '--neon-a': colorA,
      '--neon-b': colorB || colorA
    }
  });
  document.body.appendChild(boxEl);

  const tracker = {
    targetEl,
    boxEl,
    startTime: performance.now(),
    duration: 320
  };
  activeBoxTrackers.add(tracker);

  schedule(() => {
    boxEl.style.opacity = '0';
    schedule(() => {
      activeBoxTrackers.delete(tracker);
      boxEl.remove();
    }, 240);
  }, 380);
}

function typeElementText(target, fullText, duration = 420) {
  if (!target || !fullText) return;
  target.classList.add('typing-caret');
  target.textContent = '';
  const stepMs = Math.max(18, Math.floor(duration / Math.max(fullText.length, 1)));
  let i = 0;

  const step = () => {
    i += 1;
    target.textContent = fullText.slice(0, i);
    if (i < fullText.length) {
      schedule(step, stepMs);
    } else {
      target.classList.remove('typing-caret');
    }
  };
  step();
}

function animateImpactCounter(counterEl) {
  if (!counterEl || counterEl.dataset.animated === 'true') return;
  counterEl.dataset.animated = 'true';
  const target = parseInt(counterEl.dataset.targetPercent || '100', 10);
  const start = performance.now();
  const duration = 950;

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const val = Math.round(target * easeOutCubic(t));
    counterEl.textContent = `${val}%`;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* =========================================================
   4. 섹션별 에이전트 조립 코레오그래피 (복구)
   ========================================================= */
function startChoreography(data) {
  clearTimers();
  if (buildObserver) buildObserver.disconnect();
  activeBoxTrackers.forEach((t) => t.boxEl.remove());
  activeBoxTrackers.clear();
  mouseOrbitMode = false;

  const stage = document.getElementById('cursor-stage');
  const hud = document.getElementById('build-hud');
  const hudText = document.getElementById('hud-text');
  if (!stage) return;

  stage.replaceChildren();
  hud.classList.remove('is-complete');
  hudText.textContent = `${data.brand.name} // AGENTS BUILDING...`;

  const centerX = window.innerWidth * 0.5;
  const centerY = window.innerHeight * 0.5;

  data.agents.forEach((agent, idx) => {
    const built = createAgentCursor(agent);
    stage.appendChild(built.el);

    cursorStates[agent.id] = {
      el: built.el,
      stop1: built.stop1,
      stop2: built.stop2,
      tagEl: built.tagEl,
      meta: agent,
      x: centerX,
      y: centerY,
      targetEl: null,
      offsetX: 0.25,
      offsetY: 0.25,
      orbitSlot: (Math.PI * 2 * idx) / data.agents.length,
      trail: []
    };
  });

  schedule(() => {
    data.agents.forEach((agent, idx) => {
      const c = cursorStates[agent.id];
      c.el.classList.add('is-visible');
      c.el.classList.remove('is-compact', 'is-merged', 'is-tags-hidden');
      c.x = 100 + ((window.innerWidth - 240) * (idx + 0.5)) / data.agents.length;
      c.y = 140 + (idx % 2) * 70;
    });
  }, 60);

  startSyncLoop();

  const builtSections = new Set();
  const allSections = Array.from(document.querySelectorAll('main > section[data-agent]'));
  const roleOrder = ['layout', 'design', 'development', 'interaction', 'motion'];

  const enterMouseOrbitGroup = () => {
    hud.classList.add('is-complete');
    hudText.textContent = `${data.brand.name} // LIVE INTERACTIVE MODE`;
    Object.values(cursorStates).forEach((c) => {
      c.targetEl = null;
    });
    pointerState.angularVelocity = 0;
    pointerState.lastMoveTime = performance.now() - 200;
    mouseOrbitMode = true;
  };

  const checkAllDone = () => {
    if (builtSections.size >= allSections.length) {
      schedule(enterMouseOrbitGroup, 480);
    }
  };

  const buildSection = (section) => {
    if (builtSections.has(section.id)) return;
    builtSections.add(section.id);

    const blocks = Array.from(section.querySelectorAll('.build-block'));

    blocks.forEach((block, idx) => {
      const primaryId = block.dataset.agent || roleOrder[idx % roleOrder.length];
      const partnerId = roleOrder[(idx + 2) % roleOrder.length];
      const activeCursor = cursorStates[primaryId] || cursorStates.layout;
      const partnerCursor = cursorStates[partnerId] || cursorStates.design;
      const offsetX = 0.2 + (idx % 3) * 0.24;
      const offsetY = 0.3;
      const baseDelay = idx * 240 + 120;

      block.dataset.stage = 'wireframe';

      schedule(() => {
        if (mouseOrbitMode) return;
        const rect = block.getBoundingClientRect();
        const inView = rect.bottom > 0 && rect.top < window.innerHeight;

        activeCursor.targetEl = block;
        activeCursor.offsetX = offsetX;
        activeCursor.offsetY = offsetY;
        partnerCursor.targetEl = block;
        partnerCursor.offsetX = Math.min(0.82, offsetX + 0.28);
        partnerCursor.offsetY = 0.65;

        block.style.setProperty('--block-neon', activeCursor.meta.color);
        block.style.setProperty('--block-neon-b', partnerCursor.meta.color);

        if (inView) {
          activeCursor.el.classList.add('is-visible');
          partnerCursor.el.classList.add('is-visible');
          spawnTrackedDragBox(block, activeCursor.meta.color, partnerCursor.meta.color, activeCursor.meta.name);
        }

        schedule(() => {
          if (inView) spawnRippleOnTarget(block, offsetX, offsetY, activeCursor.meta.color);
          block.dataset.stage = 'built';
          block.classList.add('is-neon-peak');
          schedule(() => block.classList.remove('is-neon-peak'), 460);

          block.querySelectorAll('[data-type-text]').forEach((t) => {
            typeElementText(t, t.dataset.typeText, 380);
          });

          const counterEl = block.querySelector('#impact-counter');
          if (counterEl) animateImpactCounter(counterEl);
        }, 260);
      }, baseDelay);
    });

    schedule(checkAllDone, blocks.length * 240 + 620);
  };

  buildObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          buildSection(entry.target);
          buildObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  allSections.forEach((sec) => buildObserver.observe(sec));

  initContact3DSphere(data.agents);
  setupHeaderButtons(data, hud, hudText, allSections, builtSections, enterMouseOrbitGroup);
}

function setupHeaderButtons(data, hud, hudText, allSections, builtSections, enterMouseOrbitGroup) {
  const skipBtn = document.getElementById('skip-build-btn');
  const replayBtn = document.getElementById('replay-build-btn');

  if (skipBtn) {
    skipBtn.onclick = () => {
      clearTimers();
      if (buildObserver) buildObserver.disconnect();
      activeBoxTrackers.forEach((t) => t.boxEl.remove());
      activeBoxTrackers.clear();

      const splash = document.getElementById('intro-splash');
      if (splash) splash.classList.add('is-done');

      allSections.forEach((sec) => builtSections.add(sec.id));
      document.querySelectorAll('.build-block').forEach((b) => {
        b.dataset.stage = 'built';
        b.classList.remove('is-neon-peak');
      });
      document.querySelectorAll('[data-type-text]').forEach((t) => {
        t.classList.remove('typing-caret');
        t.textContent = t.dataset.typeText;
      });
      const counterEl = document.getElementById('impact-counter');
      if (counterEl) counterEl.textContent = `${counterEl.dataset.targetPercent || 100}%`;

      enterMouseOrbitGroup();
    };
  }

  if (replayBtn) {
    replayBtn.onclick = () => {
      clearTimers();
      document.querySelectorAll('.build-block').forEach((b) => {
        delete b.dataset.stage;
        b.classList.remove('is-neon-peak');
      });
      const counterEl = document.getElementById('impact-counter');
      if (counterEl) {
        delete counterEl.dataset.animated;
        counterEl.textContent = '0%';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      schedule(() => {
        runIntroSwarm(data.agents, () => startChoreography(data));
      }, 280);
    };
  }
}

/* =========================================================
   5. A 그룹: Contact 섹션 3D 구형 커서 그룹 (마우스와 독립 회전)
   ========================================================= */
function initContact3DSphere(agents) {
  const canvas = document.getElementById('contact-swarm-canvas');
  if (!canvas) return;
  if (sphereRafId) cancelAnimationFrame(sphereRafId);

  const ctx = canvas.getContext('2d');
  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  const count = 48;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const points = Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    return {
      x: Math.cos(theta) * r,
      y,
      z: Math.sin(theta) * r,
      color: agents[i % agents.length].color
    };
  });

  let rotX = 0.25;
  let rotY = 0;

  const draw = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2 - 8;
    const sphereRadius = Math.min(w, h) * 0.34;
    const focal = 340;

    rotX += 0.0016;
    rotY += 0.0026;

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const projected = points.map((p) => {
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;
      const worldZ = z2 * sphereRadius;
      const scale = focal / (focal - worldZ);
      return {
        sx: cx + x1 * sphereRadius * scale,
        sy: cy + y2 * sphereRadius * scale,
        z: z2,
        color: p.color,
        angle: Math.atan2(y2, x1)
      };
    });

    projected.sort((a, b) => a.z - b.z);

    projected.forEach((pt) => {
      const depthNorm = (pt.z + 1) / 2;
      const alpha = 0.16 + depthNorm * 0.84;
      const size = 0.65 + depthNorm * 0.65;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(pt.sx, pt.sy);
      ctx.rotate(pt.angle + Math.PI / 2);
      ctx.scale(size, size);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(10, 4.5);
      ctx.lineTo(4.5, 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    sphereRafId = requestAnimationFrame(draw);
  };

  sphereRafId = requestAnimationFrame(draw);
}
