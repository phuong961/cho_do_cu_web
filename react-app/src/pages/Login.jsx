import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Login = () => {
    const { login, register } = useAppContext();
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);

    // Form States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [city, setCity] = useState('Hồ Chí Minh');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isRegister) {
            const result = await register({ username, password, name, city, address, phone });
            if (result.success) {
                navigate('/');
            } else {
                alert(result.message || 'Đăng ký thất bại!');
            }
        } else {
            const success = await login(username, password);
            if (success) {
                navigate('/');
            } else {
                alert('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        }
    };

    return (
        <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', background: '#f5f6fa' }}>
            <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h1 className="text-center mb-2" style={{ color: 'var(--primary-color)' }}>Chợ Đồ Cũ</h1>
                <h2 className="text-center mb-2" style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>
                    {isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Tên đăng nhập"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Mật khẩu"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {isRegister && (
                        <>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Họ và tên"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="tel"
                                    className="input-field"
                                    placeholder="Số điện thoại"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
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
                                <textarea
                                    className="input-field"
                                    placeholder="Địa chỉ chi tiết"
                                    required
                                    style={{ height: '80px', paddingTop: '10px' }}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn mb-2">
                        {isRegister ? 'Đăng ký' : 'Đăng nhập'}
                    </button>

                    <div className="text-center" style={{ fontSize: '0.9rem' }}>
                        {!isRegister ? (
                            <>
                                <a href="#" onClick={(e) => { e.preventDefault(); alert("Mock: Forgot Password"); }}>Quên mật khẩu?</a>
                                <span style={{ margin: '0 10px', color: '#ccc' }}>|</span>
                                <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(true); }}>Đăng ký ngay</a>
                            </>
                        ) : (
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(false); }}>Đã có tài khoản? Đăng nhập</a>
                        )}
                    </div>

                    {!isRegister && (
                        <div className="text-center mt-2" style={{ fontSize: '0.8rem', color: '#999' }}>
                            TK: User / MK: 123456
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
