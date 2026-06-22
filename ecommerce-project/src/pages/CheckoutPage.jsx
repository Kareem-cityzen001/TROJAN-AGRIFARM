import { useEffect } from 'react';
import axios from 'axios';
import {formatMoney} from '../utils/money.js';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../../starting-code/data/products.js';
import deliveryOptions from '../../starting-code/backend/deliveryOptions.json';
import { useCart } from '../context/CartContext.jsx';
import './CheckoutPage.css';
import './checkout-header.css';

function formatCurrency(cents) {
    return `$${(cents / 100).toFixed(2)}`;
}

function formatDeliveryDate(deliveryDays) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    }).format(deliveryDate);
}

export function CheckoutPage() {
    const navigate = useNavigate();
    const {
        cartItems,
        updateCartItemQuantity,
        updateCartItemDeliveryOption,
        removeCartItem,
        clearCart,
    } = useCart();

    useEffect(() => {
        document.title = 'Checkout';
    }, []);

    const cartProducts = cartItems.map((cartItem) => {
        const product = products.find((currentProduct) => currentProduct.id === cartItem.productId);
        const deliveryOption = deliveryOptions.find((option) => option.id === cartItem.deliveryOptionId) || deliveryOptions[0];

        return {
            ...cartItem,
            product,
            deliveryOption,
        };
    }).filter((cartItem) => cartItem.product);

    const paymentSummary = cartProducts.reduce(
        (summary, cartItem) => {
            const productTotalCents = cartItem.product.priceCents * cartItem.quantity;
            const shippingCents = cartItem.deliveryOption.priceCents * cartItem.quantity;

            return {
                itemsTotalCents: summary.itemsTotalCents + productTotalCents,
                shippingTotalCents: summary.shippingTotalCents + shippingCents,
            };
        },
        { itemsTotalCents: 0, shippingTotalCents: 0 }
    );

    const subtotalCents = paymentSummary.itemsTotalCents + paymentSummary.shippingTotalCents;
    const taxCents = Math.round(subtotalCents * 0.1);
    const totalCents = subtotalCents + taxCents;

    async function handlePlaceOrder() {
        if (cartProducts.length === 0) {
            return;
        }

        await axios.post('/api/orders');
        await clearCart();
        navigate('/orders');
    }

    return (
        <>
            <div className="checkout-header">
                <div className="header-content">
                    <div className="checkout-header-left-section">
                        <Link to="/">
                            <img className="logo" src="/images/logo.png" />
                            <img className="mobile-logo" src="/images/mobile-logo.png" />
                        </Link>
                    </div>

                    <div className="checkout-header-middle-section">
                        Checkout (<Link className="return-to-home-link" to="/">{cartItems.reduce((total, item) => total + item.quantity, 0)} items</Link>)
                    </div>

                    <div className="checkout-header-right-section">
                        <img src="/images/icons/checkout-lock-icon.png" />
                    </div>
                </div>
            </div>

            <div className="checkout-page">
                <div className="page-title">Review your order</div>

                <div className="checkout-grid">
                    <div className="order-summary">
                        {cartProducts.length === 0 ? (
                            <div className="cart-item-container">
                                <div className="page-title">Your cart is empty.</div>
                                <Link className="link-primary" to="/">Go back to shopping</Link>
                            </div>
                        ) : (
                            cartProducts.map((cartItem) => (
                                <div className="cart-item-container" key={cartItem.productId}>
                                    <div className="delivery-date">
                                        Delivery date: {formatDeliveryDate(cartItem.deliveryOption.deliveryDays)}
                                    </div>

                                    <div className="cart-item-details-grid">
                                        <img className="product-image" src={`/${cartItem.product.image}`} />

                                        <div className="cart-item-details">
                                            <div className="product-name">{cartItem.product.name}</div>
                                            <div className="product-price">{formatMoney(cartItem.product.priceCents)}</div>
                                            <div className="product-quantity">
                                                <span>
                                                    Quantity:{' '}
                                                    <select
                                                        value={cartItem.quantity}
                                                        onChange={(event) => updateCartItemQuantity(
                                                            cartItem.productId,
                                                            Number(event.target.value)
                                                        )}
                                                    >
                                                        {Array.from({ length: 10 }, (_, index) => index + 1).map((optionValue) => (
                                                            <option key={optionValue} value={optionValue}>
                                                                {optionValue}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </span>
                                                <span className="update-quantity-link link-primary">Update</span>
                                                <span
                                                    className="delete-quantity-link link-primary"
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => removeCartItem(cartItem.productId)}
                                                    onKeyDown={(event) => {
                                                        if (event.key === 'Enter' || event.key === ' ') {
                                                            removeCartItem(cartItem.productId);
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </span>
                                            </div>
                                        </div>

                                        <div className="delivery-options">
                                            <div className="delivery-options-title">Choose a delivery option:</div>

                                            {deliveryOptions.map((deliveryOption) => (
                                                <label className="delivery-option" key={deliveryOption.id}>
                                                    <input
                                                        type="radio"
                                                        className="delivery-option-input"
                                                        name={`delivery-option-${cartItem.productId}`}
                                                        checked={deliveryOption.id === cartItem.deliveryOptionId}
                                                        onChange={() => updateCartItemDeliveryOption(
                                                            cartItem.productId,
                                                            deliveryOption.id
                                                        )}
                                                    />
                                                    <div>
                                                        <div className="delivery-option-date">
                                                            {formatDeliveryDate(deliveryOption.deliveryDays)}
                                                        </div>
                                                        <div className="delivery-option-price">
                                                            {deliveryOption.priceCents === 0
                                                                ? 'FREE Shipping'
                                                                : `${formatCurrency(deliveryOption.priceCents)} - Shipping`}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="payment-summary">
                        <div className="payment-summary-title">Payment Summary</div>

                        <div className="payment-summary-row">
                            <div>Items ({cartItems.reduce((total, item) => total + item.quantity, 0)}):</div>
                            <div className="payment-summary-money">{formatCurrency(paymentSummary.itemsTotalCents)}</div>
                        </div>

                        <div className="payment-summary-row">
                            <div>Shipping &amp; handling:</div>
                            <div className="payment-summary-money">{formatCurrency(paymentSummary.shippingTotalCents)}</div>
                        </div>

                        <div className="payment-summary-row subtotal-row">
                            <div>Total before tax:</div>
                            <div className="payment-summary-money">{formatCurrency(subtotalCents)}</div>
                        </div>

                        <div className="payment-summary-row">
                            <div>Estimated tax (10%):</div>
                            <div className="payment-summary-money">{formatCurrency(taxCents)}</div>
                        </div>

                        <div className="payment-summary-row total-row">
                            <div>Order total:</div>
                            <div className="payment-summary-money">{formatCurrency(totalCents)}</div>
                        </div>

                        <button className="place-order-button button-primary" onClick={handlePlaceOrder}>
                            Place your order
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}