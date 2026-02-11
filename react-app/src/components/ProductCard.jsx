import React from 'react';
import { useNavigate } from 'react-router-dom';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
            <img src={product.image} className="product-img" alt={product.name} />
            <div className="product-info">
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{product.name}</div>
                <div className="price" style={{ fontSize: '0.9rem' }}>{formatPrice(product.price)}</div>
            </div>
        </div>
    );
};

export default ProductCard;
