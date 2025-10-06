/**
 * Stella's Ink Chamber - Interactive Components & Analytics
 */

// Analytics Event Tracking
function trackEvent(eventName, eventData = {}) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
  }

  // Console log for development
  console.log('📊 Event tracked:', eventName, eventData);
}

// Table of Contents - Active Section Highlighting
class TableOfContents {
  constructor() {
    this.sections = document.querySelectorAll('h2[id], h3[id]');
    this.tocLinks = document.querySelectorAll('.toc-list a');
    this.options = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    this.init();
  }

  init() {
    if (!this.sections.length || !this.tocLinks.length) return;

    // Intersection Observer for active section
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.setActiveLink(entry.target.id);
        }
      });
    }, this.options);

    this.sections.forEach(section => observer.observe(section));

    // Smooth scroll on TOC link click
    this.tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);

        if (target) {
          const yOffset = -20;
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
          trackEvent('toc_link_click', { section: targetId });
        }
      });
    });
  }

  setActiveLink(id) {
    this.tocLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      if (href === id) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Mobile TOC Sheet
class MobileTOC {
  constructor() {
    this.toggle = document.querySelector('.toc-mobile-toggle');
    this.sheet = document.querySelector('.toc-mobile-sheet');
    this.content = document.querySelector('.toc-mobile-content');

    this.init();
  }

  init() {
    if (!this.toggle || !this.sheet) return;

    this.toggle.addEventListener('click', () => {
      this.open();
      trackEvent('toc_open_mobile');
    });

    // Close on backdrop click
    this.sheet.addEventListener('click', (e) => {
      if (e.target === this.sheet) {
        this.close();
      }
    });

    // Close on link click
    const links = this.sheet.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        this.close();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.sheet.classList.contains('open')) {
        this.close();
      }
    });
  }

  open() {
    this.sheet.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.sheet.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Sticky CTA Behavior
class StickyCTA {
  constructor() {
    this.cta = document.querySelector('.sticky-cta');
    this.lastScrollY = window.scrollY;

    this.init();
  }

  init() {
    if (!this.cta) return;

    // Hide on scroll down, show on scroll up
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
        // Scrolling down
        this.cta.classList.add('hidden');
      } else {
        // Scrolling up
        this.cta.classList.remove('hidden');
      }

      this.lastScrollY = currentScrollY;
    });

    // Track CTA clicks
    const ctaButtons = this.cta.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
      button.addEventListener('click', () => {
        trackEvent('cta_book_click', {
          location: 'sticky_bar',
          cta_text: button.textContent.trim()
        });
      });
    });
  }
}

// Lead Magnet Form
class LeadMagnetForm {
  constructor() {
    this.forms = document.querySelectorAll('.lead-magnet-form');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = form.querySelector('input[type="email"]').value;

        if (this.validateEmail(email)) {
          this.submitForm(email, form);
        } else {
          this.showError(form, 'Please enter a valid email address');
        }
      });
    });
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async submitForm(email, form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
      // Track submission
      trackEvent('leadmagnet_submit', {
        email_domain: email.split('@')[1],
        form_location: form.dataset.location || 'inline'
      });

      // TODO: Replace with actual form submission endpoint
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to thank you page with PDF download
      window.location.href = '/thank-you.html?download=smp-guide';

    } catch (error) {
      console.error('Form submission error:', error);
      this.showError(form, 'Something went wrong. Please try again.');
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  showError(form, message) {
    let errorEl = form.querySelector('.form-error');

    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      errorEl.style.color = '#ef4444';
      errorEl.style.fontSize = '0.875rem';
      errorEl.style.marginTop = '0.5rem';
      form.appendChild(errorEl);
    }

    errorEl.textContent = message;
    setTimeout(() => errorEl.remove(), 5000);
  }
}

// Resource Navigation Tracking
class ResourceNavigation {
  constructor() {
    this.resourceLinks = document.querySelectorAll('[data-resource-link]');
    this.init();
  }

  init() {
    this.resourceLinks.forEach(link => {
      link.addEventListener('click', () => {
        trackEvent('resource_nav_click', {
          target: link.getAttribute('href'),
          text: link.textContent.trim()
        });
      });
    });
  }
}

// Lazy Load Images
class LazyImages {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    this.init();
  }

  init() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      return;
    }

    // Fallback for older browsers
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    this.images.forEach(img => imageObserver.observe(img));
  }
}

// Booking CTA Tracking
function initBookingCTATracking() {
  const bookingButtons = document.querySelectorAll('[data-booking-cta]');

  bookingButtons.forEach(button => {
    button.addEventListener('click', () => {
      trackEvent('cta_book_click', {
        location: button.dataset.location || 'inline',
        cta_text: button.textContent.trim(),
        page: window.location.pathname
      });
    });
  });
}

// Phone/Contact Tracking
function initContactTracking() {
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me"]');

  phoneLinks.forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('contact_phone_click', {
        number: link.getAttribute('href').replace('tel:', '')
      });
    });
  });

  whatsappLinks.forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('contact_whatsapp_click', {
        number: link.getAttribute('href')
      });
    });
  });
}

// Initialize all components on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new TableOfContents();
  new MobileTOC();
  new StickyCTA();
  new LeadMagnetForm();
  new ResourceNavigation();
  new LazyImages();
  initBookingCTATracking();
  initContactTracking();

  console.log('✅ Stella\'s Ink Chamber - All components initialized');
});

// Page performance tracking
window.addEventListener('load', () => {
  if ('performance' in window) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

    trackEvent('page_performance', {
      load_time: pageLoadTime,
      page: window.location.pathname
    });
  }
});
