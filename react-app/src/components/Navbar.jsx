import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Navbar = ({ title }) => {
    const { cart } = useAppContext();
    const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

    return (
        <div className="navbar">
            <Link to="/" style={{ fontSize: '1.5rem', color: 'var(--text-color)' }}>←</Link>
            <h1>{title || 'Chợ Đồ Cũ'}</h1>
            <Link to="/cart" style={{ color: 'var(--text-color)' }}>
                🛒 <span style={{ background: 'red', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '50%' }}>
                    {cartCount}
                </span>
            </Link>
        </div>
    );
};

export default Navbar;
