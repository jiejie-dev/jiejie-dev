/* ==========================================================================
   JieJie.Dev — interactions, matrix rain, blog data
   ========================================================================== */

/* ---------- Blog Posts (demo data — replace via fetch / CMS as needed) ---------- */
const POSTS = [
  {
    title: 'Building AI Apps on the Full Stack',
    excerpt: 'How I wire LLMs, vector stores and a Vue front-end into something users actually want to use.',
    tag: 'AI',
    glyph: '◭',
    date: '2026-05-12',
    url: '#',
  },
  {
    title: 'From Docker Compose to Zero-Downtime Deploys',
    excerpt: 'A pragmatic playbook for shipping side projects to production without losing weekends.',
    tag: 'DevOps',
    glyph: '⬢',
    date: '2026-04-02',
    url: '#',
  },
  {
    title: 'Vue 3 + React, Why Not Both?',
    excerpt: 'On choosing the right tool per surface, and when micro-frontends actually pay off.',
    tag: 'Frontend',
    glyph: '⬡',
    date: '2026-03-18',
    url: '#',
  },
  {
    title: 'Notes on Go for Backend Engineers',
    excerpt: 'Idiomatic Go, goroutine pitfalls, and a tiny framework I stitched together over a weekend.',
    tag: 'Backend',
    glyph: '◧',
    date: '2026-02-04',
    url: '#',
  },
  {
    title: 'A Terminal Aesthetic for the Web',
    excerpt: 'How to ship a CRT-look without sacrificing UX. Colors, scanlines, and where to stop.',
    tag: 'Design',
    glyph: '▣',
    date: '2026-01-20',
    url: '#',
  },
  {
    title: 'Self-Hosted Everything: A 2026 Checklist',
    excerpt: 'Mail, analytics, secrets, CI — the boring infra stack that makes indie work sustainable.',
    tag: 'Self-Host',
    glyph: '◐',
    date: '2025-12-30',
    url: '#',
  },
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

function renderPosts() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;
  grid.innerHTML = POSTS.map((p) => `
    <a class="post-card reveal" href="${p.url}" target="_blank" rel="noopener">
      <div class="post-thumb">
        <span class="post-thumb-glyph">${p.glyph}</span>
      </div>
      <div class="post-meta">
        <span class="post-tag">${p.tag}</span>
        <span>${formatDate(p.date)}</span>
        <span>·</span>
        <span>${Math.ceil(p.excerpt.length / 12)} min read</span>
      </div>
      <div class="post-body">
        <h3 class="post-title">${p.title}</h3>
        <p class="post-excerpt">${p.excerpt}</p>
        <span class="post-link">read_post <span>→</span></span>
      </div>
    </a>
  `).join('');
}

/* ---------- Matrix Rain ---------- */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, columns, drops;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()[]{}<>+=∆∑πΩµ∞◇◆◈◉◊';
  const fontSize = 14;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = Array(columns).fill(0).map(() => Math.random() * height / fontSize);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    // Faded overlay for trail effect
    ctx.fillStyle = 'rgba(5, 6, 10, 0.06)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px "Fira Code", monospace`;

    for (let i = 0; i < columns; i++) {
      const char = chars.charAt(Math.floor(Math.random() * chars.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Bright head
      ctx.fillStyle = '#00ff88';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 8;
      ctx.fillText(char, x, y);

      // Random cyan accent chars
      if (Math.random() > 0.97) {
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.fillText(char, x, y);
      }

      ctx.shadowBlur = 0;

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.85;
    }
  }

  let raf;
  function loop() {
    draw();
    raf = requestAnimationFrame(loop);
  }

  // Pause when tab is hidden — saves CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      loop();
    }
  });

  loop();
}

/* ---------- Custom Cursor ---------- */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0;
  let fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
  });

  function animateFollower() {
    fx += (mx - fx) * 0.18;
    fy += (my - fy) * 0.18;
    follower.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverables = document.querySelectorAll('a, button, .btn, .skill-card, .post-card, .contact-card, .stat-card');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => follower.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('is-hover'));
  });
}

/* ---------- Terminal Typing Effect ---------- */
function typeInto(el, text, speed = 55) {
  return new Promise((resolve) => {
    let i = 0;
    function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed + Math.random() * 30);
      } else {
        resolve();
      }
    }
    step();
  });
}

async function initTerminalTyping() {
  const intro = document.getElementById('typed-intro');
  const tagline = document.getElementById('typed-tagline');
  if (!intro || !tagline) return;

  await typeInto(intro, " whoami", 70);
  // small pause
  await new Promise((r) => setTimeout(r, 400));
  await typeInto(tagline, " echo \"Full Stack Engineer · AI tinkerer · side-project addict\"", 35);
}

/* ---------- Nav scroll state ---------- */
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal, .skill-card, .post-card, .stat-card, .contact-card, .about-card');
  items.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Trigger skill bar fill
          const fill = entry.target.querySelector?.('.skill-fill');
          if (fill && fill.dataset.width == null) {
            fill.dataset.width = fill.style.getPropertyValue('--w');
            fill.style.width = '0';
            requestAnimationFrame(() => {
              setTimeout(() => { fill.style.width = fill.dataset.width; }, 50);
            });
          }
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => io.observe(el));
}

/* ---------- 3D Tilt on cards ---------- */
function initTilt() {
  const tiltEls = document.querySelectorAll('.post-card, .about-card');
  tiltEls.forEach((el) => {
    const inner = el.classList.contains('post-card') ? el : el.querySelector('.card-inner') || el;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);

      const rotateY = ((x - 50) / 50) * 6;
      const rotateX = -((y - 50) / 50) * 6;
      inner.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
    });
  });
}

/* ---------- Stat Counter ---------- */
function initStatCounter() {
  const nums = document.querySelectorAll('.stat-num');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = el.dataset.count;
        if (!target) return;
        if (target === '∞') {
          el.textContent = '∞';
        } else {
          const n = parseInt(target, 10);
          let current = 0;
          const duration = 1400;
          const start = performance.now();
          function tick(now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            current = Math.floor(eased * n);
            el.textContent = current;
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = n;
          }
          requestAnimationFrame(tick);
        }
        io.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  nums.forEach((n) => io.observe(n));
}

/* ---------- Footer year ---------- */
function initFooter() {
  const y = document.getElementById('footer-year');
  if (y) y.textContent = `© ${new Date().getFullYear()} jiejie-dev`;
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderPosts();
  initMatrixRain();
  initCursor();
  initTerminalTyping();
  initNavScroll();
  initReveal();
  initTilt();
  initStatCounter();
  initFooter();
});