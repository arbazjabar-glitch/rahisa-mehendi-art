// =============================================================================
// RAHISA MEHENDI ART (@rahisa_mhendi_art) - Main Interactive Logic
// E-commerce Cart, Dynamic Variants, Booking Calculator, WhatsApp Integrations
// =============================================================================

// ⚙️ OWNER CONFIGURATION: Rahisa Mehendi Art Official WhatsApp Number (+91 9510092221)
const RAHISA_WHATSAPP_NUMBER = '919510092221';

let cart = JSON.parse(localStorage.getItem('rma_cart')) || [];
let activeCoupon = null;
const cardSelectedVariants = {};
const cardQuantities = {};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initCardStates();
  renderServices();
  renderProducts('all');
  updateCartBadge();
  setupEventListeners();
  updateBookingQuote();
});

// Initialize default variant and quantity states for each product
function initCardStates() {
  if (typeof MEHENDI_PRODUCTS !== 'undefined') {
    MEHENDI_PRODUCTS.forEach(p => {
      cardSelectedVariants[p.id] = 0;
      cardQuantities[p.id] = 1;
    });
  }
}

// Setup Event Listeners across the website
function setupEventListeners() {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
    });
    // Close nav on click of any link
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('active'));
    });
    // Close nav when clicking outside on touch/mobile
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }

  // Filter Buttons for Products
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const category = e.target.getAttribute('data-filter') || 'all';
      renderProducts(category);
    });
  });

  // Filter Buttons for Gallery
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.getAttribute('data-gallery-filter') || 'all';
      filterGallery(cat);
    });
  });

  // Cart Drawer open / close
  const cartBtn = document.getElementById('cartOpenBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBackdrop = document.getElementById('cartBackdrop');

  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);

  // Direct WhatsApp Checkout Button inside Cart Drawer
  const waCartBtn = document.getElementById('btnWaCartCheckout');
  if (waCartBtn) {
    waCartBtn.addEventListener('click', handleWaCartCheckout);
  }

  // Apply Coupon Button
  const couponBtn = document.getElementById('applyCouponBtn');
  if (couponBtn) {
    couponBtn.addEventListener('click', handleApplyCoupon);
  }

  // Open Postal Delivery Checkout Modal
  const checkoutBtn = document.getElementById('btnOpenCheckout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', openCheckoutModal);
  }

  // Checkout Form Submission
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Booking Form Submission
  const bookingForm = document.getElementById('bookingFormElement');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }

  // Live calculation on booking inputs
  const bookingInputs = [
    'bookingServiceSelect',
    'bookingCoverage',
    'bookingFeet',
    'bookingAddonKit',
    'bookingAddonOil',
    'bookingGuests'
  ];
  bookingInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', updateBookingQuote);
      el.addEventListener('input', updateBookingQuote);
    }
  });

  // Direct WhatsApp Button in Booking Form
  const waDirectBtn = document.getElementById('btnWaDirectBooking');
  if (waDirectBtn) {
    waDirectBtn.addEventListener('click', handleWaDirectBooking);
  }
}

// =============================================================================
// 1. SERVICES & INTERACTIVE BOOKING CALCULATOR
// =============================================================================

function renderServices() {
  const container = document.getElementById('servicesContainer');
  if (!container || typeof MEHENDI_SERVICES === 'undefined') return;

  container.innerHTML = MEHENDI_SERVICES.map(srv => `
    <div class="service-card" id="card-${srv.id}">
      <div class="service-img-wrap">
        <img src="${srv.image}" alt="${srv.title}" loading="lazy">
        <span class="service-badge-pill">${srv.badge}</span>
      </div>
      <div class="service-body">
        <div class="service-meta">
          <span>⏳ ${srv.duration}</span>
          <span>★ ${srv.rating}</span>
        </div>
        <h3 class="service-name">${srv.title}</h3>
        <p class="service-desc">${srv.description}</p>
        <ul class="service-highlights">
          ${srv.included.slice(0, 3).map(inc => `<li>${inc}</li>`).join('')}
        </ul>
        <div class="service-footer">
          <div class="service-price">
            ${srv.price}
            <small>Package rate</small>
          </div>
          <button type="button" class="btn-select-service" onclick="selectServiceForBooking('${srv.id}')">
            Select & Book
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Populate booking dropdown select options
  const selectEl = document.getElementById('bookingServiceSelect');
  if (selectEl) {
    selectEl.innerHTML = MEHENDI_SERVICES.map(s => `
      <option value="${s.id}">${s.title} — ${s.price}</option>
    `).join('');
  }
  updateBookingQuote();
}

function selectServiceForBooking(serviceId) {
  const selectEl = document.getElementById('bookingServiceSelect');
  if (selectEl) {
    selectEl.value = serviceId;
    updateBookingQuote();
  }
  const formSection = document.getElementById('bookingWizardForm');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  const srv = MEHENDI_SERVICES.find(s => s.id === serviceId);
  showToast(`Selected "${srv ? srv.title : 'Package'}"! Customize your event details below.`);
}

function updateBookingQuote() {
  const srvId = document.getElementById('bookingServiceSelect')?.value;
  const coverage = document.getElementById('bookingCoverage')?.value || 'mid_arms';
  const feet = document.getElementById('bookingFeet')?.checked;
  const addonKit = document.getElementById('bookingAddonKit')?.checked;
  const addonOil = document.getElementById('bookingAddonOil')?.checked;
  const guests = parseInt(document.getElementById('bookingGuests')?.value || '0', 10);

  const selectedSrv = (typeof MEHENDI_SERVICES !== 'undefined' && MEHENDI_SERVICES.find(s => s.id === srvId)) || MEHENDI_SERVICES[0];
  let total = selectedSrv ? selectedSrv.basePrice : 5000;

  // Coverage adjustments
  if (coverage === 'wrists') {
    total = Math.max(1500, total - 600);
  } else if (coverage === 'full_elbows') {
    total += 1500;
  }

  // Feet henna add-on
  if (feet) {
    total += 2000;
  }

  // Add-on products
  if (addonKit) total += 999;
  if (addonOil) total += 350;

  // Additional guest palms (₹200 per palm)
  if (guests > 0) {
    total += (guests * 200);
  }

  const quoteEl = document.getElementById('liveBookingQuote');
  if (quoteEl) {
    quoteEl.innerText = `₹${total.toLocaleString('en-IN')}`;
  }
  return total;
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('clientName')?.value.trim();
  const phone = document.getElementById('clientPhone')?.value.trim();
  const date = document.getElementById('eventDate')?.value;
  const city = document.getElementById('eventAddress')?.value.trim() || document.getElementById('eventCity')?.value.trim() || '';
  const srvId = document.getElementById('bookingServiceSelect')?.value;
  const coverage = document.getElementById('bookingCoverage')?.value || 'mid_arms';
  const specialReq = document.getElementById('eventSpecialReq')?.value.trim() || 'None specified';
  const feet = document.getElementById('bookingFeet')?.checked;
  const guests = document.getElementById('bookingGuests')?.value || '0';

  const srv = (typeof MEHENDI_SERVICES !== 'undefined' && MEHENDI_SERVICES.find(s => s.id === srvId)) || { title: 'Bridal Henna' };
  const total = updateBookingQuote();

  if (!name || !phone || !date) {
    showToast('Please fill in your name, contact phone, and event date.');
    return;
  }

  const bookingId = 'RMA-BOOK-' + Math.floor(100000 + Math.random() * 900000);

  // Format WhatsApp Message
  const coverageLabel = coverage === 'wrists' ? 'Wrists' : (coverage === 'full_elbows' ? 'Royal Full Elbows' : 'Mid-Forearms');
  const waMessage = `👑 *NEW MEHENDI BOOKING INQUIRY - RAHISA MEHENDI ART* 👑%0A` +
    `*Instagram:* @rahisa_mhendi_art%0A` +
    `*Booking ID:* ${bookingId}%0A%0A` +
    `*Client Name:* ${encodeURIComponent(name)}%0A` +
    `*Phone Number:* ${encodeURIComponent(phone)}%0A` +
    `*Event Date:* ${encodeURIComponent(date)}%0A` +
    `*Event Type / Package:* ${encodeURIComponent(srv.title)}%0A` +
    `*City / Address:* ${encodeURIComponent(city || 'Not provided')}%0A` +
    `*Hand Coverage:* ${encodeURIComponent(coverageLabel)}%0A` +
    `*Feet Henna:* ${feet ? 'Yes (+₹2,000)' : 'No'}%0A` +
    `*Additional Guest Palms:* ${guests}%0A` +
    `*Special Requirements:* ${encodeURIComponent(specialReq)}%0A%0A` +
    `*Estimated Total:* ₹${total.toLocaleString('en-IN')}%0A%0A` +
    `Please confirm artist availability for this date. Thank you!`;

  // Sync to Google Sheets if configured
  syncToGoogleSheets({
    type: 'Bridal Booking',
    id: bookingId,
    name: name,
    phone: phone,
    items: `${srv.title} (Coverage: ${coverageLabel}, Feet: ${feet ? 'Yes' : 'No'}, Guests: ${guests})`,
    total: total,
    address: city || 'On-site venue',
    notes: specialReq
  });

  showBookingSuccessModal(bookingId, name, phone, srv.title, date, city, total, specialReq, waMessage);
}

function handleWaDirectBooking() {
  const name = document.getElementById('clientName')?.value.trim() || 'Valued Bride / Client';
  const phone = document.getElementById('clientPhone')?.value.trim() || 'Not specified';
  const date = document.getElementById('eventDate')?.value || 'Upcoming Event';
  const city = document.getElementById('eventAddress')?.value.trim() || document.getElementById('eventCity')?.value.trim() || 'City/Venue';
  const specialReq = document.getElementById('eventSpecialReq')?.value.trim() || 'Standard booking';
  const srvId = document.getElementById('bookingServiceSelect')?.value;
  const srv = (typeof MEHENDI_SERVICES !== 'undefined' && MEHENDI_SERVICES.find(s => s.id === srvId)) || { title: 'Bridal Henna (Starting ₹5,000)' };
  const total = updateBookingQuote();

  const waText = `Hello Rahisa Mehendi Art! 👋 (@rahisa_mhendi_art)%0A%0A` +
    `I would like to book an appointment for: *${encodeURIComponent(srv.title)}*%0A` +
    `• *Name:* ${encodeURIComponent(name)}%0A` +
    `• *Phone:* ${encodeURIComponent(phone)}%0A` +
    `• *Event Date:* ${encodeURIComponent(date)}%0A` +
    `• *City / Address:* ${encodeURIComponent(city)}%0A` +
    `• *Special Notes:* ${encodeURIComponent(specialReq)}%0A` +
    `• *Estimated Quote:* ₹${total.toLocaleString('en-IN')}%0A%0A` +
    `Please share your booking availability slots! ✨`;

  window.open(`https://api.whatsapp.com/send?phone=${RAHISA_WHATSAPP_NUMBER}&text=${waText}`, '_blank');
}

function showBookingSuccessModal(id, name, phone, service, date, city, total, notes, waMsg) {
  // Save booking to local history
  const savedBookings = JSON.parse(localStorage.getItem('rma_bookings')) || [];
  savedBookings.unshift({
    id,
    name,
    phone,
    service,
    date,
    city,
    total,
    notes,
    status: 'New Inquiry',
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('rma_bookings', JSON.stringify(savedBookings));

  const modal = document.getElementById('bookingConfirmModal');
  const detailsEl = document.getElementById('bookingConfirmDetails');
  const waBtn = document.getElementById('btnConfirmWaSend');

  if (detailsEl) {
    detailsEl.innerHTML = `
      <div class="booking-receipt-box">
        <p class="receipt-id">Booking Reference: ${id}</p>
        <div class="receipt-row"><span>Client:</span> <strong>${name}</strong></div>
        <div class="receipt-row"><span>Package:</span> <strong>${service}</strong></div>
        <div class="receipt-row"><span>Event Date:</span> <strong>${date}</strong></div>
        <div class="receipt-row"><span>Location:</span> <strong>${city || 'On-site'}</strong></div>
        <div class="receipt-row total"><span>Estimated Package Total:</span> <strong>₹${total.toLocaleString('en-IN')}</strong></div>
        <p class="receipt-note">
          ✓ Slot tentatively reserved. Click below to verify and finalize your booking directly with Rahisa on WhatsApp.
        </p>
      </div>
    `;
  }

  if (waBtn) {
    waBtn.href = `https://api.whatsapp.com/send?phone=${RAHISA_WHATSAPP_NUMBER}&text=${waMsg}`;
  }

  if (modal) modal.classList.add('active');
}

// =============================================================================
// 2. E-COMMERCE PRODUCTS WITH DYNAMIC VARIANTS & QUANTITY CONTROLS
// =============================================================================

function renderProducts(category) {
  const container = document.getElementById('productsContainer');
  if (!container || typeof MEHENDI_PRODUCTS === 'undefined') return;

  const filtered = category === 'all'
    ? MEHENDI_PRODUCTS
    : MEHENDI_PRODUCTS.filter(p => p.category === category);

  container.innerHTML = filtered.map(prod => {
    const selIdx = cardSelectedVariants[prod.id] || 0;
    const currentVariant = prod.variants[selIdx] || prod.variants[0];
    const qty = cardQuantities[prod.id] || 1;
    const discountPct = Math.round(((currentVariant.originalPrice - currentVariant.price) / currentVariant.originalPrice) * 100);

    const hasMultipleVariants = prod.variants.length > 1;

    return `
      <div class="product-card" id="card-${prod.id}">
        <span class="product-badge">${prod.badge}</span>
        
        <div class="product-thumb">
          <img src="${prod.image}" alt="${prod.name}" loading="lazy">
          <div class="quick-view-overlay">
            <button type="button" class="btn-quickview" onclick="openQuickView('${prod.id}')">
              👁️ Quick View & Details
            </button>
          </div>
        </div>

        <div class="product-content">
          <div class="product-rating">
            ★★★★★ <span>(${prod.rating} · ${prod.reviewsCount} reviews)</span>
          </div>
          
          <h4 class="product-title">${prod.name}</h4>
          
          <div class="product-weight" id="weight-${prod.id}">${currentVariant.weight}</div>
          
          <p class="product-desc">${prod.description}</p>

          <!-- Interactive Variant Selector -->
          ${hasMultipleVariants ? `
            <div class="variant-selector-wrap">
              <label class="variant-label">Choose Size / Variant:</label>
              <div class="variant-pills">
                ${prod.variants.map((v, idx) => `
                  <button type="button" 
                          class="variant-pill ${idx === selIdx ? 'active' : ''}" 
                          id="pill-${prod.id}-${idx}"
                          onclick="selectCardVariant('${prod.id}', ${idx})">
                    ${v.name} (₹${v.price})
                  </button>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="variant-selector-wrap single-variant">
              <span class="single-variant-tag">Standard: ${currentVariant.weight}</span>
            </div>
          `}

          <!-- Price Display -->
          <div class="product-pricing-row">
            <span class="curr-price" id="price-${prod.id}">₹${currentVariant.price}</span>
            <span class="orig-price" id="orig-${prod.id}">₹${currentVariant.originalPrice}</span>
            <span class="discount-tag" id="disc-${prod.id}">${discountPct}% OFF</span>
          </div>

          <!-- Quantity Stepper & Add to Cart -->
          <div class="product-card-actions">
            <div class="card-qty-stepper">
              <button type="button" class="card-qty-btn" onclick="adjustCardQty('${prod.id}', -1)" aria-label="Decrease quantity">−</button>
              <span class="card-qty-val" id="qty-${prod.id}">${qty}</span>
              <button type="button" class="card-qty-btn" onclick="adjustCardQty('${prod.id}', 1)" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="btn-add-cart" id="btn-add-${prod.id}" onclick="addCardToCart('${prod.id}')">
              🛍️ Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function selectCardVariant(productId, variantIndex) {
  cardSelectedVariants[productId] = variantIndex;
  const prod = MEHENDI_PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  const variant = prod.variants[variantIndex];
  if (!variant) return;

  // Update pills styling
  prod.variants.forEach((_, idx) => {
    const pill = document.getElementById(`pill-${productId}-${idx}`);
    if (pill) {
      if (idx === variantIndex) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    }
  });

  // Update price, orig price, weight and discount tag on card
  const priceEl = document.getElementById(`price-${productId}`);
  const origEl = document.getElementById(`orig-${productId}`);
  const weightEl = document.getElementById(`weight-${productId}`);
  const discEl = document.getElementById(`disc-${productId}`);

  if (priceEl) priceEl.innerText = `₹${variant.price}`;
  if (origEl) origEl.innerText = `₹${variant.originalPrice}`;
  if (weightEl) weightEl.innerText = variant.weight;
  if (discEl) {
    const pct = Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100);
    discEl.innerText = `${pct}% OFF`;
  }
}

function adjustCardQty(productId, delta) {
  const current = cardQuantities[productId] || 1;
  const updated = Math.max(1, current + delta);
  cardQuantities[productId] = updated;

  const qtyEl = document.getElementById(`qty-${productId}`);
  if (qtyEl) {
    qtyEl.innerText = updated;
  }
}

function addCardToCart(productId) {
  const prod = MEHENDI_PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  const variantIdx = cardSelectedVariants[productId] || 0;
  const variant = prod.variants[variantIdx] || prod.variants[0];
  const qty = cardQuantities[productId] || 1;

  // Unique item key by product ID and variant index
  const cartItemId = `${prod.id}__v${variantIdx}`;

  const existing = cart.find(item => item.cartItemId === cartItemId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      cartItemId: cartItemId,
      id: prod.id,
      name: prod.name,
      variantName: variant.name,
      weight: variant.weight,
      price: variant.price,
      image: prod.image,
      quantity: qty
    });
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();
  openCartDrawer();

  // Reset card quantity counter back to 1
  cardQuantities[productId] = 1;
  const qtyEl = document.getElementById(`qty-${productId}`);
  if (qtyEl) qtyEl.innerText = 1;

  // Feedback animation on add button
  const addBtn = document.getElementById(`btn-add-${productId}`);
  if (addBtn) {
    const originalText = addBtn.innerHTML;
    addBtn.innerHTML = '✓ Added!';
    addBtn.style.background = '#125541';
    addBtn.style.color = '#ffffff';
    setTimeout(() => {
      addBtn.innerHTML = originalText;
      addBtn.style.background = '';
      addBtn.style.color = '';
    }, 1200);
  }

  showToast(`Added ${qty}x ${prod.name} (${variant.name}) to cart!`);
}

function saveCart() {
  localStorage.setItem('rma_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadgeCount');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) {
    badge.innerText = totalItems;
  }
}

function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer) drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
}

function renderCartDrawer() {
  const itemsContainer = document.getElementById('cartItemsList');
  const emptyState = document.getElementById('cartEmptyState');
  const footer = document.getElementById('cartFooter');

  if (!itemsContainer) return;

  if (cart.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (itemsContainer) itemsContainer.innerHTML = '';
    if (footer) footer.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (footer) footer.style.display = 'block';

  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-thumb">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-variant-tag">Option: <strong>${item.variantName}</strong> (${item.weight})</div>
        <div class="cart-item-price-row">
          <span class="cart-item-price">₹${item.price} each</span>
          <span class="cart-item-subtotal">Item Total: ₹${item.price * item.quantity}</span>
        </div>
        <div class="cart-item-qty">
          <button type="button" class="qty-btn" onclick="changeCartItemQty('${item.cartItemId}', -1)">−</button>
          <span class="qty-val">${item.quantity}</span>
          <button type="button" class="qty-btn" onclick="changeCartItemQty('${item.cartItemId}', 1)">+</button>
          <button type="button" class="cart-item-remove" onclick="removeCartItem('${item.cartItemId}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  updateCartTotals();
}

function changeCartItemQty(cartItemId, delta) {
  const item = cart.find(i => i.cartItemId === cartItemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.cartItemId !== cartItemId);
  }
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function removeCartItem(cartItemId) {
  cart = cart.filter(i => i.cartItemId !== cartItemId);
  saveCart();
  updateCartBadge();
  renderCartDrawer();
  showToast('Item removed from cart.');
}

function updateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = (subtotal >= 499 || subtotal === 0) ? 0 : 60;

  let discount = 0;
  if (activeCoupon === 'RAHISA10') {
    discount = Math.round(subtotal * 0.10);
  } else if (activeCoupon === 'BRIDAL20') {
    discount = Math.round(subtotal * 0.20);
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const subtotalEl = document.getElementById('cartSubtotal');
  const deliveryEl = document.getElementById('cartDelivery');
  const discountRow = document.getElementById('cartDiscountRow');
  const discountEl = document.getElementById('cartDiscount');
  const grandTotalEl = document.getElementById('cartGrandTotal');

  if (subtotalEl) subtotalEl.innerText = `₹${subtotal.toLocaleString('en-IN')}`;
  if (deliveryEl) deliveryEl.innerText = deliveryFee === 0 ? 'FREE (Pan-India)' : `₹${deliveryFee}`;

  if (discountRow && discountEl) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      discountEl.innerText = `-₹${discount.toLocaleString('en-IN')}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (grandTotalEl) grandTotalEl.innerText = `₹${grandTotal.toLocaleString('en-IN')}`;

  return { subtotal, deliveryFee, discount, grandTotal };
}

function handleApplyCoupon() {
  const input = document.getElementById('couponCodeInput');
  const code = input ? input.value.trim().toUpperCase() : '';

  if (code === 'RAHISA10') {
    activeCoupon = 'RAHISA10';
    showToast('Promo code "RAHISA10" applied! 10% discount added.');
    updateCartTotals();
  } else if (code === 'BRIDAL20') {
    activeCoupon = 'BRIDAL20';
    showToast('Bridal Promo code "BRIDAL20" applied! 20% discount added.');
    updateCartTotals();
  } else {
    showToast('Invalid coupon code. Try "RAHISA10" for 10% off!');
  }
}

// Direct WhatsApp Checkout Button inside Cart Drawer
function handleWaCartCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }

  const totals = updateCartTotals();
  const orderId = 'RMA-ORD-' + Math.floor(100000 + Math.random() * 900000);

  const itemsListText = cart.map(i => 
    `• ${i.name} (${i.variantName}) x ${i.quantity} = ₹${i.price * i.quantity}`
  ).join('%0A');

  const waText = `🛍️ *NEW MEHENDI ORDER - RAHISA MEHENDI ART* 🛍️%0A` +
    `*Instagram:* @rahisa_mhendi_art%0A` +
    `*Order Ref:* ${orderId}%0A%0A` +
    `*ITEMS ORDERED:*%0A${itemsListText}%0A%0A` +
    `*Subtotal:* ₹${totals.subtotal.toLocaleString('en-IN')}%0A` +
    (totals.discount > 0 ? `*Promo Discount:* -₹${totals.discount.toLocaleString('en-IN')}%0A` : '') +
    `*Delivery:* ${totals.deliveryFee === 0 ? 'FREE (Pan-India)' : '₹' + totals.deliveryFee}%0A` +
    `*Grand Total:* ₹${totals.grandTotal.toLocaleString('en-IN')}%0A%0A` +
    `Please share UPI / Payment details & confirm dispatch timeline. Thank you! 🌿`;

  // Save order to history
  const savedOrders = JSON.parse(localStorage.getItem('rma_orders')) || [];
  savedOrders.unshift({
    orderId,
    name: 'Customer (WhatsApp Cart)',
    phone: '',
    address: 'Direct WhatsApp Order',
    pincode: '',
    paymentMode: 'WhatsApp Inquiry',
    items: [...cart],
    totals,
    status: 'Pending',
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('rma_orders', JSON.stringify(savedOrders));

  // Sync to Google Sheets if configured
  syncToGoogleSheets({
    type: 'WhatsApp Cart Order',
    id: orderId,
    name: 'Customer (WhatsApp Cart)',
    phone: '',
    items: cart.map(i => `${i.name} (${i.variantName}) x${i.quantity}`).join(', '),
    total: totals.grandTotal,
    address: 'Direct WhatsApp Order',
    notes: `Subtotal: ₹${totals.subtotal}, Discount: ₹${totals.discount}`
  });

  window.open(`https://api.whatsapp.com/send?phone=${RAHISA_WHATSAPP_NUMBER}&text=${waText}`, '_blank');
}

// =============================================================================
// 3. POSTAL DELIVERY CHECKOUT MODAL
// =============================================================================

function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Your cart is empty! Add products to proceed.');
    return;
  }
  closeCartDrawer();
  const totals = updateCartTotals();

  const summaryEl = document.getElementById('checkoutItemsSummary');
  if (summaryEl) {
    summaryEl.innerHTML = cart.map(i => `
      <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 6px;">
        <span>${i.name} (<strong>${i.variantName}</strong>) x${i.quantity}</span>
        <strong>₹${i.price * i.quantity}</strong>
      </div>
    `).join('') + `
      <div style="border-top: 1px dashed #dfbe66; margin-top: 10px; padding-top: 8px; display: flex; justify-content: space-between; font-weight: bold; color: #420d14;">
        <span>Total Payable:</span>
        <span>₹${totals.grandTotal.toLocaleString('en-IN')}</span>
      </div>
    `;
  }

  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.add('active');
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('shipName')?.value.trim();
  const phone = document.getElementById('shipPhone')?.value.trim();
  const address = document.getElementById('shipAddress')?.value.trim();
  const pincode = document.getElementById('shipPincode')?.value.trim();
  const paymentMode = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'UPI / QR Code';

  if (!name || !phone || !address || !pincode) {
    showToast('Please complete shipping details.');
    return;
  }

  const orderId = 'RMA-ORD-' + Math.floor(100000 + Math.random() * 900000);
  const totals = updateCartTotals();

  // Save complete order with shipping details
  const savedOrders = JSON.parse(localStorage.getItem('rma_orders')) || [];
  savedOrders.unshift({
    orderId,
    name,
    phone,
    address,
    pincode,
    paymentMode,
    items: [...cart],
    totals,
    status: 'Pending',
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('rma_orders', JSON.stringify(savedOrders));

  // Sync to Google Sheets if configured
  syncToGoogleSheets({
    type: 'Product Order',
    id: orderId,
    name: name,
    phone: phone,
    items: cart.map(i => `${i.name} (${i.variantName}) x${i.quantity}`).join(', '),
    total: totals.grandTotal,
    address: `${address}, PIN: ${pincode}`,
    notes: `Payment: ${paymentMode}`
  });

  const itemsText = cart.map(i => `• ${i.name} (${i.variantName}) x ${i.quantity} = ₹${i.price * i.quantity}`).join('%0A');
  const waOrderMsg = `🛍️ *NEW MEHENDI PRODUCT ORDER - RAHISA MEHENDI ART* 🛍️%0A%0A` +
    `*Order ID:* ${orderId}%0A` +
    `*Customer:* ${encodeURIComponent(name)}%0A` +
    `*Phone:* ${encodeURIComponent(phone)}%0A` +
    `*Shipping Address:* ${encodeURIComponent(address + ', PIN: ' + pincode)}%0A` +
    `*Payment Mode:* ${encodeURIComponent(paymentMode)}%0A%0A` +
    `*Items Ordered:*%0A${itemsText}%0A%0A` +
    `*Grand Total:* ₹${totals.grandTotal.toLocaleString('en-IN')}%0A` +
    `Please dispatch our fresh organic cones and share tracking details! 🌿`;

  closeModal('checkoutModal');
  showOrderSuccessModal(orderId, name, phone, totals.grandTotal, paymentMode, waOrderMsg);

  // Clear cart after checkout
  cart = [];
  saveCart();
  updateCartBadge();
}

function showOrderSuccessModal(orderId, name, phone, total, paymentMode, waOrderMsg) {
  const modal = document.getElementById('orderConfirmedModal');
  const detailsEl = document.getElementById('orderConfirmedDetails');
  const waBtn = document.getElementById('btnOrderWaSend');

  if (detailsEl) {
    detailsEl.innerHTML = `
      <div style="background: #fdfbf7; border: 2px solid #cba135; border-radius: 12px; padding: 22px; text-align: left; margin-bottom: 20px;">
        <h4 style="color: #67141f; font-family: 'Cinzel', serif; font-size: 1.3rem; margin-bottom: 8px;">Order Placed Successfully!</h4>
        <p style="color: #8c2817; font-weight: bold; margin-bottom: 12px;">Invoice No: ${orderId}</p>
        <p><strong>Customer:</strong> ${name} (${phone})</p>
        <p><strong>Payment Method:</strong> ${paymentMode}</p>
        <p><strong>Total Amount:</strong> ₹${total.toLocaleString('en-IN')}</p>
        <p style="color: #125541; font-weight: 600; margin-top: 10px;">
          ✓ Cones will be freshly made and dispatched within 24 hours. Click the button below to send your invoice copy directly to Rahisa on WhatsApp!
        </p>
      </div>
    `;
  }

  if (waBtn) {
    waBtn.href = `https://api.whatsapp.com/send?phone=${RAHISA_WHATSAPP_NUMBER}&text=${waOrderMsg}`;
  }

  if (modal) modal.classList.add('active');
}

// =============================================================================
// 4. QUICK VIEW, GALLERY & LIGHTBOX
// =============================================================================

function openQuickView(productId) {
  const prod = MEHENDI_PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  const selIdx = cardSelectedVariants[productId] || 0;
  const variant = prod.variants[selIdx] || prod.variants[0];

  const contentEl = document.getElementById('quickViewContent');
  if (contentEl) {
    contentEl.innerHTML = `
      <div class="quickview-grid">
        <img src="${prod.image}" alt="${prod.name}" class="quickview-img">
        <div>
          <span class="quickview-badge">${prod.badge}</span>
          <h3 class="quickview-title">${prod.name}</h3>
          <p class="quickview-desc">${prod.description}</p>
          <div class="quickview-features">
            <strong>Key Highlights & Purity:</strong>
            <ul>
              ${prod.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
          <div class="quickview-pricing">
            <span class="quickview-curr-price">₹${variant.price}</span>
            <span class="quickview-orig-price">₹${variant.originalPrice}</span>
            <span class="quickview-weight">(${variant.weight})</span>
          </div>
          <button type="button" class="btn-add-cart" onclick="addCardToCart('${prod.id}'); closeModal('quickViewModal');">
            🛍️ Add Selected Variant to Cart
          </button>
        </div>
      </div>
    `;
  }
  const modal = document.getElementById('quickViewModal');
  if (modal) modal.classList.add('active');
}

function filterGallery(category) {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    const itemCat = item.getAttribute('data-category') || 'all';
    if (category === 'all' || itemCat === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function openLightbox(imgSrc, title, desc) {
  const modal = document.getElementById('lightboxModal');
  const imgEl = document.getElementById('lightboxImg');
  const capEl = document.getElementById('lightboxCaption');
  if (imgEl) imgEl.src = imgSrc;
  if (capEl) capEl.innerHTML = `<strong>${title}</strong><br><span style="font-size:0.88rem; color:#eed58e; margin-top:4px; display:inline-block;">${desc}</span>`;
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Close modals when clicking backdrop
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Toast notification helper
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3400);
}

// =============================================================================
// 5. PASSWORD-PROTECTED ADMIN ORDERS DASHBOARD & GOOGLE SHEETS SYNC
// =============================================================================

const ADMIN_PIN = '92221';

// Initialize sample data on first run
initDemoOrdersIfEmpty();

function initDemoOrdersIfEmpty() {
  if (!localStorage.getItem('rma_orders')) {
    const sampleOrders = [
      {
        orderId: 'RMA-ORD-839201',
        name: 'Pooja Sharma',
        phone: '9811223344',
        address: 'B-42, Defence Colony, New Delhi',
        pincode: '110024',
        paymentMode: 'UPI / GPay',
        items: [
          { name: '100% Pure Organic Mehendi Powder', variantName: '1 kg Pack', price: 300, quantity: 2 },
          { name: 'Eucalyptus Mehendi Oil (100ml)', variantName: '100ml Bottle', price: 350, quantity: 1 }
        ],
        totals: { subtotal: 950, discount: 0, deliveryFee: 0, grandTotal: 950 },
        status: 'Dispatched',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        orderId: 'RMA-ORD-741905',
        name: 'Aarti Mehra',
        phone: '9922334455',
        address: 'Flat 302, Palm Heights, Powai, Mumbai',
        pincode: '400076',
        paymentMode: 'UPI / GPay',
        items: [
          { name: 'Ready-to-Use Organic Henna Cones', variantName: 'Pack of 12 Cones', price: 320, quantity: 2 },
          { name: 'Natural Henna Aftercare Balm & Sealant', variantName: '50g Tin', price: 220, quantity: 1 }
        ],
        totals: { subtotal: 860, discount: 86, deliveryFee: 0, grandTotal: 774 },
        status: 'Confirmed',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        orderId: 'RMA-ORD-652814',
        name: 'Zoya Khan',
        phone: '9733445566',
        address: 'Civil Lines, Jaipur, Rajasthan',
        pincode: '302006',
        paymentMode: 'Cash on Delivery',
        items: [
          { name: '100% Pure Organic Mehendi Powder', variantName: '500g Pack', price: 150, quantity: 3 },
          { name: 'Cajuput Mehendi Oil (100ml)', variantName: '100ml Bottle', price: 350, quantity: 1 }
        ],
        totals: { subtotal: 800, discount: 0, deliveryFee: 0, grandTotal: 800 },
        status: 'Pending',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
      }
    ];
    localStorage.setItem('rma_orders', JSON.stringify(sampleOrders));
  }

  if (!localStorage.getItem('rma_bookings')) {
    const sampleBookings = [
      {
        id: 'RMA-BOOK-912847',
        name: 'Kavita Singhania',
        phone: '9876543211',
        service: 'Bridal Mehendi (Signature) (₹5,000)',
        date: '2026-11-28',
        city: 'The Leela Palace, Udaipur',
        total: 7000,
        status: 'Date Reserved',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: 'RMA-BOOK-820194',
        name: 'Rhea Kapoor',
        phone: '9811002299',
        service: 'Royal Heritage Bridal Mehendi (₹8,500)',
        date: '2026-12-14',
        city: 'Taj West End, Bengaluru',
        total: 10500,
        status: 'Deposit Paid',
        timestamp: new Date(Date.now() - 3600000 * 16).toISOString()
      }
    ];
    localStorage.setItem('rma_bookings', JSON.stringify(sampleBookings));
  }
}

function openAdminModal() {
  const modal = document.getElementById('adminModal');
  const loginSec = document.getElementById('adminLoginSection');
  const dashSec = document.getElementById('adminDashboardSection');
  const isLoggedIn = localStorage.getItem('rma_admin_logged_in') === 'true';

  if (isLoggedIn) {
    if (loginSec) loginSec.style.display = 'none';
    if (dashSec) dashSec.style.display = 'block';
    renderAdminDashboard();
  } else {
    if (loginSec) loginSec.style.display = 'block';
    if (dashSec) dashSec.style.display = 'none';
    const pinInput = document.getElementById('adminPinInput');
    if (pinInput) pinInput.value = '';
  }

  if (modal) modal.classList.add('active');
}

function handleAdminLogin(e) {
  e.preventDefault();
  const pinInput = document.getElementById('adminPinInput');
  const pin = pinInput ? pinInput.value.trim() : '';

  if (pin === ADMIN_PIN || pin === 'rahisa2026') {
    localStorage.setItem('rma_admin_logged_in', 'true');
    const loginSec = document.getElementById('adminLoginSection');
    const dashSec = document.getElementById('adminDashboardSection');
    if (loginSec) loginSec.style.display = 'none';
    if (dashSec) dashSec.style.display = 'block';
    renderAdminDashboard();
    showToast('Welcome back, Rahisa! Admin Orders Dashboard unlocked.');
  } else {
    showToast('Incorrect PIN. (Hint: Default is 92221)');
  }
}

function handleAdminLogout() {
  localStorage.removeItem('rma_admin_logged_in');
  const loginSec = document.getElementById('adminLoginSection');
  const dashSec = document.getElementById('adminDashboardSection');
  if (loginSec) loginSec.style.display = 'block';
  if (dashSec) dashSec.style.display = 'none';
  const pinInput = document.getElementById('adminPinInput');
  if (pinInput) pinInput.value = '';
  showToast('Logged out of Admin Portal.');
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });

  const ordersTab = document.getElementById('tabContentOrders');
  const bookingsTab = document.getElementById('tabContentBookings');
  const sheetsTab = document.getElementById('tabContentSheets');

  if (ordersTab) ordersTab.style.display = tabName === 'orders' ? 'block' : 'none';
  if (bookingsTab) bookingsTab.style.display = tabName === 'bookings' ? 'block' : 'none';
  if (sheetsTab) sheetsTab.style.display = tabName === 'sheets' ? 'block' : 'none';
}

function renderAdminDashboard() {
  const orders = JSON.parse(localStorage.getItem('rma_orders')) || [];
  const bookings = JSON.parse(localStorage.getItem('rma_bookings')) || [];

  // Update KPI Stats
  const totalRev = orders.reduce((sum, o) => sum + (o.totals ? o.totals.grandTotal : 0), 0);
  const totalBookingVal = bookings.reduce((sum, b) => sum + (b.total || 0), 0);
  const pendingCount = orders.filter(o => !o.status || o.status === 'Pending').length;

  const kpiOrdersEl = document.getElementById('kpiTotalOrders');
  const kpiRevEl = document.getElementById('kpiOrdersRevenue');
  const kpiBookingsEl = document.getElementById('kpiTotalBookings');
  const kpiBookingsValEl = document.getElementById('kpiBookingsValue');
  const kpiPendingEl = document.getElementById('kpiPendingOrders');
  const tabOrderCount = document.getElementById('tabOrderCount');
  const tabBookingCount = document.getElementById('tabBookingCount');

  if (kpiOrdersEl) kpiOrdersEl.innerText = orders.length;
  if (kpiRevEl) kpiRevEl.innerText = `₹${totalRev.toLocaleString('en-IN')} Total Revenue`;
  if (kpiBookingsEl) kpiBookingsEl.innerText = bookings.length;
  if (kpiBookingsValEl) kpiBookingsValEl.innerText = `₹${totalBookingVal.toLocaleString('en-IN')} Pipeline`;
  if (kpiPendingEl) kpiPendingEl.innerText = pendingCount;
  if (tabOrderCount) tabOrderCount.innerText = orders.length;
  if (tabBookingCount) tabBookingCount.innerText = bookings.length;

  // Render Orders Table
  renderOrdersTable(orders);

  // Render Bookings Table
  renderBookingsTable(bookings);

  // Populate Webhook URL
  const webhookInput = document.getElementById('googleSheetsWebhookInput');
  const savedWebhook = localStorage.getItem('rma_sheets_webhook');
  if (webhookInput && savedWebhook) {
    webhookInput.value = savedWebhook;
  }
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById('adminOrdersTableBody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#665456;">No customer orders placed yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(ord => {
    const status = ord.status || 'Pending';
    const statusClass = status.toLowerCase();
    const dateFormatted = ord.timestamp ? new Date(ord.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
    const itemsSummary = (ord.items || []).map(i => `${i.name} (${i.variantName || 'Std'}) x${i.quantity}`).join('<br>');
    const grandTotal = ord.totals ? ord.totals.grandTotal : 0;
    const cleanPhone = (ord.phone || '').replace(/\D/g, '');

    return `
      <tr>
        <td><strong>${ord.orderId}</strong></td>
        <td style="white-space:nowrap; font-size:0.8rem; color:#665456;">${dateFormatted}</td>
        <td>
          <strong>${ord.name || 'Anonymous'}</strong><br>
          <a href="tel:${ord.phone}" style="font-size:0.8rem; color:#8c2817;">${ord.phone || 'N/A'}</a>
        </td>
        <td style="font-size:0.8rem;">${itemsSummary || 'Cones/Powder'}</td>
        <td><strong>₹${grandTotal.toLocaleString('en-IN')}</strong></td>
        <td style="font-size:0.78rem; max-width:180px;">${ord.address || 'Direct WhatsApp Order'}<br>PIN: ${ord.pincode || 'N/A'}</td>
        <td>
          <select class="status-select" onchange="updateOrderStatus('${ord.orderId}', this.value)">
            <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>🟡 Pending</option>
            <option value="Confirmed" ${status === 'Confirmed' ? 'selected' : ''}>🔵 Confirmed</option>
            <option value="Dispatched" ${status === 'Dispatched' ? 'selected' : ''}>🚚 Dispatched</option>
            <option value="Delivered" ${status === 'Delivered' ? 'selected' : ''}>🟢 Delivered</option>
            <option value="Cancelled" ${status === 'Cancelled' ? 'selected' : ''}>🔴 Cancelled</option>
          </select>
        </td>
        <td style="white-space:nowrap;">
          ${cleanPhone ? `
            <a href="https://api.whatsapp.com/send?phone=91${cleanPhone}&text=Hello%20${encodeURIComponent(ord.name || 'Valued Customer')}!%20Regarding%20your%20Rahisa%20Mehendi%20Art%20Order%20${ord.orderId}..." target="_blank" class="btn-wa-table" title="Message Customer on WhatsApp">
              💬 WhatsApp
            </a>
          ` : ''}
          <button type="button" class="btn-delete-row" onclick="deleteOrder('${ord.orderId}')" title="Delete Order">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderBookingsTable(bookings) {
  const tbody = document.getElementById('adminBookingsTableBody');
  if (!tbody) return;

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:#665456;">No bridal bookings received yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map(b => {
    const status = b.status || 'New Inquiry';
    const dateFormatted = b.date || 'TBD';
    const cleanPhone = (b.phone || '').replace(/\D/g, '');

    return `
      <tr>
        <td><strong>${b.id}</strong></td>
        <td>
          <strong>${b.name}</strong><br>
          <a href="tel:${b.phone}" style="font-size:0.8rem; color:#8c2817;">${b.phone}</a>
        </td>
        <td style="white-space:nowrap; font-weight:700; color:#420d14;">📅 ${dateFormatted}</td>
        <td>${b.service || 'Bridal Package'}</td>
        <td style="font-size:0.8rem;">Location: ${b.city || 'Local'}</td>
        <td style="font-size:0.78rem; max-width:160px;">${b.notes || b.specialReq || 'Standard'}</td>
        <td><strong>₹${(b.total || 0).toLocaleString('en-IN')}</strong></td>
        <td>
          <select class="status-select" onchange="updateBookingStatus('${b.id}', this.value)">
            <option value="New Inquiry" ${status === 'New Inquiry' ? 'selected' : ''}>🟡 New Inquiry</option>
            <option value="Date Reserved" ${status === 'Date Reserved' ? 'selected' : ''}>🔵 Date Reserved</option>
            <option value="Deposit Paid" ${status === 'Deposit Paid' ? 'selected' : ''}>🟢 Deposit Paid</option>
            <option value="Completed" ${status === 'Completed' ? 'selected' : ''}>🏁 Completed</option>
          </select>
        </td>
        <td style="white-space:nowrap;">
          ${cleanPhone ? `
            <a href="https://api.whatsapp.com/send?phone=91${cleanPhone}&text=Hello%20${encodeURIComponent(b.name)}!%20Thank%20you%20for%20choosing%20Rahisa%20Mehendi%20Art.%20Regarding%20your%20event%20on%20${b.date}..." target="_blank" class="btn-wa-table" title="Message Bride on WhatsApp">
              💬 WhatsApp
            </a>
          ` : ''}
          <button type="button" class="btn-delete-row" onclick="deleteBooking('${b.id}')" title="Delete Booking">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

function updateOrderStatus(orderId, newStatus) {
  const orders = JSON.parse(localStorage.getItem('rma_orders')) || [];
  const target = orders.find(o => o.orderId === orderId);
  if (target) {
    target.status = newStatus;
    localStorage.setItem('rma_orders', JSON.stringify(orders));
    renderAdminDashboard();
    showToast(`Order ${orderId} marked as "${newStatus}".`);
  }
}

function updateBookingStatus(bookingId, newStatus) {
  const bookings = JSON.parse(localStorage.getItem('rma_bookings')) || [];
  const target = bookings.find(b => b.id === bookingId);
  if (target) {
    target.status = newStatus;
    localStorage.setItem('rma_bookings', JSON.stringify(bookings));
    renderAdminDashboard();
    showToast(`Booking ${bookingId} status updated to "${newStatus}".`);
  }
}

function deleteOrder(orderId) {
  if (!confirm(`Are you sure you want to delete order ${orderId}?`)) return;
  let orders = JSON.parse(localStorage.getItem('rma_orders')) || [];
  orders = orders.filter(o => o.orderId !== orderId);
  localStorage.setItem('rma_orders', JSON.stringify(orders));
  renderAdminDashboard();
  showToast('Order removed.');
}

function deleteBooking(bookingId) {
  if (!confirm(`Are you sure you want to delete booking ${bookingId}?`)) return;
  let bookings = JSON.parse(localStorage.getItem('rma_bookings')) || [];
  bookings = bookings.filter(b => b.id !== bookingId);
  localStorage.setItem('rma_bookings', JSON.stringify(bookings));
  renderAdminDashboard();
  showToast('Booking removed.');
}

function filterOrdersTable() {
  const query = (document.getElementById('adminOrderSearch')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('adminOrderStatusFilter')?.value || 'all';
  const orders = JSON.parse(localStorage.getItem('rma_orders')) || [];

  const filtered = orders.filter(o => {
    const matchesQuery = !query || 
      (o.orderId && o.orderId.toLowerCase().includes(query)) ||
      (o.name && o.name.toLowerCase().includes(query)) ||
      (o.phone && o.phone.toLowerCase().includes(query));
    const matchesStatus = statusFilter === 'all' || (o.status || 'Pending') === statusFilter;
    return matchesQuery && matchesStatus;
  });

  renderOrdersTable(filtered);
}

function filterBookingsTable() {
  const query = (document.getElementById('adminBookingSearch')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('adminBookingStatusFilter')?.value || 'all';
  const bookings = JSON.parse(localStorage.getItem('rma_bookings')) || [];

  const filtered = bookings.filter(b => {
    const matchesQuery = !query || 
      (b.id && b.id.toLowerCase().includes(query)) ||
      (b.name && b.name.toLowerCase().includes(query)) ||
      (b.phone && b.phone.toLowerCase().includes(query)) ||
      (b.city && b.city.toLowerCase().includes(query));
    const matchesStatus = statusFilter === 'all' || (b.status || 'New Inquiry') === statusFilter;
    return matchesQuery && matchesStatus;
  });

  renderBookingsTable(filtered);
}

function exportOrdersToCSV() {
  const orders = JSON.parse(localStorage.getItem('rma_orders')) || [];
  if (orders.length === 0) {
    showToast('No orders to export!');
    return;
  }

  let csv = 'Order ID,Date,Customer Name,Phone,Items,Total (INR),Address,PIN,Status\n';
  orders.forEach(o => {
    const items = (o.items || []).map(i => `${i.name} (${i.variantName}) x${i.quantity}`).join(' | ');
    csv += `"${o.orderId}","${o.timestamp || ''}","${o.name || ''}","${o.phone || ''}","${items.replace(/"/g, '""')}","${o.totals ? o.totals.grandTotal : 0}","${(o.address || '').replace(/"/g, '""')}","${o.pincode || ''}","${o.status || 'Pending'}"\n`;
  });

  downloadCSVFile(csv, 'rahisa_mehendi_orders.csv');
  showToast('Orders exported to CSV successfully!');
}

function exportBookingsToCSV() {
  const bookings = JSON.parse(localStorage.getItem('rma_bookings')) || [];
  if (bookings.length === 0) {
    showToast('No bookings to export!');
    return;
  }

  let csv = 'Booking Ref,Client Name,Phone,Event Date,Package,City/Venue,Estimated Total (INR),Status\n';
  bookings.forEach(b => {
    csv += `"${b.id}","${b.name || ''}","${b.phone || ''}","${b.date || ''}","${b.service || ''}","${(b.city || '').replace(/"/g, '""')}","${b.total || 0}","${b.status || 'New Inquiry'}"\n`;
  });

  downloadCSVFile(csv, 'rahisa_bridal_bookings.csv');
  showToast('Bookings exported to CSV successfully!');
}

function downloadCSVFile(content, fileName) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function saveGoogleSheetsWebhook() {
  const input = document.getElementById('googleSheetsWebhookInput');
  const url = input ? input.value.trim() : '';
  if (!url) {
    localStorage.removeItem('rma_sheets_webhook');
    showToast('Google Sheets webhook cleared.');
    return;
  }
  localStorage.setItem('rma_sheets_webhook', url);
  showToast('Google Sheets webhook saved successfully!');
}

function testGoogleSheetsWebhook() {
  const url = localStorage.getItem('rma_sheets_webhook') || document.getElementById('googleSheetsWebhookInput')?.value.trim();
  if (!url) {
    showToast('Please enter and save your Google Apps Script Webhook URL first.');
    return;
  }

  showToast('Sending test ping to Google Sheets...');
  syncToGoogleSheets({
    type: 'Test Ping',
    id: 'TEST-' + Math.floor(1000 + Math.random() * 9000),
    name: 'Rahisa Admin Test',
    phone: '9510092221',
    items: 'Test Connection (100% Organic Henna)',
    total: 350,
    address: 'Studio Test Ping',
    notes: 'Webhook verified'
  });
  showToast('Test payload dispatched to Google Sheets!');
}

function syncToGoogleSheets(data) {
  const webhookUrl = localStorage.getItem('rma_sheets_webhook');
  if (!webhookUrl) return;

  try {
    fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(err => console.log('Sheets sync notice:', err));
  } catch (e) {
    console.error('Google Sheets sync error:', e);
  }
}

