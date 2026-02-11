// Data Mock
const products = [
    // Quần áo
    {
        id: 1,
        name: "Áo khoác vintage",
        price: 350000,
        image: "https://placehold.co/600x600/ff6b6b/ffffff?text=Coat+1",
        images: ["https://placehold.co/600x600/ff6b6b/ffffff?text=Coat+1"],
        desc: "Áo khoác vintage tình trạng 95%",
        category: "Quần áo",
        usage: "2 năm", brand: "Uniqlo", condition: "Đã hao tổn nhẹ", origin: "Nhật Bản", seller: "Nguyễn Văn A", address: "Hà Nội", phone: "0912 345 678"
    },
    {
        id: 102,
        name: "Quần Jean Levis",
        price: 500000,
        image: "https://placehold.co/600x600/ff9f43/ffffff?text=Jean+1",
        images: ["https://placehold.co/600x600/ff9f43/ffffff?text=Jean+1"],
        desc: "Quần Jean nam size 32, màu xanh đậm",
        category: "Quần áo",
        usage: "Dưới 1 năm", brand: "Levis", condition: "Còn mới", origin: "Mỹ", seller: "Trần B", address: "HCM", phone: "0909 000 111"
    },

    // Máy tính
    {
        id: 3,
        name: "Laptop Dell XPS",
        price: 15000000,
        image: "https://placehold.co/600x600/1dd1a1/ffffff?text=Laptop+1",
        images: ["https://placehold.co/600x600/1dd1a1/ffffff?text=Laptop+1"],
        desc: "Laptop Dell XPS 13 inch, core i7",
        category: "Máy tính",
        usage: "1 năm", brand: "Dell", condition: "Còn mới", origin: "Mỹ", seller: "Lê C", address: "Đà Nẵng", phone: "0905 123 456"
    },
    {
        id: 302,
        name: "MacBook Air M1",
        price: 18000000,
        image: "https://placehold.co/600x600/cacaca/000000?text=Macbook",
        images: ["https://placehold.co/600x600/cacaca/000000?text=Macbook"],
        desc: "MacBook Air M1 2020, ram 8gb, ssd 256gb",
        category: "Máy tính",
        usage: "2 năm", brand: "Apple", condition: "Tốt", origin: "Mỹ", seller: "Phạm D", address: "Hải Phòng", phone: "0321 654 987"
    },

    // Đồ điện tử
    {
        id: 4,
        name: "Tai nghe Sony WH-1000XM4",
        price: 3500000,
        image: "https://placehold.co/600x600/5f27cd/ffffff?text=Headphone+1",
        images: ["https://placehold.co/600x600/5f27cd/ffffff?text=Headphone+1"],
        desc: "Tai nghe chống ồn đỉnh cao",
        category: "Đồ điện tử",
        usage: "1 năm", brand: "Sony", condition: "Còn mới", origin: "Malaysia", seller: "Hoàng E", address: "Cần Thơ", phone: "0999 888 777"
    },
    {
        id: 402,
        name: "Loa Bluetooth JBL",
        price: 900000,
        image: "https://placehold.co/600x600/ff6b6b/ffffff?text=Speaker",
        images: ["https://placehold.co/600x600/ff6b6b/ffffff?text=Speaker"],
        desc: "Loa JBL Flip 5 âm thanh sống động",
        category: "Đồ điện tử",
        usage: "2 năm", brand: "JBL", condition: "Xước nhẹ", origin: "Trung Quốc", seller: "Vũ F", address: "Hà Nội", phone: "0911 222 333"
    },

    // Đồ gia dụng
    {
        id: 501,
        name: "Máy hút bụi cầm tay",
        price: 800000,
        image: "https://placehold.co/600x600/54a0ff/ffffff?text=Vacuum",
        images: ["https://placehold.co/600x600/54a0ff/ffffff?text=Vacuum"],
        desc: "Máy hút bụi Xiaomi lực hút mạnh",
        category: "Đồ gia dụng",
        usage: "Dưới 1 năm", brand: "Xiaomi", condition: "Như mới", origin: "Trung Quốc", seller: "Ngô G", address: "HCM", phone: "0933 444 555"
    },
    {
        id: 502,
        name: "Quạt cây Panasonic",
        price: 500000,
        image: "https://placehold.co/600x600/10ac84/ffffff?text=Fan",
        images: ["https://placehold.co/600x600/10ac84/ffffff?text=Fan"],
        desc: "Quạt chạy êm, gió mạnh",
        category: "Đồ gia dụng",
        usage: "3 năm", brand: "Panasonic", condition: "Cũ", origin: "Việt Nam", seller: "Trịnh H", address: "Huế", phone: "0944 555 666"
    },

    // Đồ nhà bếp - ăn uống
    {
        id: 601,
        name: "Bộ nồi Sunhouse",
        price: 400000,
        image: "https://placehold.co/600x600/ff9ff3/ffffff?text=Pot",
        images: ["https://placehold.co/600x600/ff9ff3/ffffff?text=Pot"],
        desc: "Bộ 3 nồi inox 3 đáy",
        category: "Đồ nhà bếp - ăn uống",
        usage: "Dưới 1 năm", brand: "Sunhouse", condition: "Mới 100%", origin: "Việt Nam", seller: "Lý I", address: "Nghệ An", phone: "0955 666 777"
    },
    {
        id: 602,
        name: "Máy xay sinh tố",
        price: 300000,
        image: "https://placehold.co/600x600/feca57/ffffff?text=Blender",
        images: ["https://placehold.co/600x600/feca57/ffffff?text=Blender"],
        desc: "Máy xay Philips gọn nhẹ",
        category: "Đồ nhà bếp - ăn uống",
        usage: "1 năm", brand: "Philips", condition: "Tốt", origin: "Hà Lan", seller: "Bùi K", address: "Hà Nội", phone: "0966 777 888"
    },

    // Thiết bị nhà tắm
    {
        id: 701,
        name: "Vòi sen tăng áp",
        price: 150000,
        image: "https://placehold.co/600x600/00d2d3/ffffff?text=Shower",
        images: ["https://placehold.co/600x600/00d2d3/ffffff?text=Shower"],
        desc: "Vòi sen lọc nước, tăng áp lực nước",
        category: "Thiết bị nhà tắm",
        usage: "Dưới 1 năm", brand: "No Brand", condition: "Mới", origin: "Trung Quốc", seller: "Đỗ L", address: "HCM", phone: "0977 888 999"
    },
    {
        id: 702,
        name: "Gương phòng tắm",
        price: 200000,
        image: "https://placehold.co/600x600/c8d6e5/000000?text=Mirror",
        images: ["https://placehold.co/600x600/c8d6e5/000000?text=Mirror"],
        desc: "Gương tròn dây da sang trọng",
        category: "Thiết bị nhà tắm",
        usage: "1 năm", brand: "Decor", condition: "Tốt", origin: "Việt Nam", seller: "Hồ M", address: "Đà Nẵng", phone: "0988 999 000"
    },

    // Trang sức
    {
        id: 801,
        name: "Dây chuyền bạc",
        price: 450000,
        image: "https://placehold.co/600x600/8395a7/ffffff?text=Necklace",
        images: ["https://placehold.co/600x600/8395a7/ffffff?text=Necklace"],
        desc: "Dây chuyền bạc 925 mặt cỏ 4 lá",
        category: "Trang sức",
        usage: "1 tháng", brand: "PNJ", condition: "Như mới", origin: "Việt Nam", seller: "Dương N", address: "Hà Nội", phone: "0912 333 444"
    },
    {
        id: 802,
        name: "Nhẫn đôi",
        price: 300000,
        image: "https://placehold.co/600x600/ffcccc/000000?text=Ring",
        images: ["https://placehold.co/600x600/ffcccc/000000?text=Ring"],
        desc: "Nhẫn đôi titan không gỉ",
        category: "Trang sức",
        usage: "Mới", brand: "Local Brand", condition: "Mới 100%", origin: "Việt Nam", seller: "Mai O", address: "HCM", phone: "0923 444 555"
    },

    // Đồng hồ
    {
        id: 901,
        name: "Đồng hồ Casio",
        price: 700000,
        image: "https://placehold.co/600x600/222f3e/ffffff?text=Watch",
        images: ["https://placehold.co/600x600/222f3e/ffffff?text=Watch"],
        desc: "Casio điện tử cổ điển, pin 10 năm",
        category: "Đồng hồ",
        usage: "2 năm", brand: "Casio", condition: "Xước dăm", origin: "Nhật Bản", seller: "Cao P", address: "Cần Thơ", phone: "0934 555 666"
    },
    {
        id: 902,
        name: "Apple Watch Series 5",
        price: 3500000,
        image: "https://placehold.co/600x600/000000/ffffff?text=SmartWatch",
        images: ["https://placehold.co/600x600/000000/ffffff?text=SmartWatch"],
        desc: "Apple Watch bản thép, dây milanese",
        category: "Đồng hồ",
        usage: "3 năm", brand: "Apple", condition: "Cũ", origin: "Mỹ", seller: "Đặng Q", address: "Hà Nội", phone: "0945 666 777"
    },

    // Đồ cổ
    {
        id: 1001,
        name: "Bình gốm Chu Đậu",
        price: 2500000,
        image: "https://placehold.co/600x600/cd6133/ffffff?text=Vase",
        images: ["https://placehold.co/600x600/cd6133/ffffff?text=Vase"],
        desc: "Bình gốm vẽ tay hoa sen",
        category: "Đồ cổ",
        usage: "10 năm", brand: "Gốm Chu Đậu", condition: "Nguyên vẹn", origin: "Việt Nam", seller: "Bùi R", address: "Hải Dương", phone: "0956 777 888"
    },
    {
        id: 1002,
        name: "Tiền xu cổ",
        price: 500000,
        image: "https://placehold.co/600x600/d1ccc0/000000?text=Coin",
        images: ["https://placehold.co/600x600/d1ccc0/000000?text=Coin"],
        desc: "Bộ sưu tập tiền xu thời bao cấp",
        category: "Đồ cổ",
        usage: "N/A", brand: "N/A", condition: "Cũ", origin: "Việt Nam", seller: "Lương S", address: "Nam Định", phone: "0967 888 999"
    },

    // Khác
    {
        id: 1101,
        name: "Sách Harry Potter",
        price: 150000,
        image: "https://placehold.co/600x600/ffb8b8/000000?text=Book",
        images: ["https://placehold.co/600x600/ffb8b8/000000?text=Book"],
        desc: "Trọn bộ 7 cuốn bìa mềm",
        category: "Khác",
        usage: "Đã đọc 1 lần", brand: "NXB Trẻ", condition: "Mới", origin: "Việt Nam", seller: "Phan T", address: "HCM", phone: "0978 999 000"
    },
    {
        id: 1102,
        name: "Đàn Guitar Acoustic",
        price: 1200000,
        image: "https://placehold.co/600x600/ff9f1a/ffffff?text=Guitar",
        images: ["https://placehold.co/600x600/ff9f1a/ffffff?text=Guitar"],
        desc: "Đàn gỗ thông, âm vang",
        category: "Khác",
        usage: "1 năm", brand: "Ba Đờn", condition: "Tốt", origin: "Việt Nam", seller: "Vương U", address: "Hà Nội", phone: "0989 000 111"
    }
];

// State Management
const State = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    purchasedOrders: JSON.parse(localStorage.getItem('purchasedOrders')) || [],
    soldOrders: [
        {
            id: 'S001',
            total: 350000,
            buyerName: 'Trần Văn C',
            buyerAddress: 'Quận 5, TP.HCM',
            buyerPhone: '0909 123 456',
            items: [
                {
                    id: 1,
                    name: "Áo khoác vintage",
                    price: 350000,
                    image: "https://placehold.co/600x600/ff6b6b/ffffff?text=Coat+1",
                    quantity: 1,
                    seller: "Nguyễn Văn A",
                    address: "Cầu Giấy, Hà Nội",
                    phone: "0912 345 678"
                }
            ]
        },
        {
            id: 'S002',
            total: 1200000,
            buyerName: 'Lê Thị D',
            buyerAddress: 'Đống Đa, Hà Nội',
            buyerPhone: '0912 987 654',
            items: [
                {
                    id: 2,
                    name: "Bàn gỗ sồi",
                    price: 1200000,
                    image: "https://placehold.co/600x600/48dbfb/ffffff?text=Table+1",
                    quantity: 1,
                    seller: "Trần Thị B",
                    address: "Q.3, TP.HCM",
                    phone: "0987 654 321"
                }
            ]
        }
    ],
    currentUser: localStorage.getItem('currentUser') || null,

    login(username, password) {
        if (username === 'User' && password === '123456') {
            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            return true;
        }
        return false;
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    },

    addToCart(product) {
        const existing = this.cart.find(p => p.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        alert('Đã thêm vào giỏ hàng!');
    },

    removeFromCart(productId) {
        this.cart = this.cart.filter(p => p.id !== productId);
        this.saveCart();
    },

    updateQuantity(productId, change) {
        const product = this.cart.find(p => p.id === productId);
        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
            }
        }
    },

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    // New Checkout Logic
    checkoutItem: null, // Temporary state for selected item

    setCheckoutItem(item) {
        this.checkoutItem = item;
        localStorage.setItem('checkoutItem', JSON.stringify(item));
    },

    getCheckoutItem() {
        // Retrieve from state or storage (for page reload persistence)
        if (!this.checkoutItem) {
            this.checkoutItem = JSON.parse(localStorage.getItem('checkoutItem'));
        }
        return this.checkoutItem;
    },

    addOrder(order) {
        this.purchasedOrders.unshift(order);
        localStorage.setItem('purchasedOrders', JSON.stringify(this.purchasedOrders));
    },

    purchaseCheckoutItem() {
        const itemToBuy = this.getCheckoutItem();
        if (!itemToBuy) return;

        // Remove ONLY the bought item from cart
        this.removeFromCart(itemToBuy.id);

        // Clear temporary checkout state
        this.checkoutItem = null;
        localStorage.removeItem('checkoutItem');
    },

    clearCart() {
        this.cart = [];
        this.saveCart();
    },

    getProduct(id) {
        return products.find(p => p.id == id);
    },

    getRelatedProducts(category, currentId) {
        // Simple mock: return products with same category (or standard ones if not enough) excluding current
        return products.filter(p => p.id != currentId).slice(0, 4);
    }
};

// Utils
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
