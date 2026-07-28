import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '../utils/money.js';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext.jsx';
import rating0 from '../components/images/ratings/rating-0.png';
import rating5 from '../components/images/ratings/rating-5.png';
import rating10 from '../components/images/ratings/rating-10.png';
import rating15 from '../components/images/ratings/rating-15.png';
import rating20 from '../components/images/ratings/rating-20.png';
import rating25 from '../components/images/ratings/rating-25.png';
import rating30 from '../components/images/ratings/rating-30.png';
import rating35 from '../components/images/ratings/rating-35.png';
import rating40 from '../components/images/ratings/rating-40.png';
import rating45 from '../components/images/ratings/rating-45.png';
import rating50 from '../components/images/ratings/rating-50.png';
import './HomePage.css';

const ratingImages = {
    0: rating0,
    5: rating5,
    10: rating10,
    15: rating15,
    20: rating20,
    25: rating25,
    30: rating30,
    35: rating35,
    40: rating40,
    45: rating45,
    50: rating50,
};

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

    const starsImage = ratingImages[Math.round(product.rating.stars * 10)] || rating0;

    return (
        <div className="product-container">
            <div className="product-image-container">
                <img className="product-image" src={`/${product.image}`} />
            </div>

            <div className="product-name limit-text-to-2-lines">
                {product.name}
            </div>

            <div className="product-rating-container">
                <img className="product-rating-stars" src={starsImage} alt="Product rating" />
                <div className="product-rating-count link-primary">
                    {product.rating.count}
                </div>
            </div>

            <div className="product-price">
                {formatMoney(product.priceCents)}
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

export function HomePage() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        setLoadError('');

        axios.get('/api/products')
            .then((response) => {
                setProducts(response.data);
            })
            .catch(() => {
                setProducts([]);
                setLoadError('Unable to load medicines right now.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const filteredProducts = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) {
            return products;
        }

        return products.filter((product) => {
            const nameMatches = product.name.toLowerCase().includes(query);
            const keywords = product.keywords || [];
            const keywordMatches = keywords.some((keyword) => keyword.toLowerCase().includes(query));
            return nameMatches || keywordMatches;
        });
    }, [products, searchTerm]);

    return (
        <>
            <Header
                showSearch
                searchTerm={searchTerm}
                onSearchChange={(event) => setSearchTerm(event.target.value)}
            />

            <div className="home-page">
                {isLoading ? (
                    <div className="home-page__status">Loading medicines…</div>
                ) : loadError ? (
                    <div className="home-page__status error-message">{loadError}</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="home-page__status">No medicines match your search.</div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}