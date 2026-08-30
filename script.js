/**
 * Rishikesh Pandey - Portfolio Interactive Script
 * Modern, high-performance interactions, particle canvas, filter system, and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypewriter();
  initNavbarScroll();
  initMobileMenu();
  initProjectFilter();
  initSkillsFilter();
  initScrollSpy();
  initScrollToTop();
  initContactForm();
  initCopyEmail();
  initScrollAnimations();
});

/* =========================================
   1. Interactive Particle Canvas Background
========================================= */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 70);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.color = Math.random() > 0.4 ? 'rgba(124, 92, 255,' : 'rgba(0, 240, 255,';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          let angle = Math.atan2(dy, dx);
          let force = (mouse.radius - dist) / mouse.radius;
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.hypot(dx, dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124, 92, 255, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* =========================================
   2. Dynamic Role Typewriter in Hero
========================================= */
function initTypewriter() {
  const typeTarget = document.getElementById('typewriter-text');
  if (!typeTarget) return;

  const roles = [
    'Full Stack Developer',
    'Frontend Craftsman',
    'UI / UX Enthusiast',
    'Creative Web Developer',
    'Open-Source Contributor'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typeTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typeTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 95;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* =========================================
   3. Navbar Scroll & Background Blur
========================================= */
function initNavbarScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* =========================================
   4. Mobile Hamburger Menu
========================================= */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  if (!toggleBtn || !navLinks) return;

  function toggleMenu(isOpen) {
    const active = typeof isOpen === 'boolean' ? isOpen : !navLinks.classList.contains('active');
    toggleBtn.classList.toggle('active', active);
    navLinks.classList.toggle('active', active);
    if (navOverlay) navOverlay.classList.toggle('active', active);
    document.body.style.overflow = active ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', () => toggleMenu());
  if (navOverlay) navOverlay.addEventListener('click', () => toggleMenu(false));

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/* =========================================
   5. Project Filtering System
========================================= */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hide');
          setTimeout(() => {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hide');
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* =========================================
   6. Skills Category Filtering
========================================= */
function initSkillsFilter() {
  const skillBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!skillBtns.length || !skillCards.length) return;

  skillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-skill-filter');

      skillCards.forEach(card => {
        const itemCat = card.getAttribute('data-skill-category') || '';
        if (cat === 'all' || itemCat.includes(cat)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* =========================================
   7. ScrollSpy Active Section Indicator
========================================= */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* =========================================
   8. Scroll Progress & Scroll-to-Top Button
========================================= */
function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-to-top');
  const progressPath = document.querySelector('.scroll-progress-circle path');

  if (!scrollBtn) return;

  let pathLength = 0;
  if (progressPath) {
    pathLength = progressPath.getTotalLength();
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;
  }

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    if (progressPath) {
      progressPath.style.strokeDashoffset = pathLength - (progress * pathLength);
    }

    if (scrollTop > 350) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateProgress);

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* =========================================
   9. Contact Form & Toast Notifications
========================================= */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim() || 'Portfolio Inquiry';
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Sending...</span>`;
    submitBtn.disabled = true;

    // Simulate sending & open mailto fallback
    setTimeout(() => {
      showToast(`Thank you, ${name}! Opening your email client...`, 'success');

      const mailtoUrl = `mailto:pandeyrishi0810@email.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;

      window.location.href = mailtoUrl;

      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 900);
  });
}

function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* =========================================
   10. Copy Email to Clipboard
========================================= */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  const emailToCopy = 'pandeyrishi0810@email.com';

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(emailToCopy).then(() => {
        showToast('Email address copied to clipboard!', 'success');
        const tooltip = btn.querySelector('.copy-tooltip');
        if (tooltip) {
          const prevText = tooltip.textContent;
          tooltip.textContent = 'Copied!';
          setTimeout(() => {
            tooltip.textContent = prevText;
          }, 2000);
        }
      }).catch(() => {
        showToast(`Email: ${emailToCopy}`, 'info');
      });
    });
  });
}

/* =========================================
   11. Intersection Observer Scroll Reveal
========================================= */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}
