(function () {
  'use strict';

  // ---- Cursor glow (desktop only) ----
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ---- Navigation scroll effect ----
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Scroll reveal ----
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el, index) => {
    if (el.closest('.hero-content')) {
      el.style.transitionDelay = `${index * 0.12}s`;
    }
    revealObserver.observe(el);
  });

  // ---- Animated counters ----
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ---- Project card tilt + spotlight effect ----
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (window.matchMedia('(pointer: fine)').matches) {
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', px + '%');
        card.style.setProperty('--mouse-y', py + '%');
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
      });
    });
  }

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach((a) => {
            a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-20% 0px -60% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // ---- Contact form handling ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const wrapper = contactForm.closest('.contact-content');

      const name = document.getElementById('name')?.value || '';
      const message = document.getElementById('message')?.value || '';

      const subjectText = `Query from ${name}`;
      const bodyText = `Hi Rachna,\n\n${message}\n\nFrom: ${name}`;

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=rachnaramakrishnan10@gmail.com&su=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
      const mailtoUrl = `mailto:rachnaramakrishnan10@gmail.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

      // Attempt to open Gmail compose in new tab, or fallback to mailto
      const win = window.open(gmailUrl, '_blank');
      if (!win) {
        window.location.href = mailtoUrl;
      }

      // Hide form & display clean confirmation
      contactForm.style.display = 'none';
      const contactLinks = document.querySelector('.contact-links');
      if (contactLinks) contactLinks.style.display = 'none';

      const success = document.createElement('div');
      success.className = 'form-success reveal visible';
      success.style.padding = '2.2rem 2rem';
      success.style.background = 'rgba(13, 22, 40, 0.9)';
      success.style.border = '1px solid rgba(56, 189, 248, 0.4)';
      success.style.borderRadius = '20px';
      success.style.marginTop = '1.5rem';
      success.style.textAlign = 'center';
      success.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(56, 189, 248, 0.15)';
      success.innerHTML = `
        <div style="width: 50px; height: 50px; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #38bdf8; font-size: 1.5rem;">✉</div>
        <h3 style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; color: #ffffff; margin-bottom: 0.5rem;">Taking you to Email...</h3>
        <p style="color: #94a3b8; font-size: 0.98rem; line-height: 1.6; max-width: 520px; margin: 0 auto 1.5rem;">
          Thank you, <strong>${name}</strong>! Your email compose window has been opened with your queries pre-filled for <strong>rachnaramakrishnan10@gmail.com</strong>.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="${gmailUrl}" target="_blank" class="btn-get-in-touch" style="padding: 0.8rem 1.8rem; background: linear-gradient(135deg, #ea4335 0%, #ff5252 100%); color: #ffffff;">
            Open Gmail Web ↗
          </a>
          <a href="${mailtoUrl}" class="btn-get-in-touch" style="padding: 0.8rem 1.8rem; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(56, 189, 248, 0.4); color: #ffffff;">
            Open Email App ↗
          </a>
        </div>
      `;
      wrapper.appendChild(success);
    });
  }

  // ---- Smooth anchor offset fix on load ----
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  // ---- 3D Constellation & Polygon Mesh Background Canvas Engine ----
  const canvas = document.getElementById('constellation-3d-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    // 3D Nodes array
    const nodeCount = Math.min(Math.floor((width * height) / 14000), 75);
    const nodes = [];
    const focalLength = 400;

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    document.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    }, { passive: true });

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 600 - 300,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1.2,
        color: Math.random() > 0.4 ? '#38bdf8' : '#c084fc'
      });
    }

    // 3D Geometric Facets array (matching low-poly geometric dark blue background in sample image)
    const facetCount = 14;
    const facets = [];
    for (let f = 0; f < facetCount; f++) {
      const cx = (Math.random() - 0.5) * width * 1.2;
      const cy = (Math.random() - 0.5) * height * 1.2;
      const cz = Math.random() * 400 - 200;
      const size = Math.random() * 90 + 40;
      facets.push({
        p1: { x: cx, y: cy, z: cz },
        p2: { x: cx + size * (Math.random() - 0.5), y: cy + size * (Math.random() - 0.5), z: cz + 40 },
        p3: { x: cx + size * (Math.random() - 0.5), y: cy + size * (Math.random() - 0.5), z: cz - 40 }
      });
    }

    function render3D() {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const offsetX = (mouse.x - width / 2) * 0.08;
      const offsetY = (mouse.y - height / 2) * 0.08;

      // Render Facets (Background dark poly facets matching user sample)
      facets.forEach((f) => {
        const project = (p) => {
          const z = p.z + focalLength;
          const scale = focalLength / Math.max(z, 1);
          return {
            x: width / 2 + (p.x + offsetX * 0.4) * scale,
            y: height / 2 + (p.y + offsetY * 0.4) * scale,
            scale
          };
        };

        const proj1 = project(f.p1);
        const proj2 = project(f.p2);
        const proj3 = project(f.p3);

        ctx.beginPath();
        ctx.moveTo(proj1.x, proj1.y);
        ctx.lineTo(proj2.x, proj2.y);
        ctx.lineTo(proj3.x, proj3.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 0.8;
        ctx.fill();
        ctx.stroke();
      });

      // Update & Project 3D Nodes
      const projectedNodes = nodes.map((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        if (Math.abs(node.x) > width * 0.85) node.vx *= -1;
        if (Math.abs(node.y) > height * 0.85) node.vy *= -1;
        if (Math.abs(node.z) > 350) node.vz *= -1;

        const scale = focalLength / (focalLength + node.z);
        const px = width / 2 + (node.x + offsetX) * scale;
        const py = height / 2 + (node.y + offsetY) * scale;

        return { px, py, scale, node };
      });

      // Render 3D Constellation Connections
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          const dx = n1.px - n2.px;
          const dy = n1.py - n2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 155) {
            const alpha = (1 - dist / 155) * 0.38 * Math.min(n1.scale, n2.scale);
            ctx.beginPath();
            ctx.moveTo(n1.px, n1.py);
            ctx.lineTo(n2.px, n2.py);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.9 * Math.min(n1.scale, n2.scale);
            ctx.stroke();
          }
        }
      }

      // Render 3D Glowing Nodes
      projectedNodes.forEach(({ px, py, scale, node }) => {
        const r = node.radius * scale;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(r, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12 * scale;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(render3D);
    }
    render3D();
  }
})();
