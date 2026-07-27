import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './TrackingPage.css';
import '../components/header.css';

function formatDeliveryDate(deliveryDays) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    }).format(deliveryDate);
}

export function TrackingPage() {
  const { cartQuantity } = useCart();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    document.title = 'Tracking';

    axios.get('/api/orders?expand=products')
      .then((response) => {
        setOrder(response.data[0] || null);
      })
      .catch(() => {
        setOrder(null);
      });
  }, []);

  const orderProduct = order?.products?.[0];
  const product = orderProduct?.product;

    return (
        <>
    <div className="header">
      <div className="left-section">
        <Link to="/" className="header-link">
          <img className="logo"
            src="/images/logo-white.png" />
          <img className="mobile-logo"
            src="/images/mobile-logo-white.png" />
        </Link>
      </div>

      <div className="middle-section">
        <input className="search-bar" type="text" placeholder="Search" />

        <button className="search-button">
          <img className="search-icon" src="/images/icons/search-icon.png" />
        </button>
      </div>

      <div className="right-section">
        <Link className="orders-link header-link" to="/orders">

          <span className="orders-text">Orders</span>
        </Link>

        <Link className="cart-link header-link" to="/checkout">
          <img className="cart-icon" src="/images/icons/cart-icon.png" />
          <div className="cart-quantity">{cartQuantity}</div>
          <div className="cart-text">Cart</div>
        </Link>
      </div>
    </div>

    <div className="tracking-page">
      <div className="order-tracking">
        <Link className="back-to-orders-link link-primary" to="/orders">
          View all orders
        </Link>

        <div className="delivery-date">
          {orderProduct?.estimatedDeliveryTimeMs
            ? `Arriving on ${new Date(orderProduct.estimatedDeliveryTimeMs).toLocaleDateString('en-KE', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}`
            : 'Arriving soon'}
        </div>

        <div className="product-info">
          {product?.name ?? 'Order item'}
        </div>

        <div className="product-info">
          Quantity: {orderProduct?.quantity ?? 1}
        </div>

        <img className="product-image" src={product ? `/${product.image}` : '/images/products/medicines/oxytetracycline%20LA.jpg'} />

        <div className="progress-labels-container">
          <div className="progress-label">
            Preparing
          </div>
          <div className="progress-label current-status">
            Shipped
          </div>
          <div className="progress-label">
            Delivered
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
    </>
    );
}