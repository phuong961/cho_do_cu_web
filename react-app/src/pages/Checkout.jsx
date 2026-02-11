import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const Checkout = () => {
    const { checkoutItem, addOrder, purchaseCheckoutItem, currentUser } = useAppContext();
    const navigate = useNavigate();

    // State for shipping info
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [city, setCity] = React.useState('Hồ Chí Minh');
    const [address, setAddress] = React.useState('');

    useEffect(() => {
        if (!checkoutItem) {
            alert('Vui lòng chọn sản phẩm để thanh toán!');
            navigate('/cart');
        }

        // Auto-fill from current user
        if (currentUser) {
            setName(currentUser.name || '');
            setPhone(currentUser.phone || '');
            setCity(currentUser.city || 'Hồ Chí Minh');
            setAddress(currentUser.address || '');
        }
    }, [checkoutItem, navigate, currentUser]);

    if (!checkoutItem) return null;

    const subtotal = checkoutItem.price * checkoutItem.quantity;

    const handleConfirm = async () => {
        if (!name || !phone || !city || !address) {
            alert('Vui lòng điền đầy đủ thông tin vận chuyển!');
            return;
        }

        if (window.confirm('Xác nhận đặt hàng?')) {
            const orderData = {
                userId: currentUser?.id,
                items: [{
                    id: checkoutItem.id,
                    name: checkoutItem.name,
                    price: checkoutItem.price,
                    quantity: checkoutItem.quantity,
                    image: checkoutItem.image
                }],
                total: subtotal,
                shippingInfo: {
                    name: name,
                    phone: phone,
                    city: city,
                    address: address
                }
            };

            await addOrder(orderData);
            purchaseCheckoutItem();
            alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
            navigate('/my-orders');
        }
    };

    return (
        <div className="app-container">
            <div className="navbar">
                <span onClick={() => navigate('/cart')} style={{ fontSize: '1.5rem', color: 'var(--text-color)', cursor: 'pointer' }}>←</span>
                <h1>Thanh toán</h1>
                <div style={{ width: '24px' }}></div>
            </div>

            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <h3 className="mb-2">Thông tin vận chuyển</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '0.9rem' }}>Tên người nhận</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Nhập tên người nhận"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '0.9rem' }}>Số điện thoại</label>
                        <input
                            type="tel"
                            className="input-field"
                            placeholder="Nhập số điện thoại"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '0.9rem' }}>Thành phố</label>
                        <select
                            className="input-field"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        >
                            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                            <option value="Hà Nội">Hà Nội</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '0.9rem' }}>Địa chỉ giao hàng</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Nhập địa chỉ chi tiết"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </form>

                <h3 className="mt-3 mb-2">Tóm tắt đơn hàng</h3>
                <div style={{ background: 'var(--white)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
                    {/* Product Info */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                        <img src={checkoutItem.image} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} alt="Thumb" />
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{checkoutItem.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>x{checkoutItem.quantity}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-light)' }}>Tổng tiền hàng</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-light)' }}>Phí vận chuyển</span>
                        <span style={{ color: '#27ae60' }}>Miễn phí</span>
                    </div>
                    <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #eee' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                        <span>Tổng thanh toán</span>
                        <span style={{ color: 'var(--primary-color)' }}>{formatPrice(subtotal)}</span>
                    </div>
                </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--white)' }}>
                <button className="btn" onClick={handleConfirm}>Xác nhận đặt hàng</button>
            </div>
        </div>
    );
};

export default Checkout;
