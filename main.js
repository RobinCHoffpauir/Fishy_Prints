(function () {
  'use strict';

  // 1. Sticky header — add .scrolled after 80px
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  // 2. Mobile nav hamburger toggle
  const hamburger = document.querySelector('.nav-hamburger');
  const navDrawer  = document.getElementById('nav-links-mobile');

  if (hamburger && navDrawer) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = document.body.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (document.body.classList.contains('nav-open') && !e.target.closest('#site-header')) {
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on drawer link click
    navDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }

  // 3. Scroll reveal via IntersectionObserver
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all immediately
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.classList.add('revealed');
    });
  }

  // 4. Email signup form — client-side validation
  const joinForm = document.querySelector('.join-form');
  const joinNote = document.querySelector('.join-note');

  if (joinForm && joinNote) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = joinForm.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.trim() : '';
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!valid) {
        joinNote.textContent = 'Please enter a valid email address.';
        joinNote.style.color = 'rgba(255,255,255,0.45)';
        emailInput && emailInput.focus();
        return;
      }

      // TODO: replace with Shopify/Klaviyo API call
      // e.g. POST to your Klaviyo list endpoint or Shopify newsletter form action
      joinNote.textContent = "You're in! Welcome to the crew.";
      joinNote.style.color = '#ffffff';
      joinForm.reset();
    });
  }

})();
