import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppContext';

const PostProduct = () => {
    const { currentUser, refreshProducts } = useAppContext();
    const navigate = useNavigate();
    const [selectedImages, setSelectedImages] = useState([]);
    const [desc, setDesc] = useState('');
    const [categories, setCategories] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '', // This will store category_id
        usage: '',
        brand: '',
        condition: '',
        city: '',
        address: 'N/A', // Mock address default
        phone: 'N/A'    // Mock phone default
    });

    React.useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();

        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                city: currentUser.city || '',
                address: currentUser.address || '',
                phone: currentUser.phone || ''
            }));
        }
    }, [currentUser]);

    if (!currentUser) {
        return <div className="app-container" style={{ padding: '2rem' }}>Vui lòng đăng nhập. <button onClick={() => navigate('/login')}>Đăng nhập</button></div>;
    }

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const remainingSlots = 4 - selectedImages.length;
        if (files.length > remainingSlots) {
            alert(`Bạn chỉ có thể chọn thêm ${remainingSlots} hình ảnh.`);
        }
        const filesToAdd = files.slice(0, remainingSlots);

        filesToAdd.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImages(prev => [...prev, e.target.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedImages.length === 0) {
            alert("Vui lòng chọn ít nhất 1 hình ảnh sản phẩm");
            return;
        }

        const price = parseFloat(formData.price);
        if (isNaN(price) || price < 0) {
            alert("Giá bán không hợp lệ. Vui lòng nhập số lớn hơn hoặc bằng 0.");
            return;
        }
        if (!Number.isInteger(price)) {
            alert("Vui lòng nhập giá bán là số nguyên (không có số thập phân).");
            return;
        }

        const submitData = {
            ...formData,
            desc: desc,
            price: price,
            image: selectedImages[0],
            images: selectedImages,
            seller: currentUser.name || "User",
            user_id: currentUser.id // Add user_id specific for backend lookup
        };

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
                cache: 'no-store'
            });

            if (res.ok) {
                refreshProducts();
                setShowSuccessModal(true);
            } else {
                alert("Có lỗi xảy ra khi đăng tin.");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi kết nối server.");
        }
    };

    return (
        <div className="app-container">
            <div className="navbar">
                <span onClick={() => navigate('/')} style={{ fontSize: '1.5rem', color: 'var(--text-color)', cursor: 'pointer' }}>←</span>
                <h1 style={{ fontSize: '1.2rem', margin: '0' }}>Đăng sản phẩm</h1>
                <div style={{ width: '24px' }}></div>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    {/* Images */}
                    <div className="form-section">
                        <label className="form-label">Hình ảnh sản phẩm (Tối đa 4 hình)</label>
                        <div className="image-upload-area">
                            {selectedImages.map((imgSrc, index) => (
                                <div key={index} className="image-box has-image">
                                    <img src={imgSrc} alt="Preview" />
                                    <div className="remove-img" onClick={() => removeImage(index)}>×</div>
                                </div>
                            ))}
                            {selectedImages.length < 4 && (
                                <div className="image-box" onClick={() => document.getElementById('image-upload').click()}>
                                    <span className="upload-icon">+</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleImageSelect}
                        />
                        <div className="note">* Hình ảnh được upload đầu tiên sẽ được dùng để làm ảnh đại diện của sản phẩm</div>
                    </div>

                    {/* Product Info */}
                    <div className="form-section">
                        <div className="input-group">
                            <label className="form-label">Tên sản phẩm</label>
                            <input
                                type="text"
                                name="name"
                                className="input-field"
                                required
                                placeholder="Nhập tên sản phẩm..."
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label className="form-label">Giá bán (VNĐ)</label>
                            <input
                                type="number"
                                name="price"
                                className="input-field"
                                required
                                placeholder="Nhập giá bán..."
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        <div className="input-group">
                            <label className="form-label">Danh mục sản phẩm</label>
                            <select
                                name="category"
                                className="input-field"
                                required
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="form-label">Đã sử dụng</label>
                            <select
                                name="usage"
                                className="input-field"
                                required
                                value={formData.usage}
                                onChange={handleChange}
                            >
                                <option value="">Thời gian sử dụng</option>
                                {["Dưới 1 năm", "1 năm", "2 năm", "3 năm", "4 năm", "5 năm", "6 năm", "7 năm", "8 năm", "9 năm", "10 năm", "Trên 10 năm"].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="form-label">Hãng</label>
                            <input
                                type="text"
                                name="brand"
                                className="input-field"
                                placeholder="Nhập tên hãng..."
                                value={formData.brand}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label className="form-label">Tình trạng</label>
                            <select
                                name="condition"
                                className="input-field"
                                required
                                value={formData.condition}
                                onChange={handleChange}
                            >
                                <option value="">Chọn tình trạng</option>
                                {["Còn mới", "Đã hao tổn nhẹ", "Đã hư hỏng", "Đồ cổ"].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>




                        <div className="input-group">
                            <label className="form-label">Mô tả chi tiết</label>
                            <textarea
                                className="input-field"
                                rows="8"
                                maxLength="1000"
                                placeholder="Mô tả sản phẩm của bạn (tối đa 1000 ký tự)..."
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            ></textarea>
                            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#999', marginTop: '4px' }}>{desc.length}/1000</div>
                        </div>
                    </div>

                    <button type="submit" className="btn mb-2">Đăng bán</button>
                </form>
            </div>

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
                        boxShadow: 'var(--shadow)'
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
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-color)' }}>Đăng tin thành công!</h2>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: '1.5' }}>
                            Bạn đã đăng tin sản phẩm thành công, cám ơn đã sử dụng Chợ Đồ Cũ
                        </p>
                        <button
                            className="btn"
                            onClick={() => navigate('/')}
                            style={{ backgroundColor: 'var(--primary-color)' }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostProduct;
