import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { purchasedOrders, soldOrders } = useAppContext();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const foundOrder = purchasedOrders.find(o => o.id === orderId) || soldOrders.find(o => o.id === orderId);
        if (foundOrder) {
            setOrder(foundOrder);
        } else {
            alert('Không tìm thấy đơn hàng!');
            navigate('/my-orders');
        }
    }, [orderId, purchasedOrders, soldOrders, navigate]);

    if (!order) return null;

    const firstItem = order.items[0];

    return (
        <div className="app-container">
            <div className="navbar">
                <span onClick={() => navigate('/my-orders')} style={{ fontSize: '1.5rem', color: 'var(--text-color)', cursor: 'pointer' }}>←</span>
                <h1>Chi tiết đơn hàng</h1>
                <div style={{ width: '24px' }}></div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                {/* Order Info */}
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                        Mã đơn hàng: <strong>#{order.id}</strong>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                        Trạng thái: <span style={{ color: '#f39c12', fontWeight: 'bold' }}>{order.status || 'Pending'}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN')}
                    </div>
                </div>

                {/* Product Items */}
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Sản phẩm</h3>
                    {order.items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none' }}>
                            <img
                                src={item.image || '/assets/no-image.png'}
                                alt={item.name}
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.name}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                                    Số lượng: {item.quantity}
                                </div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                    {formatPrice(item.price)}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold' }}>
                            <span>Tổng cộng:</span>
                            <span style={{ color: 'var(--primary-color)' }}>{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Buyer Info */}
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Thông tin người mua</h3>
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                        <div><strong>Tên:</strong> {order.shippingInfo?.name}</div>
                        <div><strong>Số điện thoại:</strong> {order.shippingInfo?.phone}</div>
                        <div><strong>Thành phố:</strong> {order.shippingInfo?.city}</div>
                        <div><strong>Địa chỉ:</strong> {order.shippingInfo?.address}</div>
                    </div>
                </div>

                {/* Seller Info */}
                {firstItem && (
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Thông tin người bán</h3>
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                            <div><strong>Tên:</strong> {firstItem.seller || 'N/A'}</div>
                            <div><strong>Số điện thoại:</strong> {firstItem.sellerPhone || 'N/A'}</div>
                            <div><strong>Thành phố:</strong> {firstItem.sellerCity || 'N/A'}</div>
                            <div><strong>Địa chỉ:</strong> {firstItem.sellerAddress || 'N/A'}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetail;
