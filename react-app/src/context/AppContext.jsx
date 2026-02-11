import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // Persistent State
    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch { return []; }
    });

    const [purchasedOrders, setPurchasedOrders] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('purchasedOrders')) || [];
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

    const fetchOrders = async () => {
        if (!currentUser) {
            setPurchasedOrders([]);
            return;
        }
        try {
            const res = await fetch(`/api/orders?userId=${currentUser.id}`, { cache: 'no-store' });
            const data = await res.json();
            setPurchasedOrders(data);
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
    useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
    useEffect(() => localStorage.setItem('purchasedOrders', JSON.stringify(purchasedOrders)), [purchasedOrders]);
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
        alert('Đã thêm vào giỏ hàng!');
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

    return (
        <AppContext.Provider value={{
            products,
            cart, addToCart, removeFromCart, updateQuantity,
            purchasedOrders, addOrder,
            currentUser, login, register, logout,
            checkoutItem, setCheckoutItem, purchaseCheckoutItem,
            refreshProducts
        }}>
            {children}
        </AppContext.Provider>
    );
};
