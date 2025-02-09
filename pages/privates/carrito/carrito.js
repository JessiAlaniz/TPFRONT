import { SellProduct } from "../../../api/venta.api.js";
import { productRow } from "../../../components/carritoComponents/productCarrito.js";
import { totalRow } from "../../../components/carritoComponents/totalCarrito.js";


document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let suma = 0;
    let productos = [];
    const updateQuantity = (id, increment) => {
        if (cart[id]) {
            if (increment) {
                cart[id].quantity++;
            } else if (cart[id].quantity > 1) {
                cart[id].quantity--;
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
        }
    };
    

    const renderCartItems = () => {
        cartItemsContainer.innerHTML = '';
        suma = 0;
        productos = [];

        for (const id in cart) {
            const product = cart[id];
            let precioTotalProducto = parseFloat(product.price) * product.quantity;
            suma += precioTotalProducto;

            productos.push({id: product.id, cantidad: product.quantity});
            const productC = productRow(id,product.image,product.name,product.quantity,precioTotalProducto);

            cartItemsContainer.insertAdjacentHTML('beforeend', productC);
        }

        const total = totalRow(suma);
        cartItemsContainer.insertAdjacentHTML('beforeend', total);

        document.querySelectorAll('.increment-btn').forEach(button => {
            button.addEventListener('click', () => updateQuantity(button.getAttribute('data-id'), true));
        });
        document.querySelectorAll('.decrement-btn').forEach(button => {
            button.addEventListener('click', () => updateQuantity(button.getAttribute('data-id'), false));
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                delete cart[productId];
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
            });
        });
    };

    renderCartItems();

    document.getElementById('checkout-btn').addEventListener('click', async () => {
        console.log(suma);
        const fecha = new Date();
        const id = sessionStorage.getItem('userId');
        const email = sessionStorage.getItem('email');

        if (productos.length > 0) {
            await SellProduct(id, fecha, suma, email, productos);
            localStorage.removeItem('cart');
            cart = {};
            renderCartItems();
            alert('Compra realizada con éxito');
        } else {
            alert('No hay productos en el carrito');
        }
    });
});            
  