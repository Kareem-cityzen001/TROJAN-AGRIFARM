import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatMoney } from '../utils/money.js';
import './OrdersPage.css';

export function OrdersPage() {
    const { addToCart } = useCart();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        document.title = 'Orders | TROJAN AGRIFARM';

        setIsLoading(true);
        setLoadError('');

        axios.get('/api/orders?expand=products')
            .then((response) => {
                setOrders(response.data);
            })
            .catch(() => {
                setOrders([]);
                setLoadError('Unable to load your orders.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <>
         <Header />
         <div className="orders-page">
            <div className="page-title">Your orders</div>

            {isLoading ? (
                <div className="order-container">
                    <div className="order-header">
                        <div className="order-header-left-section">
                            <div className="order-date">Loading your orders…</div>
                        </div>
                    </div>
                </div>
            ) : loadError ? (
                <div className="order-container">
                    <div className="order-header">
                        <div className="order-header-left-section">
                            <div className="order-date error-message">{loadError}</div>
                        </div>
                    </div>
                </div>
            ) : orders.length === 0 ? (
                <div className="order-container">
                    <div className="order-header">
                        <div className="order-header-left-section">
                            <div className="order-date">No orders yet.</div>
                        </div>
                    </div>
                </div>
            ) : orders.map((order) => (
                <div className="order-container" key={order.id}>
                    <div className="order-header">
                        <div className="order-header-left-section">
                            <div className="order-date">
                                Order placed: {new Date(order.orderTimeMs).toLocaleDateString('en-KE', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </div>
                            {order.phoneNumber && (
                                <div className="order-phone">Paid from: {order.phoneNumber}</div>
                            )}
                            <div className="order-total">Total: {formatMoney(order.totalCostCents)}</div>
                        </div>

                        <div className="order-header-right-section">
                            <Link className="track-package-link link-primary" to={`/tracking?orderId=${order.id}`}>
                                Track package
                            </Link>
                        </div>
                    </div>

                    {order.products.map((orderProduct) => {
                        const product = orderProduct.product;

                        if (!product) {
                            return null;
                        }

                        return (
                            <div className="order-details-grid" key={orderProduct.productId}>
                                <div className="product-image-container">
                                    <img src={`/${product.image}`} alt={product.name} />
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