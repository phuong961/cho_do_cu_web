import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

const CATEGORIES = [
    "Tất cả", "Quần áo", "Máy tính", "Đồ điện tử", "Đồ gia dụng", "Đồ nhà bếp - ăn uống",
    "Thiết bị nhà tắm", "Trang sức", "Đồng hồ", "Đồ cổ", "Khác"
];

const Home = () => {
    const { products, currentUser, refreshProducts, logout, checkAuth } = useAppContext();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");

    React.useEffect(() => {
        refreshProducts();
    }, []);

    const filteredProducts = selectedCategory === "Tất cả"
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <div className="app-container">
            <Navbar title="Chợ Đồ Cũ" />

            {/* Banner/Actions */}
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Xin chào, {currentUser?.name || currentUser?.username || 'Khách'}</h2>
                    {currentUser && (
                        <button
                            onClick={logout}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'red',
                                padding: 0,
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                textDecoration: 'underline'
                            }}
                        >
                            Đăng xuất
                        </button>
                    )}
                    <p style={{ color: 'var(--text-light)' }}>Bạn muốn tìm gì hôm nay?</p>
                </div>
                <div
                    onClick={() => checkAuth(() => navigate('/post-product'))}
                    className="btn"
                    style={{ width: 'auto', padding: '10px 20px', cursor: 'pointer' }}
                >
                    + Đăng tin
                </div>
            </div>

            {/* Categories */}
            <div style={{ padding: '0 1rem', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            background: selectedCategory === cat ? 'var(--primary-color)' : '#fff',
                            color: selectedCategory === cat ? '#fff' : 'var(--text-color)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="product-grid">
                {filteredProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>

            <div
                onClick={() => checkAuth(() => navigate('/my-orders'))}
                style={{
                    position: 'fixed', bottom: '20px', right: '20px',
                    background: 'var(--primary-color)', color: 'white',
                    padding: '12px 20px', borderRadius: '30px',
                    boxShadow: 'var(--shadow)', fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                Đơn hàng của tôi
            </div>
        </div>
    );
};

export default Home;
