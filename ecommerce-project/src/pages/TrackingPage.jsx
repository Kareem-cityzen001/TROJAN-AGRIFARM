import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Header } from '../components/Header';
import './TrackingPage.css';

export function TrackingPage() {
  const { cartQuantity } = useCart();
  const [order, setOrder] = useState(null);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    document.title = 'Tracking | TROJAN AGRIFARM';

    axios.get('/api/orders?expand=products')
      .then((response) => {
        const orders = response.data || [];
        const selectedOrder = orderId
          ? orders.find((item) => item.id === orderId)
          : orders[0];

        setOrder(selectedOrder || orders[0] || null);
      })
      .catch(() => {
        setOrder(null);
      });
  }, [orderId]);

  const orderProduct = order?.products?.[0];
  const product = orderProduct?.product;
  const estimatedDeliveryMs = orderProduct?.estimatedDeliveryTimeMs;
  const isDelivered = estimatedDeliveryMs && estimatedDeliveryMs <= Date.now();
  const statusLabels = ['Preparing', 'Shipped', 'Delivered'];
  const currentStatusIndex = isDelivered ? 2 : (orderProduct ? 1 : 0);
  const progressWidth = ((currentStatusIndex + 1) / statusLabels.length) * 100;

  return (
    <>
      <Header />

      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">
            {order ? (
              estimatedDeliveryMs
                ? `Arriving on ${new Date(estimatedDeliveryMs).toLocaleDateString('en-KE', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}`
                : 'Arriving soon'
            ) : (
              'Tracking details unavailable'
            )}
          </div>

          <div className="product-info">
            {product?.name ?? 'Order item'}
          </div>

          <div className="product-info">
            Quantity: {orderProduct?.quantity ?? 1}
          </div>

          <img
            className="product-image"
            src={product ? `/${product.image}` : '/images/products/medicines/oxytetracycline%20LA.jpg'}
            alt={product?.name ?? 'Product image'}
          />

          <div className="progress-labels-container">
            {statusLabels.map((label, index) => (
              <div
                key={label}
                className={`progress-label ${index === currentStatusIndex ? 'current-status' : ''}`}
              >
                {label}
              </div>
            ))}
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressWidth}%` }}></div>
          </div>
        </div>
      </div>
    </>
  );
}
