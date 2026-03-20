import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, cart, refreshProducts, checkAuth } = useAppContext();

    React.useEffect(() => {
        refreshProducts();
    }, []);

    // Find product
    const product = products.find(p => p.id == id);

    if (!product) {
        return <div className="app-container" style={{ padding: '2rem' }}>Sản phẩm không tồn tại. <button onClick={() => navigate('/')}>Về trang chủ</button></div>;
    }

    const isInCart = cart.some(item => item.id === product.id);

    const images = product.images || [product.image];
    const [mainImg, setMainImg] = useState(images[0]);

    const handleBuyNow = () => {
        checkAuth(() => {
            if (isInCart) {
                navigate('/cart');
                return;
            }
            addToCart(product);
            setTimeout(() => navigate('/cart'), 100); // Small delay to let state update
        });
    };

    return (
        <div className="app-container">
            <Navbar title="Chi tiết sản phẩm" />

            <div className="detail-container">
                {/* Left: Gallery */}
                <div className="gallery-container">
                    <img className="main-image" src={mainImg} alt="Main Product" />
                    <div className="thumbnail-row">
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                className={`thumb ${mainImg === img ? 'active' : ''}`}
                                onClick={() => setMainImg(img)}
                                alt="Thumb"
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="info-container">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{product.name}</h2>
                    <div className="mb-2">
                        <span className="price" style={{ fontSize: '1.5rem', marginRight: '1rem' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </span>
                        <span style={{ color: 'var(--text-light)', background: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>
                            Đã sử dụng: {product.usage || "N/A"}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                        <button
                            className="btn"
                            style={{ flex: 1, backgroundColor: isInCart ? '#95a5a6' : 'var(--primary-color)' }}
                            onClick={handleBuyNow}
                        >
                            {isInCart ? 'Xem trong giỏ' : 'Mua ngay'}
                        </button>
                        <button
                            className="btn btn-secondary"
                            style={{ flex: 1, opacity: isInCart ? 0.5 : 1, cursor: isInCart ? 'not-allowed' : 'pointer' }}
                            onClick={() => !isInCart && checkAuth(() => addToCart(product))}
                            disabled={isInCart}
                        >
                            {isInCart ? 'Đã trong giỏ' : 'Thêm vào giỏ'}
                        </button>
                    </div>

                    <h3 style={{ fontSize: '1.1rem' }}>Thông tin chi tiết</h3>
                    <table className="spec-table mb-2">
                        <tbody>
                            <tr><td>Danh mục</td><td>{product.category || "Khác"}</td></tr>
                            <tr><td>Hãng</td><td>{product.brand || "Khác"}</td></tr>
                            <tr><td>Tình trạng</td><td>{product.condition || "N/A"}</td></tr>
                            <tr><td>Xuất xứ</td><td>{product.origin || "N/A"}</td></tr>
                        </tbody>
                    </table>

                    <h3 style={{ fontSize: '1.1rem' }}>Mô tả sản phẩm</h3>
                    <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>{product.desc}</p>

                    <div className="detail-row">
                        <span className="detail-label">Khu vực:</span>
                        <span className="detail-value">{product.city || 'Chưa cập nhật'}</span>
                    </div>

                    <div className="seller-section">
                        <div className="seller-header">
                            <div>
                                <div style={{ fontWeight: 600 }}>Người bán: {product.seller || "Ẩn danh"}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>SĐT: {product.phone || "Liên hệ qua chat"}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Địa chỉ: {product.address || "N/A"}</div>
                            </div>
                            <button className="btn" style={{ width: 'auto', padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => alert('Chat functionality mocked')}>
                                Chat ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
