let cart = [];
let brand = 'all';

loadCart();
renderAllProducts(products);

// Filtros
const inputName = document.querySelector('.search-bar');
const selectBrand = document.querySelector('#brand');
inputName.addEventListener('input', selectFilter);
selectBrand.addEventListener('change', selectFilter);

// Mostrar/Ocultar carrito y alertas
document.querySelector('.cart-icon').addEventListener('click', () => toggleDisplay('.cart-container'));
document.querySelector('.close-cart').addEventListener('click', () => toggleDisplay('.cart-container'));
document.querySelector('.close-alert').addEventListener('click', () => toggleDisplay('.alert'));

// Menú responsive
document.querySelector('.toggle-menu').addEventListener('click', (e) => {
    toggleDisplay('.inputs');
    changeToggleMenuIcon(e);
});

// Botones del carrito
document.querySelector('.empty-btn').addEventListener('click', () => emptyCart(cart));
document.querySelector('.buy-btn').addEventListener('click', () => buyCart(cart));
