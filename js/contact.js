/* ====================================
   CONTACT PAGE - FUNCTIONALITY
   ==================================== */

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  setupHeroSpacing();
  setupContactForm();
  setupMobileNav();
  setupSearch();
  setupCart();
  setupBackToTop();
});

// Setup Hero Spacing - Dynamically adjust for announcement bar
function setupHeroSpacing() {
  const header = document.querySelector('header');
  const heroEl = document.querySelector('.contact-hero');

  if (!header || !heroEl) return;

  function adjustHeroMargin() {
    const barEl = document.getElementById('announcementBar');
    const announcementHidden = document.body.classList.contains('announcement-hidden');
    const barH = barEl ? barEl.offsetHeight : 0;
    const navH = header.offsetHeight;
    const offset = announcementHidden ? navH : (barH + navH);

    // Push the hero section down so it starts below the fixed bars
    heroEl.style.marginTop = offset + 'px';
  }

  adjustHeroMargin();
  window.addEventListener('resize', adjustHeroMargin);

  // Resync on scroll when announcement bar hides
  window.addEventListener('scroll', function () {
    const announcementHidden = document.body.classList.contains('announcement-hidden');
    if (announcementHidden) {
      setTimeout(adjustHeroMargin, 100);
    }
  }, { once: false });
}

// Contact Form Submission
function handleContactSubmit(event) {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value.trim();

  // Validate form
  if (!firstName || !lastName || !email || !subject || !message) {
    alert('Please fill in all required fields.');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Create form data
  const formData = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone || 'Not provided',
    subject: subject,
    message: message,
    timestamp: new Date().toISOString()
  };

  // Log form data (in production, this would be sent to a server)
  console.log('Contact Form Submitted:', formData);

  // Show success message
  const form = document.getElementById('contactForm');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;

  submitButton.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
  submitButton.style.backgroundColor = 'var(--color-primary-hover)';
  submitButton.disabled = true;

  // Reset form after 2 seconds and show message
  setTimeout(() => {
    form.reset();
    submitButton.innerHTML = originalText;
    submitButton.style.backgroundColor = '';
    submitButton.disabled = false;
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
  }, 2000);
}

// Setup Contact Form
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleContactSubmit);
  }
}

// Mobile Navigation Setup
function setupMobileNav() {
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavBackButtons = document.querySelectorAll('.mobile-nav-back');
  const mobileNavParents = document.querySelectorAll('.mobile-nav-parent');

  if (mobileNavToggle && mobileNavDrawer) {
    // Open drawer
    mobileNavToggle.addEventListener('click', function () {
      mobileNavDrawer.classList.add('active');
    });

    // Close drawer
    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', function () {
        mobileNavDrawer.classList.remove('active');
      });
    }

    // Back button for panels
    mobileNavBackButtons.forEach(backBtn => {
      backBtn.addEventListener('click', function () {
        const panelName = this.dataset.openPanel;
        openMobileNavPanel(panelName);
      });
    });

    // Parent menu items
    mobileNavParents.forEach(parent => {
      parent.addEventListener('click', function (e) {
        e.preventDefault();
        const panelName = this.dataset.openPanel;
        openMobileNavPanel(panelName);
      });
    });

    // Close drawer when clicking links
    const navLinks = mobileNavDrawer.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        mobileNavDrawer.classList.remove('active');
      });
    });
  }
}

// Open Mobile Nav Panel
function openMobileNavPanel(panelName) {
  const drawer = document.getElementById('mobileNavDrawer');
  const panels = drawer.querySelectorAll('.mobile-nav-panel');

  panels.forEach(panel => {
    if (panel.dataset.panel === panelName) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}

// Search Functionality
function setupSearch() {
  const searchBtn = document.querySelector('.btn-search');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchOverlayClose = document.querySelector('.search-overlay-close');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', function () {
      searchOverlay.classList.add('active');
    });

    if (searchOverlayClose) {
      searchOverlayClose.addEventListener('click', function () {
        searchOverlay.classList.remove('active');
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchOverlay.classList.remove('active');
      }
    });
  }
}

// Cart Functionality
function setupCart() {
  updateCartBadge();
  updateWishlistBadge();

  const cartDrawer = document.getElementById('cartDrawer');
  if (cartDrawer) {
    cartDrawer.addEventListener('show.bs.offcanvas', function () {
      renderCartItems();
    });
  }
}

// Update cart badge
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
  });
}

// Update wishlist badge
function updateWishlistBadge() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  document.querySelectorAll('.wishlist-badge').forEach(badge => {
    badge.textContent = wishlist.length;
  });
}

// Render cart items
function renderCartItems() {
  const container = document.querySelector('.cart-items-container');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 40px 20px; color: var(--color-text);">Your cart is empty</div>';
    return;
  }

  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item" style="display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--color-border);">
      <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
      <div style="flex: 1;">
        <h6 style="margin: 0 0 4px 0; font-weight: 600;">${item.name}</h6>
        <p style="margin: 0; font-size: 0.85rem; color: var(--color-text);">Size: ${item.size} | Variant: ${item.variant}</p>
        <p style="margin: 8px 0 0 0; font-weight: 600;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</p>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button style="padding: 4px 8px; border: 1px solid var(--color-border); background: white; cursor: pointer; border-radius: 4px; font-size: 0.8rem;" onclick="updateCartQty(${index}, -1)">−</button>
          <span style="padding: 4px 8px;">${item.quantity}</span>
          <button style="padding: 4px 8px; border: 1px solid var(--color-border); background: white; cursor: pointer; border-radius: 4px; font-size: 0.8rem;" onclick="updateCartQty(${index}, 1)">+</button>
          <button style="padding: 4px 8px; border: 1px solid #e74c3c; background: white; color: #e74c3c; cursor: pointer; border-radius: 4px; font-size: 0.8rem; margin-left: auto;" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  updateCartSubtotal();
}

// Update cart quantity
function updateCartQty(index, change) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartItems();
}

// Remove from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartItems();
}

// Update cart subtotal
function updateCartSubtotal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const subtotalElement = document.querySelector('.cart-subtotal-price');
  if (subtotalElement) {
    subtotalElement.textContent = '₹' + subtotal.toLocaleString('en-IN');
  }
}

// Back to top button
function setupBackToTop() {
  const backToTopBtn = document.querySelector('.btn-back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = 'flex';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
