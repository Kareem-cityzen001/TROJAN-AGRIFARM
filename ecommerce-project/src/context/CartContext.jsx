import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    async function loadCartItems() {
        const response = await axios.get('/api/cart-items?expand=product');
        setCartItems(response.data);
    }

    useEffect(() => {
        loadCartItems();
    }, []);

    async function addToCart(productId, quantity, deliveryOptionId = '1') {
        await axios.post('/api/cart-items', { productId, quantity, deliveryOptionId });
        await loadCartItems();
    }

    async function updateCartItemQuantity(productId, quantity) {
        await axios.put(`/api/cart-items/${productId}`, { quantity });
        await loadCartItems();
    }

    async function updateCartItemDeliveryOption(productId, deliveryOptionId) {
        await axios.put(`/api/cart-items/${productId}`, { deliveryOptionId });
        await loadCartItems();
    }

    async function removeCartItem(productId) {
        await axios.delete(`/api/cart-items/${productId}`);
        await loadCartItems();
    }

    async function clearCart() {
        setCartItems([]);
    }

    const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartQuantity,
                addToCart,
                updateCartItemQuantity,
                updateCartItemDeliveryOption,
                removeCartItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useCart() {
    const cartContext = useContext(CartContext);

    if (!cartContext) {
        throw new Error('useCart must be used inside CartProvider');
    }

    return cartContext;
}