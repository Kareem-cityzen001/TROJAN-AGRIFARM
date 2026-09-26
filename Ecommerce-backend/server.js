import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';
import productRoutes from './routes/products.js';
import deliveryOptionRoutes from './routes/deliveryOptions.js';
import cartItemRoutes from './routes/cartItems.js';
import orderRoutes from './routes/orders.js';
import resetRoutes from './routes/reset.js';
import paymentSummaryRoutes from './routes/paymentSummary.js';
import { Product } from './models/Product.js';
import { DeliveryOption } from './models/DeliveryOption.js';
import { CartItem } from './models/CartItem.js';
import { Order } from './models/Order.js';
import { defaultProducts } from './defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from './defaultData/defaultDeliveryOptions.js';
import { defaultCart } from './defaultData/defaultCart.js';
import { defaultOrders } from './defaultData/defaultOrders.js';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ FIXED: Point to frontend folder (lowercase - matches GitHub)
const frontendRoot = path.join(__dirname, '..', 'ecommerce-project');
const frontendBuildPath = path.join(frontendRoot, 'dist');

// Middleware
app.use(cors());
app.use(express.json());

// Serve storefront images and public assets from the frontend app
app.use('/images', express.static(path.join(frontendRoot, 'public', 'images')));
app.use(express.static(path.join(frontendRoot, 'public')));

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/delivery-options', deliveryOptionRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/payment-summary', paymentSummaryRoutes);

// ✅ FIXED: Serve the FRONTEND's build folder, not the backend's
app.use(express.static(frontendBuildPath));

// ✅ FIXED: Catch-all route to serve index.html for React Router
app.get('*', (req, res) => {
  const indexPath = path.join(frontendBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(
      'index.html not found — did you run "npm run build" in ecommerce-project and commit the dist folder?'
    );
  }
});

// Error handling middleware
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
/* eslint-enable no-unused-vars */

// Sync database and load default data
await sequelize.sync({ force: true });

const timestamp = Date.now();

const productsWithTimestamps = defaultProducts.map((product, index) => ({
  ...product,
  createdAt: new Date(timestamp + index),
  updatedAt: new Date(timestamp + index)
}));

const deliveryOptionsWithTimestamps = defaultDeliveryOptions.map((option, index) => ({
  ...option,
  createdAt: new Date(timestamp + index),
  updatedAt: new Date(timestamp + index)
}));

const cartItemsWithTimestamps = defaultCart.map((item, index) => ({
  ...item,
  createdAt: new Date(timestamp + index),
  updatedAt: new Date(timestamp + index)
}));

const ordersWithTimestamps = defaultOrders.map((order, index) => ({
  ...order,
  createdAt: new Date(timestamp + index),
  updatedAt: new Date(timestamp + index)
}));

await Product.bulkCreate(productsWithTimestamps);
await DeliveryOption.bulkCreate(deliveryOptionsWithTimestamps);
await CartItem.bulkCreate(cartItemsWithTimestamps);
await Order.bulkCreate(ordersWithTimestamps);

console.log('Default data loaded into the database.');

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});