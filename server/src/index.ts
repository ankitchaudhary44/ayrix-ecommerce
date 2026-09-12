import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import productRoutes from './routes/product';
import fitRoutes from './routes/fit';
import purchaseRoutes from './routes/purchase';
import feedbackRoutes from './routes/feedback';
import adminRoutes from './routes/admin';
import pmRoutes from './routes/pm';
import supportRoutes from './routes/support';
import couponRoutes from './routes/coupons';
import notificationRoutes from './routes/notifications';

const app = express();

app.use(helmet());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', apiLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: ENV.NODE_ENV, timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/fit', fitRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pm', pmRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/notifications', notificationRoutes);

import paymentRoutes from './routes/payment';
app.use('/api/payment', paymentRoutes);

// Error Handling
app.use(errorHandler);

const PORT = parseInt(ENV.PORT, 10);

if (process.env.NODE_ENV !== 'test') {
  connectDB().catch(() => {});
  app.listen(PORT, () => {
    console.log(`AYRIX Fit Engine Backend active on http://localhost:${PORT}`);
  });
}

export default app;
