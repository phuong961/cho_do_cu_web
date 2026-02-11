const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.set('etag', false);
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const categoriesRoutes = require('./routes/categories');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoriesRoutes);

app.get('/', (req, res) => {
    res.send('Cho Do Cu Backend API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n=================================`);
    console.log(`Server running on port ${PORT}`);
    console.log(`=================================\n`);

    console.log('--- Implemented Endpoints ---');

    function print(path, layer) {
        if (layer.route) {
            layer.route.stack.forEach(print.bind(null, path + layer.route.path))
        } else if (layer.name === 'router' && layer.handle.stack) {
            let routerPath = layer.regexp.source
                .replace('\\/?(?=\\/|$)', '')
                .replace('^\\/', '')
                .replace('\\/', '/')
                .replace('^', '');

            // Clean up regex artifacts for display
            if (routerPath.endsWith('/')) routerPath = routerPath.slice(0, -1);
            if (!routerPath.startsWith('/') && routerPath.length > 0) routerPath = '/' + routerPath;

            layer.handle.stack.forEach(print.bind(null, path + routerPath))
        } else if (layer.method) {
            console.log('%s %s', layer.method.toUpperCase().padEnd(7), path)
        }
    }

    app._router.stack.forEach(print.bind(null, ''))
    console.log('-----------------------------\n');
});
