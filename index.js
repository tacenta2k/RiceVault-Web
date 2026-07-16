// ===== RiceVault — Landing Page Scripts =====

document.addEventListener('DOMContentLoaded', () => {
  initTerminalIntro();
  initScrollReveal();
  initBentoTilt();
  initParticles();
  initCopyButton();
  initNavScroll();
  initDemoTerminal();
});

// ──────────────────────────────────────────────
// 1. Cinematic Terminal Intro
// ──────────────────────────────────────────────
function initTerminalIntro() {
  const overlay = document.getElementById('intro-overlay');
  const promptLine = document.getElementById('term-prompt');
  const commandSpan = document.getElementById('term-command');
  const cursorSpan = document.getElementById('term-cursor');
  const outputLines = document.querySelectorAll('.term-output-line');
  const heroWrapper = document.querySelector('.hero-content-wrapper');

  const command = 'rice backup';
  let charIndex = 0;

  // Disable page scroll during intro
  document.body.style.overflow = 'hidden';

  // Show prompt line
  setTimeout(() => {
    promptLine.classList.add('visible');
  }, 400);

  // Type the command character by character
  setTimeout(() => {
    const typeInterval = setInterval(() => {
      if (charIndex < command.length) {
        commandSpan.textContent += command[charIndex];
        charIndex++;
      } else {
        clearInterval(typeInterval);
        // Hide cursor after typing completes
        setTimeout(() => {
          cursorSpan.style.display = 'none';
          // Show output lines one by one
          showOutputLines(outputLines, () => {
            // After all lines shown, fade out overlay cinematically
            setTimeout(() => {
              overlay.classList.add('fade-out');
              document.body.style.overflow = '';

              // Trigger hero scale-up entrance as overlay fades
              if (heroWrapper) {
                heroWrapper.classList.add('hero-visible');
              }

              // Remove overlay from DOM after 1.5s transition completes
              setTimeout(() => {
                overlay.remove();
              }, 1600);
            }, 800);
          });
        }, 300);
      }
    }, 80);
  }, 900);
}

function showOutputLines(lines, callback) {
  let index = 0;
  const interval = setInterval(() => {
    if (index < lines.length) {
      lines[index].classList.add('visible');
      index++;
    } else {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 350);
}

// ──────────────────────────────────────────────
// 2. Scroll Reveal (Intersection Observer)
// ──────────────────────────────────────────────
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ──────────────────────────────────────────────
// 3. 3D Tilt Effect for Bento Cards
// ──────────────────────────────────────────────
function initBentoTilt() {
  const cards = document.querySelectorAll('.bento-card');

  cards.forEach(card => {
    const inner = card.querySelector('.bento-card-inner');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// ──────────────────────────────────────────────
// 4. Floating Particles in Hero
// ──────────────────────────────────────────────
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const particleCount = 35;
  const colors = [
    'rgba(59, 130, 246, 0.4)',
    'rgba(34, 211, 238, 0.35)',
    'rgba(139, 92, 246, 0.3)',
    'rgba(34, 197, 94, 0.2)',
  ];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 4 + 1;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 12 + 10;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      background: ${color};
      box-shadow: 0 0 ${size * 3}px ${color};
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;

    container.appendChild(particle);
  }
}

// ──────────────────────────────────────────────
// 5. Copy Button
// ──────────────────────────────────────────────
function initCopyButton() {
  const copyBtn = document.getElementById('copy-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const code = document.getElementById('install-code');
    if (!code) return;

    // Get text content without the prompt symbols
    const lines = code.innerText
      .split('\n')
      .map(line => line.replace(/^\$\s?/, '').trim())
      .filter(line => line && !line.startsWith('#'))
      .join('\n');

    navigator.clipboard.writeText(lines).then(() => {
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!';

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy';
      }, 2500);
    }).catch(() => {
      // Fallback for non-HTTPS
      const textarea = document.createElement('textarea');
      textarea.value = lines;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      copyBtn.classList.add('copied');
      copyBtn.textContent = '✓ Copied!';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.textContent = '⎘ Copy';
      }, 2500);
    });
  });
}

// ──────────────────────────────────────────────
// 6. Navbar Glass Effect on Scroll
// ──────────────────────────────────────────────
function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 60) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ──────────────────────────────────────────────
// 7. Live Demo Terminal (Typing Animation)
// ──────────────────────────────────────────────
function initDemoTerminal() {
  const terminal = document.getElementById('demo-terminal');
  const typewriter = document.getElementById('demo-typewriter');
  const cursor = document.getElementById('demo-cursor');
  const output = document.getElementById('demo-output');

  if (!terminal || !typewriter || !output) return;

  const command = 'rice backup';
  let charIndex = 0;
  let hasPlayed = false;

  // Only start typing when the demo section scrolls into view
  const demoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasPlayed) {
        hasPlayed = true;
        demoObserver.unobserve(entry.target);

        // Start typing after a short delay
        setTimeout(() => {
          const typeInterval = setInterval(() => {
            if (charIndex < command.length) {
              typewriter.textContent += command[charIndex];
              charIndex++;
            } else {
              clearInterval(typeInterval);
              // Hide cursor and show output
              setTimeout(() => {
                if (cursor) cursor.style.display = 'none';
                output.style.display = 'block';

                // Stagger the output lines for a realistic feel
                const lines = output.querySelectorAll('p');
                lines.forEach((line, i) => {
                  line.style.opacity = '0';
                  line.style.transform = 'translateY(6px)';
                  line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                  setTimeout(() => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateY(0)';
                  }, i * 300);
                });
              }, 400);
            }
          }, 100);
        }, 600);
      }
    });
  }, { threshold: 0.3 });

  demoObserver.observe(terminal);
}
