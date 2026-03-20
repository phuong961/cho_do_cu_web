import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // Persistent State
    const [cart, setCart] = useState(() => {
        try {
            const user = JSON.parse(localStorage.getItem('currentUser')) || null;
            const key = user ? `cart_${user.id}` : 'cart_guest';
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    });

    const [purchasedOrders, setPurchasedOrders] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('purchasedOrders')) || [];
        } catch { return []; }
    });

    const [soldOrders, setSoldOrders] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('soldOrders')) || [];
        } catch { return []; }
    });

    const [checkoutItem, setCheckoutItem] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('checkoutItem')) || null;
        } catch { return null; }
    });

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('currentUser')) || null;
        } catch { return null; }
    });

    const [products, setProducts] = useState([]);
    const [toast, setToast] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Fetch Products
    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products', { cache: 'no-store' });
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000); // Match animation duration
    };

    const fetchOrders = async () => {
        if (!currentUser) {
            setPurchasedOrders([]);
            setSoldOrders([]);
            return;
        }
        try {
            // Fetch purchased orders
            const resPurchased = await fetch(`/api/orders?userId=${currentUser.id}`, { cache: 'no-store' });
            const dataPurchased = await resPurchased.json();
            setPurchasedOrders(dataPurchased);

            // Fetch sold orders
            const resSold = await fetch(`/api/orders/sales?userId=${currentUser.id}`, { cache: 'no-store' });
            const dataSold = await resSold.json();
            setSoldOrders(dataSold);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [currentUser]);

    // Effects for persistence
    useEffect(() => {
        const key = currentUser ? `cart_${currentUser.id}` : 'cart_guest';
        localStorage.setItem(key, JSON.stringify(cart));
    }, [cart]);

    // Load cart when current user changes (login/logout)
    useEffect(() => {
        const userKey = currentUser ? `cart_${currentUser.id}` : 'cart_guest';
        try {
            const guestCart = JSON.parse(localStorage.getItem('cart_guest')) || [];
            const userCart = currentUser ? (JSON.parse(localStorage.getItem(userKey)) || []) : guestCart;

            if (currentUser && guestCart.length > 0) {
                // Merge guest cart into user cart during login
                const mergedMap = new Map();
                userCart.forEach(item => mergedMap.set(item.id, item));
                guestCart.forEach(item => {
                    if (mergedMap.has(item.id)) {
                        const existing = mergedMap.get(item.id);
                        mergedMap.set(item.id, { ...existing, quantity: existing.quantity + item.quantity });
                    } else {
                        mergedMap.set(item.id, item);
                    }
                });
                const merged = Array.from(mergedMap.values());
                setCart(merged);
                localStorage.removeItem('cart_guest'); // Clear guest cart after migration
            } else {
                setCart(userCart);
            }
        } catch (err) {
            console.error("Cart load error:", err);
            setCart([]);
        }
    }, [currentUser]);

    useEffect(() => localStorage.setItem('purchasedOrders', JSON.stringify(purchasedOrders)), [purchasedOrders]);
    useEffect(() => localStorage.setItem('soldOrders', JSON.stringify(soldOrders)), [soldOrders]);
    useEffect(() => {
        if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
        else localStorage.removeItem('currentUser');
    }, [currentUser]);
    useEffect(() => {
        if (checkoutItem) localStorage.setItem('checkoutItem', JSON.stringify(checkoutItem));
        else localStorage.removeItem('checkoutItem');
    }, [checkoutItem]);

    // Actions
    const login = async (username, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                cache: 'no-store'
            });
            const data = await res.json();
            if (data.success) {
                setCurrentUser(data.user);
                return true;
            }
            return false;
        } catch (err) {
            console.error("Login error:", err);
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
                cache: 'no-store'
            });
            const data = await res.json();
            if (data.success) {
                setCurrentUser(data.user);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (err) {
            console.error("Register error:", err);
            return { success: false, message: "Server error" };
        }
    };

    const logout = () => setCurrentUser(null);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        showToast('Thêm vào giỏ hàng thành công');
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(p => p.id !== id));
    };

    const updateQuantity = (id, change) => {
        setCart(prev => {
            return prev.map(p => {
                if (p.id === id) {
                    return { ...p, quantity: Math.max(1, p.quantity + change) };
                }
                return p;
            });
        });
    };

    const addOrder = async (order) => {
        // Optimistic UI update
        setPurchasedOrders(prev => [order, ...prev]);

        // Sync with backend
        try {
            await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
                cache: 'no-store'
            });
            // Refresh orders to get the newly created sale orders as well
            fetchOrders();
        } catch (err) {
            console.error("Failed to save order:", err);
        }
    };

    const purchaseCheckoutItem = () => {
        if (!checkoutItem) return;
        removeFromCart(checkoutItem.id);
        setCheckoutItem(null);
    };

    const refreshProducts = () => {
        fetchProducts();
    };

    const checkAuth = (action) => {
        if (!currentUser) {
            setShowAuthModal(true);
            return false;
        }
        if (action) action();
        return true;
    };

    return (
        <AppContext.Provider value={{
            products,
            cart, addToCart, removeFromCart, updateQuantity,
            purchasedOrders, soldOrders, addOrder,
            currentUser, login, register, logout,
            checkoutItem, setCheckoutItem, purchaseCheckoutItem,
            refreshProducts, showToast, checkAuth
        }}>
            {children}
            {toast && (
                <div className="toast-container">
                    <div className="toast">{toast}</div>
                </div>
            )}
            {showAuthModal && (
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
                    zIndex: 10000,
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
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Yêu cầu đăng nhập</h2>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: '1.5' }}>
                            Bạn chưa đăng nhập, bạn có muốn đăng nhập để sử dụng chức năng này ?
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowAuthModal(false)}
                                style={{ flex: 1 }}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                className="btn"
                                onClick={() => {
                                    setShowAuthModal(false);
                                    window.location.href = '/login';
                                }}
                                style={{ flex: 1 }}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppContext.Provider>
    );
};
