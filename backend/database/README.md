# PostgreSQL Database Setup - Cho Đồ Cũ

## 📊 Database Information

- **Database Name**: `cho_do_cu_db`
- **User**: `postgres`
- **Host**: `localhost`
- **Port**: `5432`
- **PostgreSQL Version**: 18

## 🗂️ Database Schema

### Tables

#### 1. **users**
- `id` (UUID PRIMARY KEY DEFAULT uuid_generate_v4())
- `username` (VARCHAR(100) UNIQUE NOT NULL)
- `password` (VARCHAR(255) NOT NULL)
- `name` (VARCHAR(255) NOT NULL)
- `created_at` (TIMESTAMP)

#### 2. **products**
- `id` (UUID PRIMARY KEY DEFAULT uuid_generate_v4())
- `name` (VARCHAR(255) NOT NULL)
- `price` (INTEGER NOT NULL)
- `image` (TEXT)
- `description` (TEXT)
- `category` (VARCHAR(100))
- `usage` (VARCHAR(100))
- `brand` (VARCHAR(100))
- `condition` (VARCHAR(100))
- `origin` (VARCHAR(100))
- `seller` (VARCHAR(255))
- `address` (VARCHAR(255))
- `phone` (VARCHAR(20))
- `created_at` (TIMESTAMP)

#### 3. **orders**
- `id` (UUID PRIMARY KEY DEFAULT uuid_generate_v4())
- `user_id` (UUID REFERENCES users(id))
- `total` (INTEGER NOT NULL)
- `shipping_name` (VARCHAR(255))
- `shipping_phone` (VARCHAR(20))
- `shipping_address` (TEXT)
- `order_date` (TIMESTAMP)
- `status` (VARCHAR(50) DEFAULT 'pending')

#### 4. **order_items**
- `id` (UUID PRIMARY KEY DEFAULT uuid_generate_v4())
- `order_id` (UUID REFERENCES orders(id))
- `product_id` (UUID)
- `product_name` (VARCHAR(255))
- `price` (INTEGER)
- `quantity` (INTEGER)
- `created_at` (TIMESTAMP)

## 🚀 Quick Start

### 1. Create Database
```bash
psql -U postgres -c "CREATE DATABASE cho_do_cu_db;"
```

### 2. Run Schema
```bash
psql -U postgres -d cho_do_cu_db -f database/schema.sql
```

### 3. Migrate Data from JSON
```bash
node database/migrate.js
```

## 🔧 Useful Commands

### Connect to Database
```bash
psql -U postgres -d cho_do_cu_db
```

### View All Tables
```sql
\dt
```

### View Table Schema
```sql
\d users
\d products
\d orders
\d order_items
```

### Query Examples

#### Get all products
```sql
SELECT * FROM products;
```

#### Get products by category
```sql
SELECT * FROM products WHERE category = 'Quần áo';
```

#### Get user orders with items
```sql
SELECT o.*, oi.product_name, oi.quantity, oi.price
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = 1;
```

#### Count products by category
```sql
SELECT category, COUNT(*) as count
FROM products
GROUP BY category
ORDER BY count DESC;
```

## 📝 Database Statistics

After migration, you should have:
- **5 users**
- **21 products**
- **1 order**

## 🔐 Connection Configuration

The database connection is configured in `database/db.js`:

```javascript
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cho_do_cu_db',
    password: 'Phuong95@',
    port: 5432,
});
```

## ⚠️ Important Notes

1. **Password Security**: In production, use environment variables for sensitive data
2. **Backup**: Regularly backup your database
3. **Indexes**: The schema includes indexes on frequently queried columns
4. **Transactions**: Order creation uses transactions to ensure data consistency

## 🛠️ Maintenance

### Backup Database
```bash
pg_dump -U postgres cho_do_cu_db > backup.sql
```

### Restore Database
```bash
psql -U postgres cho_do_cu_db < backup.sql
```

### Reset Database
```bash
psql -U postgres -d cho_do_cu_db -c "DROP TABLE IF EXISTS order_items, orders, products, users CASCADE;"
psql -U postgres -d cho_do_cu_db -f database/schema.sql
node database/migrate.js
```

## 📚 API Endpoints

All API endpoints now use PostgreSQL:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/products` - Get all products (with optional category filter)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `GET /api/orders?userId=:id` - Get user orders
- `POST /api/orders` - Create new order
