/* ==========================================================================
   ANKER.KG - Navigation & Menu Controller (menu.js)
   Handles catalog dropdowns, off-canvas mobile drawer, bottom nav bar,
   sticky header positioning, and mobile search toggles.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCatalogDropdown();
  initMobileDrawer();
  initBottomNav();
  initStickyHeader();
  initModals();
});

/* Catalog Dropdown Logic */
function initCatalogDropdown() {
  const catalogBtn = document.getElementById('catalogToggleBtn');
  const catalogMenu = document.getElementById('catalogMenu');

  if (catalogBtn && catalogMenu) {
    catalogBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      catalogMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!catalogMenu.contains(e.target) && !catalogBtn.contains(e.target)) {
        catalogMenu.classList.remove('active');
      }
    });
  }
}

/* Mobile Drawer Logic */
function initMobileDrawer() {
  const openBtn = document.getElementById('openMobileMenuBtn');
  const closeBtn = document.getElementById('closeMobileMenuBtn');
  const overlay = document.getElementById('mobileDrawerOverlay');

  if (openBtn && overlay) {
    openBtn.addEventListener('click', () => {
      overlay.classList.add('active');
    });
  }

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  }
}

/* Bottom Navigation Bar Handler */
function initBottomNav() {
  const bottomItems = document.querySelectorAll('.bottom-nav-item');
  bottomItems.forEach(item => {
    item.addEventListener('click', function(e) {
      bottomItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');

      const action = this.dataset.action;
      if (action === 'catalog') {
        const catalogBtn = document.getElementById('catalogToggleBtn');
        if (catalogBtn) catalogBtn.click();
      } else if (action === 'cart') {
        if (window.cartManager) window.cartManager.openCartDrawer();
      } else if (action === 'favorites') {
        openModal('wishlistModal');
      }
    });
  });
}

/* Sticky Nav Bar Scroll Behavior */
function initStickyHeader() {
  const navBar = document.querySelector('.nav-bar');
  if (!navBar) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 120) {
      navBar.classList.add('is-sticky');
    } else {
      navBar.classList.remove('is-sticky');
    }
    lastScroll = currentScroll;
  });
}

/* Universal Modal Helper */
function initModals() {
  // Close buttons
  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close-btn')) {
        const activeModal = el.closest('.modal-overlay');
        if (activeModal) activeModal.classList.remove('active');
      }
    });
  });

  // Wishlist Modal trigger buttons
  document.querySelectorAll('.open-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      renderWishlistModal();
      openModal('wishlistModal');
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

/* Render Wishlist Modal Content */
function renderWishlistModal() {
  const container = document.getElementById('wishlistItemsContainer');
  if (!container || !window.cartManager || !window.productsDatabase) return;

  const wishlistIds = window.cartManager.wishlist;
  const items = window.productsDatabase.filter(p => wishlistIds.includes(p.id));

  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--color-text-muted);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 12px; color: #CBD5E1;">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <p style="font-weight: 600; font-size: 1rem; color: var(--color-navy); margin-bottom: 6px;">Список избранного пуст</p>
        <p style="font-size: 0.85rem;">Нажмите на сердечко у любого товара, чтобы сохранить его</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
      ${items.map(product => `
        <div class="product-card" style="margin: 0;">
          <img src="${product.image}" alt="${product.title}" style="height: 140px; object-fit: contain; margin-bottom: 8px;">
          <div class="product-title" style="font-size: 0.88rem;">${product.title}</div>
          <div class="product-price-box">
            <span class="price-current">${product.price} сом</span>
          </div>
          <button class="add-to-cart-btn" onclick="window.cartManager.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            В корзину
          </button>
        </div>
      `).join('')}
    </div>
  `;
}
