const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];

    savedCart.forEach((cartItem) => {
        const product = products.find((item) => item.id === cartItem.id);
        if (product) product.stock -= cartItem.quantity;
    });

    cart = savedCart;
    renderAllProducts(products);
    printCart(cart);
};

const toggleDisplay = (itemName) => {
    document.querySelector(itemName).classList.toggle('hidden');
};

const changeToggleMenuIcon = (e) => {
    const inputs = document.querySelector('.inputs');
    e.currentTarget.innerHTML = !inputs.classList.contains('hidden')
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
};

const createElement = (tag, className = '', textContent = '', functionEvent = null, id = null) => {
    const el = document.createElement(tag);
    if (className) el.classList.add(className);
    if (textContent) el.textContent = textContent;
    if (functionEvent && tag === 'button') el.addEventListener('click', functionEvent);
    if (id) el.id = id;
    return el;
};

const createImg = (src = '', alt = '', className = '') => {
    const img = document.createElement('img');
    if (src) img.src = src;
    if (alt) img.alt = alt;
    if (className) img.classList.add(className);
    return img;
};

const createCartItem = (item) => {
    const product = products.find((p) => p.id == item.id);
    const itemContainer = createElement('div', 'item-cart-container');
    const itemDetail = createElement('p', '', `${product.name} - €${product.price} x ${item.quantity}`);
    const btnsContainer = createElement('div', 'btns-container');

    const eliminarBtn = createElement('button', '', 'Eliminar', () => removeFromCart(product.id));
    const restBtn = createElement('button', '', '-', () => updateCartItem(product.id, -1));
    const addBtn = createElement('button', '', '+', () => updateCartItem(product.id, 1));

    checkStock(addBtn, '+', product.stock);

    btnsContainer.append(eliminarBtn, restBtn, addBtn);
    itemContainer.append(itemDetail, btnsContainer);

    localStorage.setItem('cart', JSON.stringify(cart));

    return { itemContainer, total: product.price * item.quantity };
};

const createAlert = (icon, title, message = '', color) => {
    const alert = document.querySelector('.alert');
    const alertIcon = document.querySelector('.alert-icon');
    const alertTitle = document.querySelector('.alert-title');
    const alertMessage = document.querySelector('.alert-message');

    alert.classList.remove('hidden');
    alertIcon.innerHTML = icon;
    alertIcon.className = `alert-icon ${color}`;
    alertTitle.textContent = title;
    alertMessage.textContent = message;
};

const renderProduct = (product) => {
    const card = createElement('div', 'product-card');
    card.id = product.id;

    const imgContainer = createElement('figure', 'product-img');
    const img = createImg(product.image, product.name);
    imgContainer.appendChild(img);

    const title = createElement('h3', 'product-title', product.name);
    const description = createElement('p', 'product-description', product.description);
    const price = createElement('p', 'product-price', `€${product.price}`);

    const addBtn = createElement('button', 'add-to-cart-button', 'Agregar al Carrito', () => addToCart(cart, product.id), product.id);
    checkStock(addBtn, 'Sin stock', product.stock);

    card.append(imgContainer, title, description, price, addBtn);
    return card;
};

const renderAllProducts = (products) => {
    const container = document.querySelector('.products-container');
    container.innerHTML = '';
    products.forEach((product) => container.appendChild(renderProduct(product)));
};

const printCart = (cart) => {
    const cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = '';

    const total = cart.reduce((sum, item) => {
        const { itemContainer, total } = createCartItem(item);
        cartItems.appendChild(itemContainer);
        return sum + total;
    }, 0);

    document.querySelector('.cart-total').textContent = `Total: €${total}`;
};

const addToCart = (cart, id) => {
    const itemIndex = cart.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity++;
    } else {
        cart.push({ id, quantity: 1 });
    }

    const product = products.find((item) => item.id === id);
    if (product && product.stock > 0) product.stock--;

    selectFilter({ target: { value: inputName.value, name: 'name' } });
    printCart(cart);

    document.querySelector('.cart-container').classList.remove('hidden');
};

const removeFromCart = (id) => {
    const productToRemove = cart.find((item) => item.id === id);
    if (!productToRemove) return;

    cart = cart.filter((item) => item.id !== id);

    const product = products.find((item) => item.id === id);
    if (product) product.stock += productToRemove.quantity;

    selectFilter({ target: { value: inputName.value, name: 'name' } });
    printCart(cart);
};

const updateCartItem = (id, change) => {
    const productInCart = cart.find((item) => item.id === id);
    const product = products.find((item) => item.id === id);

    if (!productInCart || !product) return;

    if (change > 0 && product.stock > 0) {
        productInCart.quantity++;
        product.stock--;
    } else if (change < 0) {
        productInCart.quantity--;
        product.stock++;
        if (productInCart.quantity <= 0) {
            cart = cart.filter((item) => item.id !== id);
        }
    }

    selectFilter({ target: { value: inputName.value, name: 'name' } });
    printCart(cart);
};

const emptyCart = (cart) => {
    if (!cart.length) {
        return createAlert(
            '<i class="fa-solid fa-circle-info"></i>',
            'El carrito ya está vacio!!',
            '',
            'info'
        );
    }

    cart.forEach((product) => removeFromCart(product.id));
    cart = [];
    localStorage.removeItem('cart');
    printCart(cart);
};

const buyCart = (cart) => {
    if (!cart.length) {
        return createAlert(
            '<i class="fa-solid fa-circle-exclamation"></i>',
            'El carrito está vacío!!',
            'Agrega productos antes de comprar!',
            'error'
        );
    }

    const total = cart.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.id);
        return sum + product.price * item.quantity;
    }, 0);

    createAlert(
        '<i class="fa-solid fa-circle-check"></i>',
        'Gracias por su compra!!!',
        `Total a pagar: €${total}`,
        'success'
    );

    cart.splice(0, cart.length);
    localStorage.removeItem('cart');
    printCart(cart);
};

const checkStock = (btn, textContent = '', stock) => {
    if (!stock) {
        btn.textContent = textContent;
        btn.disabled = true;
        btn.classList.add('no-stock');
    }
};

const selectFilter = (e) => {
    const valueName = inputName.value;
    const value = e.target.value;
    const nameInput = e.target.name;

    if (nameInput === 'brand') brand = value;

    const filtered = products
        .filter((item) => item.name.toLowerCase().includes(valueName.toLowerCase()))
        .filter((item) => brand === 'all' || item.brand === brand);

    renderAllProducts(filtered);
};
