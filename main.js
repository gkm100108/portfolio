/**
 * GuGyeongMo—Portfolio — Autonomous 5-Agent Collaborative Refinement & 3D Cursor Sphere Engine
 */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

function forceScrollTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

forceScrollTop();

const ROLE_SLOT_OFFSET = {
  layout: { x: 0.14, y: 0.28 },
  design: { x: 0.34, y: 0.24 },
  development: { x: 0.56, y: 0.38 },
  interaction: { x: 0.76, y: 0.52 },
  motion: { x: 0.45, y: 0.68 }
};

function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.id) node.id = options.id;
  if (options.text) node.textContent = options.text;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([k, v]) => {
      if (v !== undefined && v !== null) node.setAttribute(k, String(v));
    });
  }
  if (options.dataset) {
    Object.entries(options.dataset).forEach(([k, v]) => {
      if (v !== undefined && v !== null) node.dataset[k] = String(v);
    });
  }
  if (options.style) {
    Object.entries(options.style).forEach(([k, v]) => {
      node.style[k] = v;
    });
  }
  children.forEach((child) => {
    if (child) node.appendChild(child);
  });
  return node;
}

function createCursorSvg(color) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', 'M3 2L20 10.5L12.2 13.2L9.5 21L3 2Z');
  path.setAttribute('fill', color);
  svg.appendChild(path);
  return svg;
}

function lerpHexColor(hexA, hexB, t) {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const r = Math.round(((a >> 16) & 255) + (((b >> 16) & 255) - ((a >> 16) & 255)) * t);
  const g = Math.round(((a >> 8) & 255) + (((b >> 8) & 255) - ((a >> 8) & 255)) * t);
  const bl = Math.round((a & 255) + ((b & 255) - (a & 255)) * t);
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
}

class PortfolioApp {
  constructor(data) {
    this.data = data;
    this.roles = data.agents;
    this.roleColorMap = Object.fromEntries(data.agents.map((r) => [r.id, r.color]));
    this.cursors = [];
    this.particles = [];
    this.pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.38, active: false, lastMoveAt: 0 };
    this.mouseOrbitMode = false;
    this.introCompleted = false;
    this.orbitAngle = 0;
    this.clusterMergeFactor = 0;
    this.sectionActivated = new Set();
    this.typingEnqueuedSections = new WeakSet();
    this.typingPreparedElements = new WeakSet();
    this.typingCompletedElements = new WeakSet();
    this.typingQueue = [];
    this.lastScrollAt = 0;
    this.scrollTicking = false;

    this.applyHeadMetadata();
    this.mountShell();
    this.initTrailCanvas();
    this.initAgentCursors();
    this.initContactSphere();
    this.bindEvents();
    this.runIntroAndRevealSequence();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  applyHeadMetadata() {
    document.title = this.data.brand.name;
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.type = 'image/svg+xml';
    favicon.href = './favicon.svg';
  }

  mountShell() {
    document.body.replaceChildren();

    document.body.appendChild(el('div', { className: 'bg-grid-overlay' }));

    this.trailCanvas = el('canvas', { id: 'swarm-trail-canvas' });
    document.body.appendChild(this.trailCanvas);

    this.agentStage = el('div', { id: 'agent-stage' });
    document.body.appendChild(this.agentStage);

    const introTitle = el('h1', { className: 'intro-title' }, [
      document.createTextNode('GuGyeongMo'),
      el('span', { className: 'em-dash', text: '—' }),
      document.createTextNode('Portfolio')
    ]);
    this.introStatusText = el('span', { text: 'INITIALIZING 5-AGENT BUILD SWARM...' });
    this.introOverlay = el('div', { id: 'intro-overlay' }, [
      el('div', { className: 'intro-brand-center' }, [
        introTitle,
        el('p', { className: 'intro-tagline', text: this.data.brand.tagline }),
        el('div', { className: 'intro-status-pill' }, [
          el('span', { className: 'intro-status-dot' }),
          this.introStatusText
        ])
      ])
    ]);
    document.body.appendChild(this.introOverlay);

    this.headerEl = this.buildHeader();
    document.body.appendChild(this.headerEl);

    this.mainEl = el('main', { id: 'portfolio-root' });
    this.sections = {
      hero: this.buildHeroSection(),
      about: this.buildAboutSection(),
      projects: this.buildProjectsSection(),
      experience: this.buildExperienceSection(),
      skills: this.buildSkillsSection(),
      contact: this.buildContactSection()
    };

    Object.values(this.sections).forEach((sec) => this.mainEl.appendChild(sec));
    document.body.appendChild(this.mainEl);

    document.body.appendChild(
      el('footer', { className: 'site-footer' }, [
        el('span', { text: `© ${new Date().getFullYear()} ${this.data.brand.name}. Crafted with 5-Agent Swarm.` }),
        el('span', { text: 'DAEGU, KR · FRONTEND & CREATIVE DEVELOPER' })
      ])
    );
  }

  buildHeader() {
    const brandLogo = el('a', { className: 'brand-logo', attrs: { href: '#hero' } }, [
      document.createTextNode('GuGyeongMo'),
      el('span', { className: 'em-dash', text: '—' }),
      document.createTextNode('Portfolio')
    ]);

    const navItems = [
      { label: 'Hero', href: '#hero' },
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Experience', href: '#experience' },
      { label: 'Skills', href: '#skills' },
      { label: 'Contact', href: '#contact' }
    ];

    const navList = el(
      'ul',
      { className: 'nav-links' },
      navItems.map((item) =>
        el('li', {}, [el('a', { className: 'nav-link', text: item.label, attrs: { href: item.href } })])
      )
    );

    this.headerStatusLabel = el('span', { text: '5 AGENTS REFINING' });
    return el('header', { className: 'site-header' }, [
      brandLogo,
      navList,
      el('div', { className: 'header-agent-pill' }, [
        el('span', { className: 'header-agent-dot' }),
        this.headerStatusLabel
      ])
    ]);
  }

  buildHeroSection() {
    const { hero, highlights, brand } = this.data;

    const leftCol = el('div', { className: 'hero-left' }, [
      el('span', { className: 'hero-greeting', text: hero.greeting, dataset: { agentType: 'design' } }),
      el('h1', { className: 'hero-name', text: hero.name, dataset: { agentType: 'design' } }),
      el('div', { className: 'hero-role-row' }, [
        el('span', { className: 'badge-red', text: hero.roleBadge, dataset: { agentType: 'development' } }),
        el('span', {
          className: 'hero-location',
          text: `${hero.secondaryBadge} · ${hero.location}`,
          dataset: { agentType: 'layout' }
        })
      ]),
      el('p', { className: 'hero-summary', text: hero.summary, dataset: { agentType: 'layout' } }),
      el(
        'div',
        { className: 'hero-links' },
        hero.links.map((lnk) =>
          el('a', {
            className: 'hero-link-chip',
            text: `${lnk.label} ↗`,
            dataset: { agentType: 'interaction' },
            attrs: {
              href: lnk.href,
              target: lnk.href.startsWith('http') ? '_blank' : undefined,
              rel: lnk.href.startsWith('http') ? 'noopener noreferrer' : undefined
            }
          })
        )
      )
    ]);

    const headlineEl = el('h2', { className: 'hero-headline', dataset: { agentType: 'motion' } }, [
      document.createTextNode(`${hero.headlineTop} `),
      el('span', { className: 'serif-italic', text: hero.headlineAccent }),
      el('br'),
      document.createTextNode(`${hero.headlineBottom} `),
      el('span', { className: 'serif-italic', text: hero.headlineAccent2 })
    ]);

    const rightCol = el('div', { className: 'hero-right' }, [
      el('span', { className: 'eyebrow', text: 'INTERACTIVE ARCHITECTURE', dataset: { agentType: 'design' } }),
      headlineEl,
      el('p', { className: 'section-subcopy', text: brand.subcopy, dataset: { agentType: 'layout' } })
    ]);

    // Focus 1~4 cards render cleanly without being re-wiped on scroll
    const statsStrip = el(
      'div',
      { className: 'stats-strip' },
      highlights.map((item) =>
        el('div', { className: 'stat-card' }, [
          el('span', { className: 'stat-label', text: item.label }),
          el('span', { className: 'stat-value', text: item.value }),
          el('span', { className: 'stat-desc', text: item.desc })
        ])
      )
    );

    return el('section', { id: 'hero', className: 'portfolio-section hero-section' }, [
      el('div', { className: 'hero-grid' }, [leftCol, rightCol]),
      statsStrip
    ]);
  }

  buildAboutSection() {
    const { about } = this.data;

    const header = el('div', { className: 'section-header' }, [
      el('span', { className: 'eyebrow', text: about.eyebrow, dataset: { agentType: 'design' } }),
      el('h2', { className: 'section-title', text: about.title, dataset: { agentType: 'design' } })
    ]);

    const philosophyCard = el('div', { className: 'philosophy-card' }, [
      el('p', { className: 'philosophy-lead', text: `“${about.lead}”`, dataset: { agentType: 'motion' } }),
      el('p', { className: 'section-subcopy', text: about.description, dataset: { agentType: 'layout' } }),
      el('div', { className: 'philosophy-slab' }, [
        el('p', { className: 'slab-quote', text: about.slabQuote, dataset: { agentType: 'motion' } }),
        el('span', { className: 'slab-caption', text: about.slabCaption, dataset: { agentType: 'development' } })
      ])
    ]);

    const strengthsStack = el(
      'div',
      { className: 'strengths-stack' },
      about.strengths.map((item) =>
        el('div', { className: 'strength-card' }, [
          el('div', { className: 'strength-card-head' }, [
            el('h3', { text: item.title, dataset: { agentType: 'design' } }),
            el('span', { className: 'strength-tag', text: item.tag, dataset: { agentType: 'development' } })
          ]),
          el('p', { text: item.desc, dataset: { agentType: 'layout' } })
        ])
      )
    );

    return el('section', { id: 'about', className: 'portfolio-section' }, [
      header,
      el('div', { className: 'about-grid' }, [philosophyCard, strengthsStack])
    ]);
  }

  buildProjectsSection() {
    const header = el('div', { className: 'section-header' }, [
      el('span', { className: 'eyebrow', text: '02 / SELECTED PROJECTS', dataset: { agentType: 'design' } }),
      el('h2', { className: 'section-title', text: 'Interactive Systems & Product Builds', dataset: { agentType: 'design' } }),
      el('p', {
        className: 'section-subcopy',
        text: '프로젝트별 주요 특징, 담당 역할, 사용 기술을 한눈에 파악할 수 있도록 구성했습니다.',
        dataset: { agentType: 'layout' }
      })
    ]);

    const list = el(
      'div',
      { className: 'projects-list' },
      this.data.projects.map((proj) =>
        el('article', { className: 'project-row' }, [
          el('span', { className: 'project-index', text: proj.index, dataset: { agentType: 'design' } }),
          el('div', { className: 'project-main' }, [
            el('span', { className: 'project-subtitle', text: proj.role, dataset: { agentType: 'design' } }),
            el('h3', { className: 'project-row-title', text: proj.title, dataset: { agentType: 'design' } }),
            el(
              'div',
              { className: 'project-tags' },
              proj.tags.map((t) => el('span', { className: 'tag', text: t, dataset: { agentType: 'development' } }))
            )
          ]),
          el('p', { className: 'project-desc', text: proj.description, dataset: { agentType: 'layout' } }),
          el('div', { className: 'project-metrics-col' }, [
            ...proj.highlights.map((hl) =>
              el('span', { className: 'project-highlight', text: hl, dataset: { agentType: 'motion' } })
            ),
            el('a', {
              className: 'project-period-link',
              text: `${proj.period} · 보기 ↗`,
              dataset: { agentType: 'interaction' },
              attrs: {
                href: proj.link,
                target: proj.link.startsWith('http') ? '_blank' : undefined,
                rel: proj.link.startsWith('http') ? 'noopener noreferrer' : undefined
              }
            })
          ])
        ])
      )
    );

    return el('section', { id: 'projects', className: 'portfolio-section' }, [header, list]);
  }

  buildExperienceSection() {
    const header = el('div', { className: 'section-header' }, [
      el('span', { className: 'eyebrow', text: '03 / EXPERIENCE & ACTIVITIES', dataset: { agentType: 'design' } }),
      el('h2', { className: 'section-title', text: 'Activities & Collaborative Growth', dataset: { agentType: 'design' } })
    ]);

    const list = el(
      'div',
      { className: 'timeline-list' },
      this.data.experience.map((exp) =>
        el('div', { className: 'timeline-item' }, [
          el('div', { className: 'timeline-top' }, [
            el('span', { className: 'timeline-period', text: exp.period, dataset: { agentType: 'interaction' } }),
            el('span', { className: 'timeline-org', text: exp.org, dataset: { agentType: 'design' } })
          ]),
          el('div', { className: 'timeline-body' }, [
            el('h3', { text: exp.role, dataset: { agentType: 'development' } }),
            el('p', { text: exp.detail, dataset: { agentType: 'layout' } })
          ])
        ])
      )
    );

    return el('section', { id: 'experience', className: 'portfolio-section' }, [header, list]);
  }

  buildSkillsSection() {
    const header = el('div', { className: 'section-header' }, [
      el('span', { className: 'eyebrow', text: '04 / TECHNICAL STACK', dataset: { agentType: 'design' } }),
      el('h2', { className: 'section-title', text: 'Frontend, Motion & Workflow', dataset: { agentType: 'design' } })
    ]);

    const grid = el(
      'div',
      { className: 'skills-grid' },
      this.data.skillGroups.map((grp) =>
        el('div', { className: 'skill-group' }, [
          el('div', { className: 'skill-group-head' }, [
            el('span', { className: 'skill-dot', style: { backgroundColor: grp.accent } }),
            el('h3', { text: grp.category, dataset: { agentType: 'design' } })
          ]),
          el('p', { className: 'skill-desc', text: grp.description, dataset: { agentType: 'layout' } }),
          el(
            'div',
            { className: 'skill-chips' },
            grp.items.map((item) => el('span', { className: 'tag', text: item, dataset: { agentType: 'development' } }))
          )
        ])
      )
    );

    return el('section', { id: 'skills', className: 'portfolio-section' }, [header, grid]);
  }

  buildContactSection() {
    const { contact } = this.data;

    const contactCard = el('div', { className: 'contact-card' }, [
      el('div', {}, [
        el('span', { className: 'eyebrow', text: contact.eyebrow, dataset: { agentType: 'design' } }),
        el('h2', {
          className: 'section-title',
          text: contact.headline,
          dataset: { agentType: 'design' },
          style: { marginTop: '10px' }
        }),
        el('p', {
          className: 'section-subcopy',
          text: contact.subcopy,
          dataset: { agentType: 'layout' },
          style: { marginTop: '14px' }
        })
      ]),
      el('div', { className: 'hero-links' }, [
        el('a', {
          className: 'hero-link-chip',
          text: `${contact.email} ↗`,
          dataset: { agentType: 'interaction' },
          attrs: { href: `mailto:${contact.email}` }
        }),
        el('a', {
          className: 'hero-link-chip',
          text: 'GitHub ↗',
          dataset: { agentType: 'interaction' },
          attrs: {
            href: contact.github,
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        })
      ])
    ]);

    this.sphereCanvas = el('canvas', { id: 'contact-swarm-canvas' });
    const sphereCard = el('div', { className: 'swarm-sphere-card' }, [
      this.sphereCanvas,
      el('p', {
        className: 'swarm-caption',
        text: 'INTERACTIVE 3D CURSOR SPHERE — HOVER TO DEFLECT SWARM VECTORS',
        dataset: { agentType: 'motion' }
      })
    ]);

    return el('section', { id: 'contact', className: 'portfolio-section' }, [
      el('div', { className: 'contact-grid' }, [contactCard, sphereCard])
    ]);
  }

  initTrailCanvas() {
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.trailCanvas.width = window.innerWidth * dpr;
      this.trailCanvas.height = window.innerHeight * dpr;
      this.trailCtx = this.trailCanvas.getContext('2d');
      this.trailCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
  }

  initAgentCursors() {
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.5;

    this.cursors = this.roles.map((role, idx) => {
      const angle = (idx / this.roles.length) * Math.PI * 2;
      const startX = cx + Math.cos(angle) * 260;
      const startY = cy + Math.sin(angle) * 180;

      const svgNode = createCursorSvg(role.color);
      const tagNode = el('span', {
        className: 'agent-cursor-tag',
        text: role.label,
        style: { backgroundColor: role.color }
      });

      const cursorEl = el('div', { className: 'agent-cursor' }, [svgNode, tagNode]);
      this.agentStage.appendChild(cursorEl);

      return {
        id: role.id,
        label: role.label,
        color: role.color,
        currentColor: role.color,
        el: cursorEl,
        pathEl: svgNode.querySelector('path'),
        x: startX,
        y: startY,
        tx: startX,
        ty: startY,
        ease: 0.14 + idx * 0.012,
        history: [],
        typingJob: null,
        isInspecting: false,
        patrolElement: null,
        nextPatrolAt: 0
      };
    });
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.pointer.active = true;
      this.pointer.lastMoveAt = performance.now();
    });

    window.addEventListener(
      'scroll',
      () => {
        this.lastScrollAt = performance.now();
        if (!this.introCompleted || this.scrollTicking) return;
        this.scrollTicking = true;
        requestAnimationFrame(() => {
          this.scrollTicking = false;
          this.handleViewportScroll();
        });
      },
      { passive: true }
    );

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        if (!this.introCompleted) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.sectionActivated.has(entry.target.id)) {
            this.activateSectionAgents(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    Object.values(this.sections).forEach((sec) => this.sectionObserver.observe(sec));
  }

  findCurrentViewportSection() {
    const viewportCenterY = window.innerHeight * 0.45;
    let bestSec = this.sections.hero;
    let bestDist = Infinity;

    Object.values(this.sections).forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const dist = Math.abs(rect.top + rect.height * 0.5 - viewportCenterY);
      if (dist < bestDist) {
        bestDist = dist;
        bestSec = sec;
      }
    });

    return bestSec;
  }

  isRectNearViewport(rect, margin = 120) {
    return (
      rect.bottom >= -margin &&
      rect.top <= window.innerHeight + margin &&
      rect.width > 0 &&
      rect.height > 0
    );
  }

  handleViewportScroll() {
    const activeSec = this.findCurrentViewportSection();
    if (!activeSec) return;

    if (!this.sectionActivated.has(activeSec.id)) {
      this.activateSectionAgents(activeSec);
    }

    this.cursors.forEach((cursor, idx) => {
      if (cursor.isInspecting) return;

      if (cursor.typingJob && !this.isRectNearViewport(cursor.typingJob.el.getBoundingClientRect(), 90)) {
        this.finishTypingJobImmediately(cursor.typingJob);
        cursor.typingJob = null;
        cursor.el.classList.remove('is-typing');
      }

      if (!cursor.typingJob) {
        this.assignCursorToViewportSection(cursor, idx, activeSec);
      }
    });
  }

  assignCursorToViewportSection(cursor, idx, sectionEl) {
    if (cursor.isInspecting) return;
    const targetSec = sectionEl || this.findCurrentViewportSection();
    if (!targetSec) return;

    this.startNextTypingJobForCursor(cursor);
    if (cursor.typingJob) return;

    const roleCandidates = Array.from(
      targetSec.querySelectorAll(`[data-agent-type="${cursor.id}"]`)
    ).filter((node) => this.isRectNearViewport(node.getBoundingClientRect(), 40));

    const pool =
      roleCandidates.length > 0
        ? roleCandidates
        : Array.from(targetSec.querySelectorAll('[data-agent-type]')).filter((node) =>
            this.isRectNearViewport(node.getBoundingClientRect(), 40)
          );

    if (pool.length > 0) {
      const chosen = pool[(idx + Math.floor(performance.now() / 1600)) % pool.length];
      cursor.patrolElement = chosen;
      const r = chosen.getBoundingClientRect();
      const slot = ROLE_SLOT_OFFSET[cursor.id] || { x: 0.5, y: 0.5 };
      cursor.tx = Math.max(28, Math.min(window.innerWidth - 96, r.left + Math.min(r.width * slot.x, r.width - 12)));
      cursor.ty = Math.max(64, Math.min(window.innerHeight - 48, r.top + Math.min(r.height * slot.y, 28)));
      cursor.nextPatrolAt = performance.now() + 1500 + idx * 260;
      return;
    }

    const secRect = targetSec.getBoundingClientRect();
    const slot = ROLE_SLOT_OFFSET[cursor.id] || { x: 0.5, y: 0.5 };
    const clampedTop = Math.max(76, Math.min(window.innerHeight - 180, secRect.top));
    const visibleHeight = Math.max(140, Math.min(window.innerHeight - clampedTop - 40, secRect.height));
    cursor.tx = window.innerWidth * (0.14 + slot.x * 0.72);
    cursor.ty = clampedTop + visibleHeight * slot.y;
    cursor.nextPatrolAt = performance.now() + 1500 + idx * 240;
  }

  spawnClickRipple(x, y, color) {
    const ripple = el('div', {
      className: 'click-ripple',
      style: { left: `${x}px`, top: `${y}px`, color: color || '#4B8EB3' }
    });
    this.agentStage.appendChild(ripple);
    setTimeout(() => ripple.remove(), 520);

    for (let i = 0; i < 4; i++) {
      const ang = (Math.PI * 2 * i) / 4 + Math.random() * 0.5;
      const spd = 1.0 + Math.random() * 1.8;
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        alpha: 0.7,
        color: color || '#4B8EB3',
        size: 2
      });
    }
  }

  highlightRealElement(cursor, targetEl, holdMs = 480) {
    return new Promise((resolve) => {
      if (!(targetEl instanceof Element)) {
        resolve();
        return;
      }

      const initialRect = targetEl.getBoundingClientRect();
      if (!this.isRectNearViewport(initialRect, 140)) {
        resolve();
        return;
      }

      cursor.isInspecting = true;

      const focusRing = el('div', {
        className: 'element-neon-focus',
        style: {
          left: `${initialRect.left}px`,
          top: `${initialRect.top}px`,
          width: `${initialRect.width}px`,
          height: `${initialRect.height}px`,
          borderRadius: window.getComputedStyle(targetEl).borderRadius || '8px'
        }
      }, [el('span', { className: 'element-focus-badge', text: cursor.label })]);
      focusRing.style.setProperty('--focus-color', cursor.color);
      this.agentStage.appendChild(focusRing);

      const isInteractiveBtn = targetEl.matches('a, .hero-link-chip, .project-period-link');
      let arrived = false;
      let removed = false;
      const start = performance.now();

      const track = (now) => {
        if (removed) return;
        const rect = targetEl.getBoundingClientRect();
        if (!this.isRectNearViewport(rect, 180)) {
          removed = true;
          cursor.isInspecting = false;
          targetEl.classList.remove('is-agent-hover');
          focusRing.remove();
          resolve();
          return;
        }

        focusRing.style.left = `${rect.left}px`;
        focusRing.style.top = `${rect.top}px`;
        focusRing.style.width = `${rect.width}px`;
        focusRing.style.height = `${rect.height}px`;

        const anchorX = rect.left + Math.min(rect.width * 0.22, 42);
        const anchorY = rect.top + Math.min(rect.height * 0.35, 22);
        cursor.tx = anchorX;
        cursor.ty = anchorY;

        if (!arrived && (Math.hypot(cursor.x - anchorX, cursor.y - anchorY) < 28 || now - start > 340)) {
          arrived = true;
          focusRing.classList.add('is-visible');
          this.spawnClickRipple(anchorX, anchorY, cursor.color);
          if (isInteractiveBtn) targetEl.classList.add('is-agent-hover');

          setTimeout(() => {
            cursor.isInspecting = false;
            targetEl.classList.remove('is-agent-hover');
            focusRing.classList.add('is-fading');
            focusRing.classList.remove('is-visible');
            setTimeout(() => {
              removed = true;
              focusRing.remove();
            }, 300);
            resolve();
          }, holdMs);
        }

        requestAnimationFrame(track);
      };

      requestAnimationFrame(track);
    });
  }

  prepareElementForTyping(targetEl, roleColor) {
    if (!targetEl || this.typingPreparedElements.has(targetEl) || this.typingCompletedElements.has(targetEl)) {
      return null;
    }

    const fullText = (targetEl.textContent || '').replace(/\s+/g, ' ').trim();
    if (!fullText) return null;

    this.typingPreparedElements.add(targetEl);

    targetEl.style.setProperty('--typing-text-color', window.getComputedStyle(targetEl).color || '#14161f');
    targetEl.style.setProperty('--typing-caret-color', roleColor || '#4B8EB3');
    targetEl.classList.add('is-typing-pending');

    const typedTextSpan = el('span', { className: 'typing-typed-text', text: '' });
    const caretPin = el('span', { className: 'typing-caret-pin' });
    const ghostLayer = el('span', { className: 'typing-ghost-layer' }, [typedTextSpan, caretPin]);
    targetEl.appendChild(ghostLayer);

    return {
      el: targetEl,
      roleId: targetEl.dataset.agentType || 'development',
      fullText,
      ghostLayer,
      typedTextSpan,
      caretPin,
      charIndex: 0,
      phase: 'queued',
      lastCharAt: 0
    };
  }

  enqueueSectionTypingJobs(sectionEl) {
    // Only enqueue typing jobs once per section so elements never disappear & re-type on scroll
    if (!sectionEl || this.typingEnqueuedSections.has(sectionEl)) return;
    this.typingEnqueuedSections.add(sectionEl);

    const candidates = Array.from(sectionEl.querySelectorAll('[data-agent-type]'));
    const perRoleCount = {};

    candidates.forEach((node) => {
      if (this.typingCompletedElements.has(node) || this.typingPreparedElements.has(node)) return;
      const roleId = node.dataset.agentType || 'development';
      perRoleCount[roleId] = (perRoleCount[roleId] || 0) + 1;

      if (perRoleCount[roleId] <= 2) {
        const job = this.prepareElementForTyping(node, this.roleColorMap[roleId]);
        if (job) this.typingQueue.push(job);
      }
    });

    this.cursors.forEach((cursor) => {
      if (!cursor.typingJob && !cursor.isInspecting) {
        this.startNextTypingJobForCursor(cursor);
      }
    });
  }

  startNextTypingJobForCursor(cursor) {
    if (!cursor || cursor.isInspecting || cursor.typingJob || this.typingQueue.length === 0) return;

    this.typingQueue = this.typingQueue.filter((j) => {
      const near = this.isRectNearViewport(j.el.getBoundingClientRect(), 160);
      if (!near) this.finishTypingJobImmediately(j);
      return near;
    });

    if (this.typingQueue.length === 0) return;

    let jobIdx = this.typingQueue.findIndex((j) => j.roleId === cursor.id);
    if (jobIdx === -1) jobIdx = 0;

    const [job] = this.typingQueue.splice(jobIdx, 1);
    if (!job) return;

    job.phase = 'moving';
    job.startedAt = performance.now();
    job.el.style.setProperty('--typing-caret-color', cursor.color);
    cursor.typingJob = job;

    const rect = job.el.getBoundingClientRect();
    cursor.tx = Math.max(20, Math.min(window.innerWidth - 60, rect.left + 6));
    cursor.ty = Math.max(54, Math.min(window.innerHeight - 36, rect.top + Math.min(18, rect.height * 0.5)));
  }

  finishTypingJobImmediately(job) {
    if (!job || !job.el) return;
    job.el.classList.remove('is-typing-pending', 'is-typing-active');
    if (job.ghostLayer && job.ghostLayer.parentNode) {
      job.ghostLayer.remove();
    }
    this.typingCompletedElements.add(job.el);
  }

  stepCursorTypingJob(cursor, now) {
    const job = cursor.typingJob;
    if (!job) return false;

    const elRect = job.el.getBoundingClientRect();
    if (!this.isRectNearViewport(elRect, 140)) {
      this.finishTypingJobImmediately(job);
      cursor.typingJob = null;
      cursor.el.classList.remove('is-typing');
      return false;
    }

    if (job.phase === 'moving') {
      const targetX = Math.max(20, Math.min(window.innerWidth - 60, elRect.left + 6));
      const targetY = Math.max(54, Math.min(window.innerHeight - 36, elRect.top + Math.min(18, elRect.height * 0.55)));
      cursor.tx = targetX;
      cursor.ty = targetY;

      if (Math.hypot(cursor.x - targetX, cursor.y - targetY) < 26 || now - job.startedAt > 520) {
        job.phase = 'typing';
        job.lastCharAt = now;
        job.el.classList.remove('is-typing-pending');
        job.el.classList.add('is-typing-active');
        cursor.el.classList.add('is-typing');
        this.spawnClickRipple(targetX, targetY, cursor.color);
      }
      return true;
    }

    if (job.phase === 'typing') {
      const totalLen = job.fullText.length;
      const charInterval = totalLen > 75 ? 14 : totalLen > 35 ? 20 : 28;
      const stepChars = totalLen > 95 ? 3 : totalLen > 48 ? 2 : 1;

      if (now - job.lastCharAt >= charInterval) {
        job.charIndex = Math.min(totalLen, job.charIndex + stepChars);
        job.typedTextSpan.textContent = job.fullText.slice(0, job.charIndex);
        job.lastCharAt = now;
      }

      const caretRect = job.caretPin.getBoundingClientRect();
      if (caretRect.width > 0 || caretRect.height > 0) {
        cursor.tx = Math.max(16, Math.min(window.innerWidth - 48, caretRect.left + 4));
        cursor.ty = Math.max(52, Math.min(window.innerHeight - 32, caretRect.top + caretRect.height * 0.65 + Math.sin(now * 0.045) * 1.4));
      }

      if (job.charIndex >= totalLen) {
        this.finishTypingJobImmediately(job);
        cursor.typingJob = null;
        cursor.el.classList.remove('is-typing');
        this.spawnClickRipple(cursor.x, cursor.y, cursor.color);
        this.startNextTypingJobForCursor(cursor);
      }
      return true;
    }

    return false;
  }

  async runIntroAndRevealSequence() {
    forceScrollTop();
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.48;

    const runOrbitPhase = (durationMs, startRadiusX, endRadiusX, mergeTags = false) =>
      new Promise((resolve) => {
        const start = performance.now();
        const unifiedColor = '#4B6B88';
        const step = (now) => {
          const t = Math.min(1, (now - start) / durationMs);
          const ease = 1 - Math.pow(1 - t, 2);
          const rx = startRadiusX + (endRadiusX - startRadiusX) * ease;
          const ry = rx * 0.52;
          const spin = now * 0.0052;

          this.cursors.forEach((c, i) => {
            const ang = spin + (i / this.cursors.length) * Math.PI * 2;
            c.tx = cx + Math.cos(ang) * rx;
            c.ty = cy + Math.sin(ang) * ry;
            c.el.classList.toggle('is-tags-hidden', mergeTags && t > 0.25);

            const targetColor = mergeTags
              ? lerpHexColor(c.color, unifiedColor, ease * 0.78)
              : lerpHexColor(c.currentColor, c.color, 0.25);
            if (targetColor !== c.currentColor) {
              c.currentColor = targetColor;
              c.pathEl.setAttribute('fill', targetColor);
            }
          });

          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

    await runOrbitPhase(1000, 290, 145, false);

    this.introStatusText.textContent = 'SYNCHRONIZING 5-AGENT CURSORS...';
    await runOrbitPhase(540, 145, 0, true);
    this.spawnClickRipple(cx, cy, '#4B8EB3');

    this.introStatusText.textContent = 'REVEALING COMPLETED PORTFOLIO...';
    await runOrbitPhase(460, 0, 165, false);
    this.cursors.forEach((c) => {
      c.el.classList.remove('is-tags-hidden');
      c.currentColor = c.color;
      c.pathEl.setAttribute('fill', c.color);
    });

    forceScrollTop();
    this.introCompleted = true;
    this.introOverlay.classList.add('is-hidden');

    await this.activateSectionAgents(this.sections.hero, true);

    this.mouseOrbitMode = true;
    this.headerStatusLabel.textContent = '5 AGENTS ACTIVE · SCROLL & INTERACT';
  }

  async activateSectionAgents(sectionEl, isHero = false) {
    if (!sectionEl || this.sectionActivated.has(sectionEl.id)) return;
    if (!this.isRectNearViewport(sectionEl.getBoundingClientRect(), 240)) return;

    this.sectionActivated.add(sectionEl.id);
    this.enqueueSectionTypingJobs(sectionEl);

    const inspectSelectors = isHero
      ? ['.hero-right', '.hero-link-chip', '.stat-card']
      : ['.philosophy-card', '.strength-card', '.project-row', '.timeline-item', '.skill-group', '.contact-card', '.hero-link-chip'];

    const inspectTargets = Array.from(sectionEl.querySelectorAll(inspectSelectors.join(', ')))
      .filter((node) => this.isRectNearViewport(node.getBoundingClientRect(), 120))
      .slice(0, 3);

    const inspectorPool = [this.cursors[0], this.cursors[1], this.cursors[3]];
    await Promise.all(
      inspectTargets.map(
        (target, idx) =>
          new Promise((res) => {
            setTimeout(() => {
              this.highlightRealElement(inspectorPool[idx % inspectorPool.length], target, 480).then(res);
            }, idx * 180);
          })
      )
    );
  }

  initContactSphere() {
    if (!this.sphereCanvas) return;
    const ctx = this.sphereCanvas.getContext('2d');
    const count = 96;
    const points = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      points.push({
        bx: Math.cos(theta) * radius,
        by: y,
        bz: Math.sin(theta) * radius,
        color: this.roles[i % this.roles.length].color
      });
    }

    this.sphereState = { ctx, points, rotY: 0, rotX: 0.25, hoverX: 0, hoverY: 0, isHovering: false };

    const resizeSphere = () => {
      const rect = this.sphereCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.sphereCanvas.width = Math.max(260, rect.width) * dpr;
      this.sphereCanvas.height = Math.max(240, rect.height) * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.sphereState.w = Math.max(260, rect.width);
      this.sphereState.h = Math.max(240, rect.height);
    };

    resizeSphere();
    window.addEventListener('resize', resizeSphere);

    this.sphereCanvas.addEventListener('mousemove', (e) => {
      const r = this.sphereCanvas.getBoundingClientRect();
      this.sphereState.hoverX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      this.sphereState.hoverY = ((e.clientY - r.top) / r.height - 0.5) * 2;
      this.sphereState.isHovering = true;
    });

    this.sphereCanvas.addEventListener('mouseleave', () => {
      this.sphereState.isHovering = false;
    });
  }

  renderContactSphere() {
    if (!this.sphereState) return;
    const { ctx, points, w, h, isHovering, hoverX, hoverY } = this.sphereState;
    if (!w || !h) return;

    ctx.clearRect(0, 0, w, h);

    this.sphereState.rotY += isHovering ? 0.016 + hoverX * 0.02 : 0.009;
    this.sphereState.rotX += isHovering ? (hoverY * 0.45 - this.sphereState.rotX) * 0.08 : (0.22 - this.sphereState.rotX) * 0.04;

    const cosY = Math.cos(this.sphereState.rotY);
    const sinY = Math.sin(this.sphereState.rotY);
    const cosX = Math.cos(this.sphereState.rotX);
    const sinX = Math.sin(this.sphereState.rotX);
    const radius = Math.min(w, h) * 0.36;
    const cx = w * 0.5;
    const cy = h * 0.5;

    const projected = points
      .map((p) => {
        const x1 = p.bx * cosY - p.bz * sinY;
        const z1 = p.bz * cosY + p.bx * sinY;
        const y2 = p.by * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.by * sinX;
        const scale = 2.4 / (2.8 - z2);
        const sx = cx + x1 * radius * scale;
        const sy = cy + y2 * radius * scale;
        return { sx, sy, z: z2, scale, color: p.color, angle: Math.atan2(sy - cy, sx - cx) };
      })
      .sort((a, b) => a.z - b.z);

    projected.forEach((pt) => {
      ctx.save();
      ctx.translate(pt.sx, pt.sy);
      ctx.rotate(pt.angle + Math.PI * 0.75);
      ctx.scale(pt.scale * 0.75, pt.scale * 0.75);
      ctx.globalAlpha = Math.max(0.24, Math.min(0.95, (pt.z + 1.2) / 2.2));
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(10, 4.5);
      ctx.lineTo(5.8, 6.2);
      ctx.lineTo(4.2, 10.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }

  animate(now) {
    const ctx = this.trailCtx;
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const timeSinceMove = now - this.pointer.lastMoveAt;
    const isPointerMoving = this.pointer.active && timeSinceMove < 120;
    const userRecentlyMovedMouse = this.pointer.active && timeSinceMove < 1500;
    const userRecentlyScrolled = now - this.lastScrollAt < 1800;

    const anyAgentTyping = this.typingQueue.length > 0 || this.cursors.some((c) => Boolean(c.typingJob));
    const anyAgentInspecting = this.cursors.some((c) => c.isInspecting);

    const usePointerClusterMode =
      this.mouseOrbitMode &&
      userRecentlyMovedMouse &&
      !userRecentlyScrolled &&
      !anyAgentInspecting &&
      (!anyAgentTyping || isPointerMoving);

    if (usePointerClusterMode) {
      const targetMerge = isPointerMoving ? 1 : 0;
      this.clusterMergeFactor += (targetMerge - this.clusterMergeFactor) * (isPointerMoving ? 0.24 : 0.12);
      this.orbitAngle += 0.0072 * (1 - this.clusterMergeFactor * 0.7);

      const hideRoleTags = this.clusterMergeFactor > 0.18;
      const unifiedBlendColor = '#4B6B88';

      this.cursors.forEach((c, idx) => {
        if (c.typingJob) c.el.classList.remove('is-typing');
        const slotAngle = this.orbitAngle + (idx / this.cursors.length) * Math.PI * 2;
        const currentRadius = (46 + idx * 4) * (1 - this.clusterMergeFactor);
        c.tx = this.pointer.x + Math.cos(slotAngle) * currentRadius;
        c.ty = this.pointer.y + Math.sin(slotAngle) * currentRadius;
        c.el.classList.toggle('is-tags-hidden', hideRoleTags);

        const blended = lerpHexColor(c.color, unifiedBlendColor, this.clusterMergeFactor * 0.78);
        if (blended !== c.currentColor) {
          c.currentColor = blended;
          c.pathEl.setAttribute('fill', blended);
        }
      });
    } else if (this.mouseOrbitMode) {
      this.clusterMergeFactor += (0 - this.clusterMergeFactor) * 0.15;
      const currentSec = this.findCurrentViewportSection();

      this.cursors.forEach((c, idx) => {
        if (c.isInspecting) return;

        c.el.classList.remove('is-tags-hidden');
        if (c.currentColor !== c.color) {
          c.currentColor = c.color;
          c.pathEl.setAttribute('fill', c.color);
        }

        if (!c.typingJob) this.startNextTypingJobForCursor(c);
        if (c.typingJob && this.stepCursorTypingJob(c, now)) return;

        if (now >= c.nextPatrolAt || !c.patrolElement || !this.isRectNearViewport(c.patrolElement.getBoundingClientRect(), 60)) {
          this.assignCursorToViewportSection(c, idx, currentSec);
        } else {
          const r = c.patrolElement.getBoundingClientRect();
          const slot = ROLE_SLOT_OFFSET[c.id] || { x: 0.5, y: 0.5 };
          c.tx = Math.max(24, Math.min(w - 88, r.left + Math.min(r.width * slot.x, r.width - 10) + Math.cos(now * 0.002 + idx * 1.3) * 12));
          c.ty = Math.max(60, Math.min(h - 42, r.top + Math.min(r.height * slot.y, 26) + Math.sin(now * 0.0024 + idx * 1.7) * 7));
        }
      });
    }

    this.cursors.forEach((c) => {
      const easeFactor = c.isInspecting
        ? 0.42
        : c.typingJob && c.typingJob.phase === 'typing'
          ? 0.34
          : c.ease + this.clusterMergeFactor * 0.16;
      c.x += (c.tx - c.x) * easeFactor;
      c.y += (c.ty - c.y) * easeFactor;
      c.el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0)`;

      c.history.push({ x: c.x, y: c.y });
      if (c.history.length > 14) c.history.shift();

      if (c.history.length > 2) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(c.history[0].x, c.history[0].y);
        for (let i = 1; i < c.history.length; i++) ctx.lineTo(c.history[i].x, c.history[i].y);
        ctx.strokeStyle = c.currentColor;
        ctx.globalAlpha = 0.24 * (1 - this.clusterMergeFactor * 0.5);
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }
    });

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.025;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    this.renderContactSphere();
    requestAnimationFrame(this.animate);
  }
}

window.addEventListener('pageshow', forceScrollTop);
window.addEventListener('beforeunload', forceScrollTop);

window.addEventListener('DOMContentLoaded', () => {
  forceScrollTop();
  if (window.PORTFOLIO_DATA) {
    new PortfolioApp(window.PORTFOLIO_DATA);
  }
});
