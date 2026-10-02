/**
 * Rania Ahmed - Junior Flutter Developer Portfolio
 * Vanilla JavaScript Interactivity & Behavior
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========================================================================
  // 1. Theme Toggle (Dark / Light Mode)
  // ========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const THEME_STORAGE_KEY = 'rania_portfolio_theme';

  // Determine initial theme: Check localStorage first, otherwise default to 'dark'
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const initialTheme = savedTheme ? savedTheme : 'dark';

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    });
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      themeToggleBtn.setAttribute('aria-label', label);
      themeToggleBtn.setAttribute('title', label);
    }

    // Update meta theme-color tag to match theme background
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#111318' : '#F7F8FC');
    }
  }

  // ========================================================================
  // 2. Mobile Navigation Drawer
  // ========================================================================
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileCloseBtn = document.getElementById('mobile-menu-close');
  const mobileDrawer = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');

  function openMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileToggleBtn) {
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileToggleBtn) {
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close mobile drawer when clicking any navigation link
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ========================================================================
  // 3. Scroll Reveal Animations (Intersection Observer)
  // ========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // If user prefers reduced motion, reveal everything immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers without Intersection Observer
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ========================================================================
  // 4. Active Navigation Highlighting on Scroll (Scrollspy)
  // ========================================================================
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-desktop .nav-link');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = 90; // offset

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - headerHeight;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        // Also update mobile active class
        mobileLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ========================================================================
  // 5. Floating Back to Top Button
  // ========================================================================
  const floatingTopBtn = document.getElementById('floating-back-to-top');

  function toggleFloatingTop() {
    if (!floatingTopBtn) return;
    if (window.scrollY > 400) {
      floatingTopBtn.classList.add('visible');
    } else {
      floatingTopBtn.classList.remove('visible');
    }
  }

  if (floatingTopBtn) {
    window.addEventListener('scroll', toggleFloatingTop, { passive: true });
    floatingTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  // ========================================================================
  // 6. Dynamic Copyright Year
  // ========================================================================
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ========================================================================
  // 7. Contact Form Validation & Frontend-Only Mailto Helper
  // ========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const subjectInput = document.getElementById('form-subject');
  const messageInput = document.getElementById('form-message');
  const formFeedback = document.getElementById('form-feedback');
  const feedbackMailtoLink = document.getElementById('feedback-mailto-link');
  const feedbackCopyBtn = document.getElementById('feedback-copy-btn');

  // Input Error Message Elements
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function clearErrors() {
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) input.classList.remove('input-error');
    });
    [nameError, emailError, subjectError, messageError].forEach(msg => {
      if (msg) msg.classList.remove('visible');
    });
  }

  // Real-time error clearance on input
  [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
    if (field) {
      field.addEventListener('input', () => {
        field.classList.remove('input-error');
        const errSpan = field.parentElement.querySelector('.form-error-msg');
        if (errSpan) errSpan.classList.remove('visible');
      });
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      // Validate Name
      if (!nameVal) {
        if (nameInput) nameInput.classList.add('input-error');
        if (nameError) nameError.classList.add('visible');
        isValid = false;
      }

      // Validate Email
      if (!emailVal || !emailRegex.test(emailVal)) {
        if (emailInput) emailInput.classList.add('input-error');
        if (emailError) emailError.classList.add('visible');
        isValid = false;
      }

      // Validate Subject
      if (!subjectVal) {
        if (subjectInput) subjectInput.classList.add('input-error');
        if (subjectError) subjectError.classList.add('visible');
        isValid = false;
      }

      // Validate Message (min 10 characters)
      if (!messageVal || messageVal.length < 10) {
        if (messageInput) messageInput.classList.add('input-error');
        if (messageError) messageError.classList.add('visible');
        isValid = false;
      }

      if (!isValid) {
        // Focus first invalid input
        const firstError = contactForm.querySelector('.input-error');
        if (firstError) firstError.focus();
        return;
      }

      // Format email body and mailto link
      const emailRecipient = 'raniaezzat135@gmail.com';
      const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectVal}`);
      const mailtoBody = encodeURIComponent(
        `Hi Rania,\n\nName: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}\n\n---\nSent from your portfolio website.`
      );

      const mailtoUrl = `mailto:${emailRecipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Update feedback box
      if (feedbackMailtoLink) {
        feedbackMailtoLink.setAttribute('href', mailtoUrl);
      }

      // Setup clipboard copy button
      if (feedbackCopyBtn) {
        const fullDraftText = `To: ${emailRecipient}\nSubject: [Portfolio Inquiry] ${subjectVal}\n\nHi Rania,\nName: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`;

        feedbackCopyBtn.onclick = () => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(fullDraftText).then(() => {
              const originalText = feedbackCopyBtn.textContent;
              feedbackCopyBtn.textContent = 'Copied to Clipboard!';
              feedbackCopyBtn.classList.add('btn-primary');
              feedbackCopyBtn.classList.remove('btn-secondary');
              setTimeout(() => {
                feedbackCopyBtn.textContent = originalText;
                feedbackCopyBtn.classList.remove('btn-primary');
                feedbackCopyBtn.classList.add('btn-secondary');
              }, 2500);
            }).catch(() => {
              window.prompt('Copy your message draft:', fullDraftText);
            });
          } else {
            window.prompt('Copy your message draft:', fullDraftText);
          }
        };
      }

      // Show feedback card smoothly
      if (formFeedback) {
        formFeedback.removeAttribute('hidden');
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Automatically open email client
      window.location.href = mailtoUrl;
    });
  }
});
