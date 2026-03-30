document.addEventListener('DOMContentLoaded', () => {

    const productContainer = document.querySelector('.product-row');
    const cartCountElem = document.getElementById('cart-count');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    updateCartCount();

    // 🔹 Завантаження товарів
    fetch('data/products.json')
        .then(res => res.json())
        .then(products => {

            products.forEach((product) => {

                const card = document.createElement('div');
                card.className = 'card reveal';

                // --- images ---
                let imagesHTML = '';
                product.images.forEach((img, i) => {
                    imagesHTML += `<img src="${img}" class="${i === 0 ? 'visible' : 'hidden'}">`;
                });

                if (product.images.length > 1) {
                    imagesHTML += `
                        <div class="arrow left">&#10094;</div>
                        <div class="arrow right">&#10095;</div>
                    `;
                }

                // --- card html ---
                card.innerHTML = `
                    <div class="badge">NEW</div>
                    <div class="sale">-20%</div>
                    <div class="wishlist">♡</div>

                    <a href="./product.html?id=${product.id}" class="product-images">
                        ${imagesHTML}
                    </a>

                    <h3>${product.name}</h3>
                    <p class="price">${product.price} грн</p>

                    <div class="quick-add" data-id="${product.id}">
                        Quick add
                    </div>
                `;

                productContainer.appendChild(card);

                // 🔥 Клік по картці (як норм магазин)
                card.addEventListener('click', () => {
    window.location.href = `./product.html?id=${product.id}`;
});

                // 🔥 Щоб quick-add НЕ відкривав сторінку
                card.querySelector('.quick-add').addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                // 🔥 СЛАЙДЕР
                if (product.images.length > 1) {
                    const images = card.querySelectorAll('img');
                    let current = 0;

                    const showImage = (index) => {
                        images.forEach((img, i) => {
                            img.classList.toggle('visible', i === index);
                            img.classList.toggle('hidden', i !== index);
                        });
                    };

                    card.querySelector('.arrow.left').addEventListener('click', (e) => {
                        e.stopPropagation();
                        current = (current - 1 + images.length) % images.length;
                        showImage(current);
                    });

                    card.querySelector('.arrow.right').addEventListener('click', (e) => {
                        e.stopPropagation();
                        current = (current + 1) % images.length;
                        showImage(current);
                    });
                }

            });

            // 🔥 QUICK ADD
            document.querySelectorAll('.quick-add').forEach(btn => {
                btn.addEventListener('click', (e) => {

                    e.stopPropagation();

                    const id = e.target.dataset.id;
                    const product = products.find(p => p.id == id);

                    cart.push(product);
                    localStorage.setItem('cart', JSON.stringify(cart));

                    updateCartCount();
                    showToast("Товар доданий у корзину!");

                    const cartLink = document.getElementById('cart-link');
                    if (cartLink) {
                        cartLink.classList.add('cart-bounce');
                        setTimeout(() => {
                            cartLink.classList.remove('cart-bounce');
                        }, 350);
                    }

                });
            });

        });

    // 🔥 CART COUNT
    function updateCartCount() {
        if (cartCountElem) {
            cartCountElem.textContent = cart.length;
        }
    }

    // 🔥 TOAST
    function showToast(text) {
        const toast = document.getElementById('toast');
        toast.textContent = text;
        toast.style.display = 'block';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    // 🔥 REVEAL
    function revealOnScroll() {
        let elements = document.querySelectorAll('.reveal');
        elements.forEach(el => {
            let windowHeight = window.innerHeight;
            let elementTop = el.getBoundingClientRect().top;

            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);

    // 🔥 SIDEBAR
    const logo = document.getElementById('logo');
    const sidebar = document.getElementById('sidebar');

    let timeout;

    function openSidebar() {
        clearTimeout(timeout);
        sidebar.style.left = '0';
    }

    function closeSidebar() {
        timeout = setTimeout(() => {
            sidebar.style.left = '-300px';
        }, 200);
    }

    logo.addEventListener('mouseenter', openSidebar);
    logo.addEventListener('mouseleave', closeSidebar);

    sidebar.addEventListener('mouseenter', openSidebar);
    sidebar.addEventListener('mouseleave', closeSidebar);

});