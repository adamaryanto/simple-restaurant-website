// Toggle Navbar
const navbarNav = document.querySelector('.navbar-nav');
document.querySelector('#hamburger-menu').onclick = (e) => {
    e.preventDefault();
    navbarNav.classList.toggle('active');
};

// Toggle Search Form
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');

document.querySelector('#search').onclick = (e) => {
    e.preventDefault();
    searchForm.classList.toggle('active');
    searchBox.focus();
    shoppingCart.classList.remove('active');
    navbarNav.classList.remove('active');
};

// Toggle Shopping Cart
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#cart-nav').onclick = (e) => {
    e.preventDefault();
    shoppingCart.classList.toggle('active');
    searchForm.classList.remove('active');
    navbarNav.classList.remove('active');
};

document.querySelector('#cart-close').onclick = () => {
    shoppingCart.classList.remove('active');
};

// Click Outside to Close
const hm = document.querySelector('#hamburger-menu');
const sb = document.querySelector('#search');
const sc = document.querySelector('#cart-nav');

document.addEventListener('click', function (e) {
    if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    }
    if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
        searchForm.classList.remove('active');
    }
    if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
        shoppingCart.classList.remove('active');
    }
});

// --- Search Functionality ---
searchBox.addEventListener('keyup', function (e) {
    const term = e.target.value.toLowerCase();
    const menuCards = document.querySelectorAll('.menu-card');

    menuCards.forEach((card) => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        if (title.indexOf(term) != -1) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

// --- Shopping Cart Logic ---
let cart = [];
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.querySelector('#cart-total');
const quantityBadge = document.querySelector('.quantity-badge');

// Add to Cart
const addButtons = document.querySelectorAll('.btn-add');
addButtons.forEach((btn) => {
    btn.onclick = (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = parseInt(btn.getAttribute('data-price'));
        const img = btn.getAttribute('data-img');

        addToCart(id, name, price, img);
        openCart(); // Optional: auto open cart on add
    };
});

function addToCart(id, name, price, img) {
    const existingItem = cart.find((item) => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            img: img,
            quantity: 1
        });
    }
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    renderCart();
}

function renderCart() {
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        quantityBadge.style.display = 'none';
    } else {
        cart.forEach((item) => {
            totalPrice += item.price * item.quantity;
            totalItems += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="item-detail">
                    <h4>${item.name}</h4>
                    <div class="item-price">${formatRupiah(item.price)} x ${item.quantity}</div>
                </div>
                <i class="fa-solid fa-trash remove-item" data-id="${item.id}"></i>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Remove item listener
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach((btn) => {
            btn.onclick = (e) => {
                removeFromCart(e.target.getAttribute('data-id'));
            };
        });

        quantityBadge.style.display = 'block';
        quantityBadge.innerText = totalItems;
    }

    cartTotalElement.innerText = formatRupiah(totalPrice);
}

function openCart() {
    shoppingCart.classList.add('active');
    searchForm.classList.remove('active');
    navbarNav.classList.remove('active');
}

// Helper: Format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};
