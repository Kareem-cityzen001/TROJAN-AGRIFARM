import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import cartIcon from './images/icons/cart-icon.png';
import searchIcon from './images/icons/search-icon.png';

import './header.css';

export function Header({ showSearch = false, searchTerm = '', onSearchChange = () => {} }) {
    const { cartQuantity } = useCart();

    return (
        <div className="header">
            <div className="left-section">
                <Link to="/" className="header-link brand-link">
                    <img className="logo"
                        src="/images/logo-white.png" />
                    <img className="mobile-logo"
                        src="/images/mobile-logo-white.png" />
                    <span className="brand-name">TROJAN AGRIFARM</span>
                </Link>
            </div>

            {showSearch && (
                <div className="middle-section">
                    <input
                        className="search-bar"
                        type="search"
                        placeholder="Search medicines"
                        value={searchTerm}
                        onChange={onSearchChange}
                        aria-label="Search medicines"
                    />

                    <button className="search-button" type="button" aria-label="Search">
                        <img className="search-icon" src={searchIcon} alt="Search icon" />
                    </button>
                </div>
            )}

            <div className="right-section">
                <Link className="orders-link header-link" to="/orders">
                    <span className="orders-text">Orders</span>
                </Link>

                <Link className="cart-link header-link" to="/checkout">
                    <img className="cart-icon" src={cartIcon} alt="Cart icon" />
                    <div className="cart-quantity">{cartQuantity}</div>
                    <div className="cart-text">Cart</div>
                </Link>
            </div>
        </div>
    );
}

Header.propTypes = {
    showSearch: PropTypes.bool,
    searchTerm: PropTypes.string,
    onSearchChange: PropTypes.func,
};