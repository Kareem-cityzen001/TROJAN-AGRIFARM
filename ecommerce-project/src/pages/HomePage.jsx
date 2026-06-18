import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext.jsx';
import './HomePage.css';

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAddedToCartVisible, setIsAddedToCartVisible] = useState(false);

    useEffect(() => {
        if (!isAddedToCartVisible) {
            return undefined;
        }

        const timeoutId = setTimeout(() => {
            setIsAddedToCartVisible(false);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [isAddedToCartVisible]);

    function handleAddToCart() {
        addToCart(product.id, quantity);
        setIsAddedToCartVisible(true);
    }

    const starsImage = `/images/ratings/rating-${Math.round(product.rating.stars * 10)}.png`;

    return (
        <div className="product-container">
            <div className="product-image-container">
                <img className="product-image" src={`/${product.image}`} />
            </div>

            <div className="product-name limit-text-to-2-lines">
                {product.name}
            </div>

            <div className="product-rating-container">
                <img className="product-rating-stars" src={starsImage} />
                <div className="product-rating-count link-primary">
                    {product.rating.count}
                </div>
            </div>

            <div className="product-price">
                ${(product.priceCents / 100).toFixed(2)}
            </div>

            <div className="product-quantity-container">
                <select
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>

            <div className="product-spacer"></div>

            <div className="added-to-cart" style={{ opacity: isAddedToCartVisible ? 1 : 0 }}>
                <img src="/images/icons/checkmark.png" />
                Added
            </div>

            <button className="add-to-cart-button button-primary" onClick={handleAddToCart}>
                Add to Cart
            </button>
        </div>
    );
}

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        priceCents: PropTypes.number.isRequired,
        rating: PropTypes.shape({
            stars: PropTypes.number.isRequired,
            count: PropTypes.number.isRequired,
        }).isRequired,
    }).isRequired,
};

export function HomePage( { cart } ) {
    const [products, setProducts] = useState([]);
    
    
    useEffect(() => {
        axios.get('/api/products')
                .then((response) => {
                    setProducts(response.data);
                });


    },[]);
    
    

    return (
        <>
            <Header cart={cart} />

            <div className="home-page">
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </>
    );
}