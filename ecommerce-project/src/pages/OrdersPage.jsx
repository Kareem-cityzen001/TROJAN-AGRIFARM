import { useEffect } from 'react';
import { Header } from '../components/Header';
import { Link } from 'react-router-dom';
import orders from '../../starting-code/backend/orders.json';
import { products } from '../../starting-code/data/products.js';
import { useCart } from '../context/CartContext.jsx';
import './OrdersPage.css';

function formatCurrency(cents) {
    return `$${(cents / 100).toFixed(2)}`;
}

export function OrdersPage() {
    const { addToCart } = useCart();

    useEffect(() => {
        document.title = 'Orders';
    }, []);

    return (
        <>
         <Header />
         <div className="orders-page">
            <div className="page-title">Your orders</div>

            {orders.map((order) => (
                <div className="order-container" key={order.id}>
                    <div className="order-header">
                        <div className="order-header-left-section">
                            <div className="order-date">
                                Order placed: {new Date(order.orderTimeMs).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </div>
                            <div className="order-total">Total: {formatCurrency(order.totalCostCents)}</div>
                        </div>

                        <div className="order-header-right-section">
                            <Link className="track-package-link link-primary" to="/tracking">
                                Track package
                            </Link>
                        </div>
                    </div>

                    {order.products.map((orderProduct) => {
                        const product = products.find((currentProduct) => currentProduct.id === orderProduct.productId);

                        if (!product) {
                            return null;
                        }

                        return (
                            <div className="order-details-grid" key={orderProduct.productId}>
                                <div className="product-image-container">
                                    <img src={`/${product.image}`} />
                                </div>
                                <div>
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-delivery-date">Order quantity: {orderProduct.quantity}</div>
                                    <button
                                        type="button"
                                        className="button-primary buy-again-button"
                                        onClick={() => addToCart(product.id, orderProduct.quantity)}
                                    >
                                        Buy it again
                                    </button>
                                </div>

                                <div className="product-actions">
                                    <Link className="button-secondary track-package-button" to="/tracking">
                                        Track package
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
         </div>
         </>
    );
}