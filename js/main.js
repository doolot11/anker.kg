/* ==========================================================================
   ANKER.KG - Main Store Engine (main.js)
   Product catalogue database, category filter, quick view modal,
   materials calculator, auth tabs, search engine, and quote requests.
   ========================================================================== */

// Products Database with realistic prices in Kyrgyzstani Som (Кыргызский сом / KGS)
const PRODUCTS_DATA = [
  {
    id: 'prod-01',
    title: 'Анкер клиновой высокопрочный M12x100мм HDG',
    category: 'Крепеж',
    categorySlug: 'krepezh',
    price: 180,
    oldPrice: 210,
    unit: 'шт.',
    badge: 'hit',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    description: 'Клиновой анкер оцинкованный методом горячего погружения для надежного монтажа тяжелых металлоконструкций в бетон и природный камень.',
    specs: [
      { key: 'Диаметр резьбы', val: 'M12' },
      { key: 'Длина анкера', val: '100 мм' },
      { key: 'Материал', val: 'Сталь 8.8 (HDG)' },
      { key: 'Нагрузка на вырыв', val: '18.5 кН' }
    ]
  },
  {
    id: 'prod-02',
    title: 'Закладные детали с арматурой ЗД-1 (А500С)',
    category: 'Металлоконструкции',
    categorySlug: 'metallo',
    price: 95,
    oldPrice: null,
    unit: 'кг',
    badge: 'hit',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80',
    description: 'Закладные изделия по ГОСТ 10922-2012 с приварными анкерными стержнями для монолитного строительства.',
    specs: [
      { key: 'Марка стали', val: 'Ст3сп / А500С' },
      { key: 'Толщина пластины', val: '8-20 мм' },
      { key: 'Арматурный стержень', val: 'Ø12-Ø25 мм' }
    ]
  },
  {
    id: 'prod-03',
    title: 'Клей для базальта и теплоизоляции KRAFT Isoblock 25кг',
    category: 'Сухие смеси',
    categorySlug: 'smesi',
    price: 370,
    oldPrice: 420,
    unit: 'уп.',
    badge: 'discount',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80',
    description: 'Усиленный штукатурно-клеевой состав для монтажа базальтовых плит и пенополистирола при устройстве мокрого фасада.',
    specs: [
      { key: 'Расход смеси', val: '4.5-5.5 кг/м²' },
      { key: 'Адгезия к бетону', val: 'не менее 1.0 МПа' },
      { key: 'Вес упаковки', val: '25 кг' }
    ]
  },
  {
    id: 'prod-04',
    title: 'Гипсокартон Knauf Влагостойкий ГСП-Н2 (2500х1200х12.5мм)',
    category: 'Гипсокартон',
    categorySlug: 'gipsokarton',
    price: 490,
    oldPrice: null,
    unit: 'лист',
    badge: 'new',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80',
    description: 'Влагостойкие гипсокартонные листы для перегородок и потолков в помещениях с повышенной влажностью.',
    specs: [
      { key: 'Размеры', val: '2500x1200 мм' },
      { key: 'Толщина', val: '12.5 мм' },
      { key: 'Площадь листа', val: '3.0 м²' }
    ]
  },
  {
    id: 'prod-05',
    title: 'Арматура стальная строительная А500С Ø12мм (6м)',
    category: 'Металлоконструкции',
    categorySlug: 'metallo',
    price: 68,
    oldPrice: 75,
    unit: 'м.п.',
    badge: 'hit',
    image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=500&auto=format&fit=crop&q=80',
    description: 'Горячекатаная арматурная сталь периодического профиля для армирования монолитных железобетонных конструкций.',
    specs: [
      { key: 'Диаметр', val: '12 мм' },
      { key: 'Класс прочности', val: 'А500С' },
      { key: 'Длина хлыста', val: '6.0 метров' }
    ]
  },
  {
    id: 'prod-06',
    title: 'Проволока вязальная отожженная Ø1.2мм (рулон 5кг)',
    category: 'Крепеж',
    categorySlug: 'krepezh',
    price: 520,
    oldPrice: null,
    unit: 'рулон',
    badge: null,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?w=500&auto=format&fit=crop&q=80',
    description: 'Термически обработанная мягкая проволока для ручной вязки арматурных каркасов и сетки.',
    specs: [
      { key: 'Диаметр', val: '1.2 мм' },
      { key: 'Вес рулона', val: '5 кг' },
      { key: 'Покрытие', val: 'Отожженная черная' }
    ]
  },
  {
    id: 'prod-07',
    title: 'Пистолет профессиональный для монтажной пены PRO-900',
    category: 'Инструменты',
    categorySlug: 'instrumenty',
    price: 1250,
    oldPrice: 1450,
    unit: 'шт.',
    badge: 'discount',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80',
    description: 'Цельнометаллический пистолет с тефлоновым покрытием и точной регулировкой подачи пены.',
    specs: [
      { key: 'Корпус', val: 'Металлический сплав' },
      { key: 'Покрытие иглы', val: 'PTFE Тефлон' },
      { key: 'Гарантия', val: '12 месяцев' }
    ]
  },
  {
    id: 'prod-08',
    title: 'Монтажная пена профессиональная всесезонная 750мл',
    category: 'Пена и силикон',
    categorySlug: 'pena',
    price: 430,
    oldPrice: null,
    unit: 'шт.',
    badge: 'hit',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
    description: 'Однокомпонентная полиуретановая пена с высоким выходом до 65 литров и рабочей температурой до -10°C.',
    specs: [
      { key: 'Объем', val: '750 мл' },
      { key: 'Выход пены', val: 'до 65 литров' },
      { key: 'Температура применения', val: 'от -10°C до +35°C' }
    ]
  }
];

window.productsDatabase = PRODUCTS_DATA;

document.addEventListener('DOMContentLoaded', () => {
  renderProducts(PRODUCTS_DATA);
  initProductTabs();
  initSearchEngine();
  initCalculator();
  initQuoteForm();
});

/* Render Products Function */
function renderProducts(productsList) {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  if (productsList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--color-bg-light); border-radius: var(--radius-lg);">
        <p style="font-size: 1.1rem; color: var(--color-navy); font-weight: 700;">Товары не найдены</p>
        <p style="font-size: 0.9rem; color: var(--color-text-muted);">Попробуйте изменить поисковый запрос или фильтр</p>
      </div>
    `;
    return;
  }

  container.innerHTML = productsList.map(product => {
    const isWishlisted = window.cartManager ? window.cartManager.isInWishlist(product.id) : false;
    let badgeHTML = '';

    if (product.badge === 'hit') badgeHTML = `<span class="badge badge-hit">Хит продаж</span>`;
    else if (product.badge === 'new') badgeHTML = `<span class="badge badge-new">Новинка</span>`;
    else if (product.badge === 'discount') badgeHTML = `<span class="badge badge-discount">Скидка</span>`;

    return `
      <div class="product-card" data-id="${product.id}" data-category="${product.categorySlug}">
        <div class="product-badges">
          ${badgeHTML}
          <span class="badge badge-stock">В наличии</span>
        </div>

        <div class="product-actions-overlay">
          <button class="icon-action-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlistBtn(this, '${product.id}')" title="В избранное">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'var(--color-navy)' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button class="icon-action-btn" onclick="openQuickView('${product.id}')" title="Быстрый просмотр">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>

        <div class="product-image-container" onclick="openQuickView('${product.id}')" style="cursor: pointer;">
          <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80'">
        </div>

        <div class="product-category-name">${product.category}</div>
        <h3 class="product-title" onclick="openQuickView('${product.id}')" style="cursor: pointer;">${product.title}</h3>

        <div class="product-price-box">
          <span class="price-current">${product.price.toLocaleString('ru-RU')} сом</span>
          ${product.oldPrice ? `<span class="price-old">${product.oldPrice.toLocaleString('ru-RU')}</span>` : ''}
          <span class="price-unit">/${product.unit}</span>
        </div>

        <div class="product-card-controls">
          <div class="qty-selector">
            <button class="qty-btn" onclick="adjustProductQty(this, -1)">-</button>
            <input type="text" class="qty-input" value="1" readonly>
            <button class="qty-btn" onclick="adjustProductQty(this, 1)">+</button>
          </div>
          <button class="add-to-cart-btn" onclick="addProductToCart(this, '${product.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            В корзину
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/* Tab Filtering Logic */
function initProductTabs() {
  const tabs = document.querySelectorAll('.product-tabs .tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;
      if (filter === 'all') {
        renderProducts(PRODUCTS_DATA);
      } else if (filter === 'hits') {
        renderProducts(PRODUCTS_DATA.filter(p => p.badge === 'hit'));
      } else if (filter === 'new') {
        renderProducts(PRODUCTS_DATA.filter(p => p.badge === 'new'));
      } else if (filter === 'discount') {
        renderProducts(PRODUCTS_DATA.filter(p => p.badge === 'discount'));
      }
    });
  });
}

/* Category Filter Helper */
window.filterCategory = function(slug) {
  const filtered = PRODUCTS_DATA.filter(p => p.categorySlug === slug);
  renderProducts(filtered.length > 0 ? filtered : PRODUCTS_DATA);
  const targetSection = document.getElementById('productsSection');
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth' });
  }
};

/* Search Engine */
function initSearchEngine() {
  const searchInputs = document.querySelectorAll('.search-input');
  searchInputs.forEach(input => {
    input.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      if (!query) {
        renderProducts(PRODUCTS_DATA);
        return;
      }
      const matches = PRODUCTS_DATA.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
      renderProducts(matches);
    });
  });
}

/* Quantity Adjust Helper */
window.adjustProductQty = function(btn, delta) {
  const container = btn.closest('.qty-selector');
  const input = container.querySelector('.qty-input');
  let current = parseInt(input.value) || 1;
  current = Math.max(1, current + delta);
  input.value = current;
};

/* Add Product to Cart Helper */
window.addProductToCart = function(btn, productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const card = btn.closest('.product-card');
  const qtyInput = card ? card.querySelector('.qty-input') : null;
  const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

  if (window.cartManager) {
    window.cartManager.addItem(product, qty);
    btn.classList.add('added');
    btn.innerHTML = `✓ Добавлено`;
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg> В корзину
      `;
    }, 1500);
  }
};

/* Wishlist Toggle Button */
window.toggleWishlistBtn = function(btn, productId) {
  if (window.cartManager) {
    const isAdded = window.cartManager.toggleWishlist(productId);
    btn.classList.toggle('active', isAdded);
    const svg = btn.querySelector('svg');
    if (svg) svg.setAttribute('fill', isAdded ? 'var(--color-navy)' : 'none');
  }
};

/* Quick View Modal */
window.openQuickView = function(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickViewModal');
  const body = document.getElementById('quickViewBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start;">
      <div>
        <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 260px; object-fit: contain; background: var(--color-bg-light); padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
      </div>
      <div>
        <div style="font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">${product.category}</div>
        <h2 style="font-size: 1.3rem; color: var(--color-navy); margin-bottom: 12px; line-height: 1.3;">${product.title}</h2>
        <div style="font-size: 1.6rem; font-weight: 900; color: var(--color-navy); margin-bottom: 16px;">
          ${product.price.toLocaleString('ru-RU')} сом <span style="font-size: 0.9rem; font-weight: normal; color: var(--color-text-muted);">/${product.unit}</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 20px; line-height: 1.5;">${product.description}</p>
        
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 24px;">
          <div class="qty-selector" style="height: 44px; width: 120px;">
            <button class="qty-btn" onclick="adjustProductQty(this, -1)">-</button>
            <input type="text" class="qty-input" value="1" readonly>
            <button class="qty-btn" onclick="adjustProductQty(this, 1)">+</button>
          </div>
          <button class="btn-primary" style="height: 44px; flex: 1; justify-content: center;" onclick="addProductToCart(this, '${product.id}')">
            В корзину
          </button>
        </div>
      </div>
    </div>

    <div style="margin-top: 24px;">
      <h4 style="font-size: 1.05rem; color: var(--color-navy); margin-bottom: 10px;">Технические характеристики</h4>
      <table class="spec-table">
        <tbody>
          ${product.specs ? product.specs.map(s => `
            <tr>
              <td style="font-weight: 600; width: 40%; color: var(--color-navy);">${s.key}</td>
              <td>${s.val}</td>
            </tr>
          `).join('') : '<tr><td>Стандарт качества</td><td>ГОСТ / ISO 9001</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  modal.classList.add('active');
};

/* Construction Materials Calculator Engine */
function initCalculator() {
  const calcBtn = document.getElementById('calcCalculateBtn');
  if (!calcBtn) return;

  calcBtn.addEventListener('click', () => {
    const type = document.getElementById('calcTypeSelect')?.value || 'drywall';
    const area = parseFloat(document.getElementById('calcAreaInput')?.value) || 0;
    const resultBox = document.getElementById('calcResultBox');

    if (area <= 0) {
      if (resultBox) {
        resultBox.innerHTML = `<span style="color: var(--color-danger); font-weight: 600;">Укажите корректную площадь в м²</span>`;
      }
      return;
    }

    let estimateText = '';
    if (type === 'drywall') {
      const sheets = Math.ceil((area * 1.08) / 3.0); // 3m2 per sheet + 8% waste
      const screws = sheets * 35;
      const totalCost = (sheets * 490) + (screws * 1.5);
      estimateText = `
        <strong>Расчет для гипсокартона (${area} м²):</strong><br>
        • Листы Knauf 12.5мм: <strong>${sheets} шт.</strong> (~${sheets * 490} сом)<br>
        • Саморезы по металлу: <strong>${screws} шт.</strong><br>
        • Ориентировочная стоимость: <strong>~${totalCost.toLocaleString('ru-RU')} сом</strong>
      `;
    } else if (type === 'tile') {
      const bags = Math.ceil((area * 4.5) / 25);
      const totalCost = bags * 370;
      estimateText = `
        <strong>Расчет клеевой смеси (${area} м²):</strong><br>
        • Клей KRAFT Isoblock (25кг): <strong>${bags} мешков</strong><br>
        • Ориентировочная стоимость: <strong>~${totalCost.toLocaleString('ru-RU')} сом</strong>
      `;
    } else if (type === 'rebar') {
      const meters = Math.ceil(area * 4.2);
      const totalCost = meters * 68;
      estimateText = `
        <strong>Расчет арматуры Ø12мм для плиты (${area} м²):</strong><br>
        • Требуемая арматура А500С: <strong>${meters} м.п.</strong><br>
        • Ориентировочная стоимость: <strong>~${totalCost.toLocaleString('ru-RU')} сом</strong>
      `;
    }

    if (resultBox) {
      resultBox.style.display = 'block';
      resultBox.innerHTML = estimateText;
    }
  });
}

/* Fast Wholesale Quote Request Form Handler */
function initQuoteForm() {
  const quoteForm = document.getElementById('fastQuoteForm');
  if (!quoteForm) return;

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = document.getElementById('quotePhoneInput')?.value || '';
    if (!phone) return;

    if (window.cartManager) {
      window.cartManager.showToast('Заявка отправлена! Менеджер перезвонит вам в течение 10 минут.');
    }
    quoteForm.reset();
  });
}
