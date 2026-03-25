/* ============================================
   Piece by Piece — App
   ============================================ */

(() => {
  'use strict';

  // ---- Config ----
  const API_BASE = '';

  // ---- Dark-tone gradient generator for product images ----
  const tones = [
    ['#1a1a2e', '#16213e', '#0f3460', '#1a1a2e'],
    ['#0f0f1a', '#1b2838', '#2a3f5f', '#141425'],
    ['#1c1c2e', '#2a2a4a', '#1a1a3a', '#252545'],
    ['#111827', '#1e293b', '#0f172a', '#1e3a5f'],
    ['#0d1117', '#161b22', '#21262d', '#0d1117'],
    ['#1a1b26', '#24283b', '#1a1b26', '#414868'],
  ];

  function productGradient(index) {
    const t = tones[index % tones.length];
    return `linear-gradient(135deg, ${t[0]} 0%, ${t[1]} 33%, ${t[2]} 66%, ${t[3]} 100%)`;
  }

  // ---- API helpers ----
  const api = {
    async getProducts() {
      const res = await fetch(`${API_BASE}/api/products`);
      if (!res.ok) throw new Error('Failed to load products');
      return (await res.json()).data;
    },
    async getTestimonials() {
      const res = await fetch(`${API_BASE}/api/testimonials`);
      if (!res.ok) throw new Error('Failed to load testimonials');
      return (await res.json()).data;
    },
    async postMessage(data) {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to send message');
      }
      return res.json();
    },
  };

  // ---- Render: Products ----
  function renderProducts(products) {
    const grid = document.querySelector('.shop__grid');
    if (!grid) return;

    if (!products.length) {
      grid.innerHTML = '<p class="loading">All pieces have found homes. Check back soon.</p>';
      return;
    }

    grid.innerHTML = products.map((p, i) => `
      <article class="product-card">
        <div class="product-card__image" style="background: ${productGradient(i)}"></div>
        <div class="product-card__body">
          <div class="product-card__category">${escapeHtml(p.category)}</div>
          <h3 class="product-card__name">${escapeHtml(p.name)}</h3>
          <p class="product-card__desc">${escapeHtml(p.description)}</p>
          <div class="product-card__footer">
            <span class="product-card__price">$${(p.price_cents / 100).toLocaleString()}</span>
            <button class="btn btn--glass btn--sm" data-inquire="${escapeHtml(p.name)}">Inquire</button>
          </div>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('[data-inquire]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.inquire;
        const msg = document.getElementById('contact-message');
        if (msg) msg.value = `Hi, I\u2019m interested in the "${name}". Is it still available?`;
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ---- Render: Testimonials ----
  function renderTestimonials(testimonials) {
    const grid = document.querySelector('.testimonials__grid');
    if (!grid) return;

    grid.innerHTML = testimonials.map(t => `
      <div class="testimonial-card">
        <div class="testimonial-card__stars">${'&#9733;'.repeat(t.rating)}${'&#9734;'.repeat(5 - t.rating)}</div>
        <p class="testimonial-card__quote">${escapeHtml(t.quote)}</p>
        <div class="testimonial-card__author">${escapeHtml(t.customer)}</div>
        ${t.location ? `<div class="testimonial-card__location">${escapeHtml(t.location)}</div>` : ''}
        ${t.piece_name ? `<div class="testimonial-card__piece">Piece: ${escapeHtml(t.piece_name)}</div>` : ''}
      </div>
    `).join('');
  }

  // ---- Fallback data ----
  const fallbackProducts = [
    { name: 'Restored Oak Dresser', slug: 'restored-oak-dresser', description: 'Six drawers. Dovetail joints. Sanded to satin.', price_cents: 89500, category: 'Bedroom', sold: 0 },
    { name: 'Mid-Century Walnut Nightstand', slug: 'walnut-nightstand', description: 'Tapered legs. Brass pulls. One careful owner before us.', price_cents: 34500, category: 'Bedroom', sold: 0 },
    { name: 'Farmhouse Dining Table', slug: 'farmhouse-dining-table', description: 'Seats eight. Pine top, chalk-white trestle base.', price_cents: 120000, category: 'Dining', sold: 0 },
    { name: 'Art Deco Vanity Mirror', slug: 'art-deco-vanity', description: 'Beveled glass. Gilded frame brought back to life.', price_cents: 24500, category: 'Accent', sold: 0 },
    { name: 'Industrial Pipe Bookshelf', slug: 'industrial-bookshelf', description: 'Reclaimed lumber. Iron pipe frame. Five shelves of character.', price_cents: 67500, category: 'Living Room', sold: 0 },
    { name: 'Victorian Writing Desk', slug: 'victorian-writing-desk', description: 'Roll-top. Hidden compartments. Mahogany, refinished twice.', price_cents: 95000, category: 'Office', sold: 0 },
  ];

  const fallbackTestimonials = [
    { customer: 'Margaret & Paul', location: 'Asheville, NC', quote: 'The dresser arrived and we just stood there. It looked like it had always been ours.', piece_name: 'Restored Oak Dresser', rating: 5 },
    { customer: 'James T.', location: 'Savannah, GA', quote: 'Built solid. Finished beautiful. No notes.', piece_name: 'Farmhouse Dining Table', rating: 5 },
    { customer: 'Diane Kowalski', location: 'Portland, ME', quote: 'I called about one piece and left with three. Everything they touch turns to gold.', piece_name: null, rating: 5 },
    { customer: 'The Reeves Family', location: 'Charleston, SC', quote: 'Our daughter spilled grape juice on it the first week. Wiped right off. That finish is no joke.', piece_name: 'Mid-Century Walnut Nightstand', rating: 4 },
  ];

  // ---- Navigation ----
  function initNav() {
    const nav = document.querySelector('.nav');
    const sections = document.querySelectorAll('.section[id], .hero[id]');
    const navLinks = document.querySelectorAll('.nav__links a:not(.btn)');

    // Scroll-based nav background
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Active section tracking
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));

    // Mobile toggle
    const toggle = document.querySelector('.nav__toggle');
    const links = document.querySelector('.nav__links');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
      links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => links.classList.remove('open'));
      });
    }
  }

  // ---- Contact form ----
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msgEl = document.getElementById('form-message');
      const data = {
        name: form.querySelector('[name="name"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        body: form.querySelector('[name="message"]').value.trim(),
      };

      if (!data.name || !data.email || !data.body) {
        showFormMessage(msgEl, 'Please fill in all fields.', 'error');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';

      try {
        await api.postMessage(data);
        showFormMessage(msgEl, 'Message sent. We\u2019ll be in touch.', 'success');
        form.reset();
      } catch (err) {
        showFormMessage(msgEl, err.message || 'Something went wrong. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  function showFormMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = `form-message form-message--${type}`;
  }

  // ---- Utilities ----
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', async () => {
    initNav();
    initContactForm();

    try {
      const products = await api.getProducts();
      renderProducts(products);
    } catch {
      renderProducts(fallbackProducts);
    }

    try {
      const testimonials = await api.getTestimonials();
      renderTestimonials(testimonials);
    } catch {
      renderTestimonials(fallbackTestimonials);
    }
  });
})();
