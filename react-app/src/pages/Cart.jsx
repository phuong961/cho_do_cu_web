import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const Cart = () => {
    const { cart, setCheckoutItem } = useAppContext();
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();

    // Select first item by default if available
    useEffect(() => {
        if (cart.length > 0 && !selectedId) {
            setSelectedId(cart[0].id);
        }
    }, [cart, selectedId]);

    const handleCheckout = () => {
        const item = cart.find(p => p.id === selectedId);
        if (item) {
            setCheckoutItem(item);
            navigate('/checkout');
        }
    };

    const selectedItem = cart.find(p => p.id === selectedId);
    const totalPrice = selectedItem ? selectedItem.price * selectedItem.quantity : 0;

    return (
        <div className="app-container">
            <Navbar title="Giỏ hàng của bạn" />

            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                {cart.length === 0 ? (
                    <div className="text-center mt-3" style={{ color: 'var(--text-light)' }}>
                        Giỏ hàng của bạn đang trống
                    </div>
                ) : (
                    cart.map((item, index) => (
                        <div key={item.id} className="cart-item">
                            <div style={{ marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    name="cartItem"
                                    checked={selectedId === item.id}
                                    onChange={() => setSelectedId(item.id)}
                                    style={{ transform: 'scale(1.2)' }}
                                />
                            </div>
                            <img src={item.image} className="cart-img" alt={item.name} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{item.name}</div>
                                <div className="price" style={{ fontSize: '0.9rem' }}>{formatPrice(item.price)}</div>
                            </div>
                            <div className="qty-controls">
                                <span style={{ fontWeight: 600 }}>Số lượng: {item.quantity}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--white)', borderTop: '1px solid #eee', marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(totalPrice)}</span>
                </div>
                <button
                    className="btn"
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || !selectedId}
                >
                    Đặt đơn hàng
                </button>
            </div>
        </div>
    );
};

export default Cart;
