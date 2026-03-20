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
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [orderSuccess, setOrderSuccess] = React.useState(false);

    useEffect(() => {
        if (!checkoutItem && !orderSuccess) {
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
    }, [checkoutItem, navigate, currentUser, orderSuccess]);

    if (!checkoutItem && !orderSuccess) return null;

    // Use a fallback to prevent crash when checkoutItem is cleared after success
    const subtotal = checkoutItem ? (checkoutItem.price * checkoutItem.quantity) : 0;

    const handleConfirm = () => {
        if (!name || !phone || !city || !address) {
            alert('Vui lòng điền đầy đủ thông tin vận chuyển!');
            return;
        }
        setShowConfirmModal(true);
    };

    const handleFinalConfirm = async () => {
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

        try {
            await addOrder(orderData);
            setOrderSuccess(true);
            purchaseCheckoutItem();
            setShowConfirmModal(false);
            setShowSuccessModal(true);
        } catch (err) {
            alert("Có lỗi xảy ra khi đặt hàng.");
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/my-orders');
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
                        <img src={checkoutItem?.image} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} alt="Thumb" />
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{checkoutItem?.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>x{checkoutItem?.quantity}</div>
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

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '16px',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow)'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Xác nhận đặt hàng</h2>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Bạn có chắc chắn muốn đặt sản phẩm?</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowConfirmModal(false)}
                                style={{ flex: 1 }}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                className="btn"
                                onClick={handleFinalConfirm}
                                style={{ flex: 1 }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '16px',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#e7f9ed',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            fontSize: '30px',
                            color: '#27ae60'
                        }}>
                            ✓
                        </div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-color)' }}>Đặt hàng thành công!</h2>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: '1.5' }}>
                            Bạn đã đặt hàng thành công, cám ơn bạn đã sử dụng Chợ Đồ Cũ
                        </p>
                        <button
                            className="btn"
                            onClick={handleModalClose}
                            style={{ backgroundColor: 'var(--primary-color)' }}
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
