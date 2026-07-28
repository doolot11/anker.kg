/* ==========================================================================
   ANKER.KG - Cart Engine (cart.js)
   Handles shopping cart state, localStorage persistence, quantity changes,
   drawer rendering, total calculation, and checkout modal workflows.
   ========================================================================== */

const CART_STORAGE_KEY = 'anker_kg_cart_v1';
const WISHLIST_STORAGE_KEY = 'anker_kg_wishlist_v1';

class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.initListeners();
    this.updateCounters();
  }

  loadCart() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error loading cart:', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
      this.updateCounters();
      this.renderDrawerContent();
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }

  loadWishlist() {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlist));
      this.updateCounters();
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }

  addItem(product, qty = 1) {
    const existingIndex = this.cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += qty;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        unit: product.unit || 'шт.',
        image: product.image,
        quantity: qty
      });
    }
    this.saveCart();
    this.showToast(`Товар "${product.title}" добавлен в корзину!`);
  }

  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.showToast('Товар удален из корзины');
  }

  updateQuantity(productId, qty) {
    const item = this.cart.find(i => i.id === productId);
    if (item) {
      item.quantity = Math.max(1, qty);
      this.saveCart();
    }
  }

  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showToast('Удалено из избранного');
    } else {
      this.wishlist.push(productId);
      this.showToast('Добавлено в избранное');
    }
    this.saveWishlist();
    return this.wishlist.includes(productId);
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  getTotalPrice() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTotalCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateCounters() {
    const count = this.getTotalCount();
    const totalPrice = this.getTotalPrice();
    const wishlistCount = this.wishlist.length;

    // Update Header Badges
    document.querySelectorAll('.cart-badge-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });

    document.querySelectorAll('.cart-total-price-text').forEach(el => {
      el.textContent = `${totalPrice.toLocaleString('ru-RU')} сом`;
    });

    document.querySelectorAll('.wishlist-badge-count').forEach(el => {
      el.textContent = wishlistCount;
      el.style.display = wishlistCount > 0 ? 'flex' : 'none';
    });
  }

  renderDrawerContent() {
    const container = document.getElementById('cartDrawerItems');
    const totalEl = document.getElementById('cartDrawerTotal');
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--color-text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 12px; color: #CBD5E1;">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <p style="font-weight: 600; font-size: 1rem; color: var(--color-navy); margin-bottom: 6px;">Ваша корзина пуста</p>
          <p style="font-size: 0.85rem;">Выберите качественные стройматериалы в каталоге</p>
        </div>
      `;
      if (totalEl) totalEl.textContent = '0.0 сом';
      return;
    }

    container.innerHTML = this.cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80'">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${(item.price * item.quantity).toLocaleString('ru-RU')} сом <span style="font-size: 0.75rem; font-weight: normal; color: var(--color-text-muted);">(${item.price} сом / ${item.unit})</span></div>
          <div class="qty-selector" style="height: 32px; width: 110px;">
            <button class="qty-btn" onclick="window.cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
            <input type="text" class="qty-input" value="${item.quantity}" readonly>
            <button class="qty-btn" onclick="window.cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="window.cartManager.removeItem('${item.id}')" title="Удалить">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    `).join('');

    if (totalEl) {
      totalEl.textContent = `${this.getTotalPrice().toLocaleString('ru-RU')} сом`;
    }
  }

  showToast(message) {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-yellow)" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  initListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      // Cart drawer open buttons
      document.querySelectorAll('.open-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.openCartDrawer();
        });
      });

      // Cart drawer close
      const closeBtn = document.getElementById('closeCartDrawer');
      const drawerOverlay = document.getElementById('cartDrawerOverlay');
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeCartDrawer());
      if (drawerOverlay) drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) this.closeCartDrawer();
      });

      // Checkout button
      const checkoutBtn = document.getElementById('checkoutBtn');
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
          if (this.cart.length === 0) {
            this.showToast('Ваша корзина пуста');
            return;
          }
          this.closeCartDrawer();
          this.openCheckoutModal();
        });
      }

      // Checkout form submit
      const checkoutForm = document.getElementById('checkoutForm');
      if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.processCheckout();
        });
      }
    });
  }

  async processCheckout() {
    if (this.cart.length === 0) {
      this.showToast('Ваша корзина пуста!');
      return;
    }

    const submitBtn = document.getElementById('checkoutSubmitBtn');
    const nameInput = document.getElementById('checkoutCustomerName');
    const phoneInput = document.getElementById('checkoutCustomerPhone');
    const addressInput = document.getElementById('checkoutCustomerAddress');
    const notesInput = document.getElementById('checkoutCustomerNotes');
    const paymentSelect = document.getElementById('checkoutPaymentMethod');

    const customerName = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const address = addressInput ? addressInput.value.trim() : 'Бишкек';
    const notes = notesInput ? notesInput.value.trim() : '';
    const paymentMethod = paymentSelect ? paymentSelect.value : 'Наличными курьеру';

    // Reset error styling
    if (nameInput) nameInput.style.borderColor = '';
    if (phoneInput) phoneInput.style.borderColor = '';

    if (!customerName) {
      if (nameInput) {
        nameInput.style.borderColor = '#EF4444';
        nameInput.focus();
      }
      this.showToast('Пожалуйста, укажите ваше Имя');
      return;
    }

    const cleanDigits = phone.replace(/\D/g, '');
    if (!phone || phone === '+996' || cleanDigits.length < 9) {
      if (phoneInput) {
        phoneInput.style.borderColor = '#EF4444';
        phoneInput.focus();
      }
      this.showToast('Укажите обязательный номер телефона! (например: +996773744448)');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка заказа...';
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          address,
          notes,
          paymentMethod,
          items: this.cart,
          totalPrice: this.getTotalPrice()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const orderId = data.order?.id || '#1025';
        
        // Empty cart
        this.cart = [];
        this.saveCart();

        // Close modal
        if (window.closeModal) {
          window.closeModal('checkoutModal');
        } else {
          const modal = document.getElementById('checkoutModal');
          if (modal) modal.classList.remove('active');
        }

        // Show confirmation message
        let statusMsg = `Заказ ${orderId} успешно создан!`;
        if (data.telegramSent) {
          statusMsg += ` Уведомление отправлено в Telegram.`;
        }
        
        this.showOrderSuccessModal(orderId, customerName, phone, data.telegramSent);
      } else {
        this.showToast(data.error || 'Ошибка при оформлении заказа. Попробуйте еще раз.');
      }
    } catch (err) {
      console.error('Checkout submit error:', err);
      this.showToast('Произошла ошибка при отправке. Попробуйте еще раз.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Подтвердить заказ';
      }
    }
  }

  showOrderSuccessModal(orderId, name, phone, telegramSent) {
    let successModal = document.getElementById('orderSuccessModal');
    if (!successModal) {
      successModal = document.createElement('div');
      successModal.id = 'orderSuccessModal';
      successModal.className = 'modal-overlay';
      document.body.appendChild(successModal);
    }

    successModal.innerHTML = `
      <div class="modal-card" style="max-width: 480px; text-align: center; padding: 24px;">
        <div style="width: 56px; height: 56px; background: #DEF7EC; color: #03543F; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 style="font-size: 1.4rem; color: var(--color-navy); margin-bottom: 8px;">Заказ ${orderId} принят!</h3>
        <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 16px;">
          Спасибо, <strong>${name}</strong>! Наш менеджер свяжется с вами по номеру <strong>${phone}</strong> в ближайшее время.
        </p>
        ${telegramSent ? `
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; color: #166534; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; justify-content: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
            Уведомление о заказе успешно доставлено!
          </div>
        ` : `
          <div style="background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 20px;">
            Заказ сохранен в системе. Менеджер свяжется с вами по телефону.
          </div>
        `}
        <button class="btn-primary" style="width: 100%; justify-content: center;" onclick="document.getElementById('orderSuccessModal').classList.remove('active')">
          Отлично, спасибо!
        </button>
      </div>
    `;

    successModal.classList.add('active');
  }

  openCartDrawer() {
    this.renderDrawerContent();
    const overlay = document.getElementById('cartDrawerOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (overlay && drawer) {
      overlay.classList.add('active');
      drawer.classList.add('active');
    }
  }

  closeCartDrawer() {
    const overlay = document.getElementById('cartDrawerOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (overlay && drawer) {
      overlay.classList.remove('active');
      drawer.classList.remove('active');
    }
  }

  openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
      modal.classList.add('active');
      const orderSummaryEl = document.getElementById('checkoutOrderSummary');
      if (orderSummaryEl) {
        orderSummaryEl.innerHTML = `
          <div style="background: var(--color-bg-light); padding: 12px; border-radius: var(--radius-md); margin-bottom: 16px;">
            <div style="font-weight: 700; margin-bottom: 8px;">Итого к оплате: <span style="color: var(--color-navy); font-size: 1.1rem;">${this.getTotalPrice().toLocaleString('ru-RU')} сом</span></div>
            <div style="font-size: 0.85rem; color: var(--color-text-muted);">Количество товаров: ${this.getTotalCount()} шт.</div>
          </div>
        `;
      }
    }
  }
}

// Global Export
window.cartManager = new CartManager();
