// // ---------- STATE MANAGEMENT ----------
// let cartItems = []; // each item: { id, name, price, size, quantity, image? optional }
let selectedRingSize = "EU 52";

// // DOM elements
const searchPopup = document.getElementById('search-popup');
const searchOpenBtn = document.getElementById('search-open-btn');
const searchCloseBtn = document.getElementById('search-close-btn');
const searchInput = document.getElementById('search-input');

const cartDrawer = document.getElementById('cart-drawer');
const cartOpenBtn = document.getElementById('cart-open-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartPanel = document.getElementById('cart-panel');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalSpan = document.getElementById('cart-subtotal');
const viewBagCloseBtn = document.getElementById('view-bag-close');

const sizeOptions = document.querySelectorAll('.size-option');
const selectedSizeText = document.getElementById('selected-size-text');

// UI: open/close drawers
function openSearchPopup() {
    searchPopup.classList.remove('hidden');
    setTimeout(() => { searchPopup.classList.add('opacity-100'); }, 10);
    document.body.classList.add('no-scroll');
    if (searchInput) setTimeout(() => searchInput.focus(), 50);
}
function closeSearchPopup() {
    searchPopup.classList.remove('opacity-100');
    setTimeout(() => {
        searchPopup.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    }, 200);
}
function openCartDrawer() {
    cartDrawer.classList.remove('hidden');
    setTimeout(() => {
        cartDrawer.classList.add('opacity-100');
        if (cartPanel) cartPanel.classList.remove('translate-x-full');
    }, 10);
    document.body.classList.add('no-scroll');
}
function closeCartDrawer() {
    if (cartPanel) cartPanel.classList.add('translate-x-full');
    cartDrawer.classList.remove('opacity-100');
    setTimeout(() => {
        cartDrawer.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    }, 250);
}

// Size selection logic
sizeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        sizeOptions.forEach(el => {
            el.classList.remove('bg-primary', 'text-on-primary');
            el.classList.add('bg-surface-container-low');
        });
        opt.classList.remove('bg-surface-container-low');
        opt.classList.add('bg-primary', 'text-on-primary');
        const newSize = opt.getAttribute('data-size');
        if (newSize) {
            selectedRingSize = newSize;
            selectedSizeText.innerText = `Selected: ${selectedRingSize} (Standard Medium)`;
        }
    });
});

// Quick add from recommendations
document.querySelectorAll('.add-to-cart-quick').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        if (name && price) addToCart(name, price, 'One Size');
    });
});

// Search functionality: alert demo
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) alert(`🔍 Searching for "${query}" (demo). In production, this would show product results.`);
            else alert('Please enter a search term.');
            closeSearchPopup();
            searchInput.value = '';
        }
    });
}

// Event listeners for modals
if (searchOpenBtn) searchOpenBtn.addEventListener('click', openSearchPopup);
if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearchPopup);
if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCartDrawer);
if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
if (viewBagCloseBtn) viewBagCloseBtn.addEventListener('click', closeCartDrawer);

// Prevent closing when clicking inside panel
if (cartPanel) {
    cartPanel.addEventListener('click', (e) => e.stopPropagation());
}
if (searchPopup) {
    const searchInner = searchPopup.querySelector('.w-full.max-w-3xl');
    if (searchInner) searchInner.addEventListener('click', (e) => e.stopPropagation());
    searchPopup.addEventListener('click', closeSearchPopup);
    searchInner?.addEventListener('click', (e) => e.stopPropagation());
}

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (searchPopup && !searchPopup.classList.contains('hidden')) closeSearchPopup();
        if (cartDrawer && !cartDrawer.classList.contains('hidden')) closeCartDrawer();
    }
});
