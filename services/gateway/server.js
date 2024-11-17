import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Proxy middleware configuration
app.use('/api/customers', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});