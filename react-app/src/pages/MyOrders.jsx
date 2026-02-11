import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const MyOrders = () => {
    const { purchasedOrders, currentUser } = useAppContext();
    const [currentTab, setCurrentTab] = useState('purchased');
    const navigate = useNavigate();

    // Redirect if not logged in
    if (!currentUser) {
        navigate('/login');
        return null;
    }

    const orders = currentTab === 'purchased' ? purchasedOrders : [];

    return (
        <div className="app-container">
            <div className="navbar">
                <span onClick={() => navigate('/')} style={{ fontSize: '1.5rem', color: 'var(--text-color)', cursor: 'pointer' }}>←</span>
                <h1>Đơn hàng của tôi</h1>
                <div style={{ width: '24px' }}></div>
            </div>

            <div className="tabs">
                <div className={`tab-item ${currentTab === 'purchased' ? 'active' : ''}`} onClick={() => setCurrentTab('purchased')}>
                    Đơn hàng đã mua
                </div>
                <div className={`tab-item ${currentTab === 'sold' ? 'active' : ''}`} onClick={() => setCurrentTab('sold')}>
                    Đơn hàng bán
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-light)' }}>
                        Không có đơn hàng nào
                    </div>
                ) : (
                    orders.map(order => {
                        const firstItem = order.items[0];
                        const count = order.items.length;
                        const otherCountStr = count > 1 ? ` (+${count - 1} sản phẩm khác)` : '';

                        return (
                            <div
                                key={order.id}
                                className="order-card"
                                onClick={() => navigate(`/order/${order.id}`)}
                                style={{
                                    background: 'white',
                                    padding: '1rem',
                                    marginBottom: '1rem',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    gap: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <img
                                    src={firstItem.image || '/assets/no-image.png'}
                                    alt={firstItem.name}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Mã ĐH: #{order.id}</span>
                                        <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{formatPrice(order.total)}</span>
                                    </div>
                                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{firstItem.name} {otherCountStr}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '4px' }}>Số lượng: {firstItem.quantity}</div>

                                    <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
                                        <div><strong>Người nhận:</strong> {order.shippingInfo?.name}</div>
                                        <div><strong>Thành phố:</strong> {order.shippingInfo?.city}</div>
                                        <div><strong>Địa chỉ:</strong> {order.shippingInfo?.address}</div>
                                        <div><strong>SĐT:</strong> {order.shippingInfo?.phone}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyOrders;
