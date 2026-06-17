import { createContext, useContext, useEffect, useState } from 'react';

const CART_STORAGE_KEY = 'ecommerce-project-cart';

const CartContext = createContext(null);

function readStoredCart() {
    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);

        return storedCart ? JSON.parse(storedCart) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(readStoredCart);

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    function addToCart(productId, quantity, deliveryOptionId = '1') {
        setCartItems((currentCartItems) => {
            const existingItem = currentCartItems.find((item) => item.productId === productId);

            if (existingItem) {
                return currentCartItems.map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...currentCartItems, { productId, quantity, deliveryOptionId }];
        });
    }

    function updateCartItemQuantity(productId, quantity) {
        setCartItems((currentCartItems) =>
            currentCartItems
                .map((item) =>
                    item.productId === productId ? { ...item, quantity } : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function updateCartItemDeliveryOption(productId, deliveryOptionId) {
        setCartItems((currentCartItems) =>
            currentCartItems.map((item) =>
                item.productId === productId ? { ...item, deliveryOptionId } : item
            )
        );
    }

    function removeCartItem(productId) {
        setCartItems((currentCartItems) =>
            currentCartItems.filter((item) => item.productId !== productId)
        );
    }

    function clearCart() {
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

export function useCart() {
    const cartContext = useContext(CartContext);

    if (!cartContext) {
        throw new Error('useCart must be used inside CartProvider');
    }

    return cartContext;
}