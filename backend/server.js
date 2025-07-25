import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/Connection.js';
import authRouter from './routes/authRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import paymentReportRouter from './routes/paymentReportRoutes.js';
import memberRouter from './routes/memberRoutes.js';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT|| 3000
const app = express()


// cors headers
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

app.options(
  "*",
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// middlewares
app.use(express.json())


app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend reachable!" });
});


// routes
app.use('/api/auth/v1/', authRouter)
app.use('/api/category/v1/', categoryRouter)
app.use('/api/member/v1/', memberRouter)
app.use('/api/payment/report/v1/', paymentReportRouter)

app.listen(PORT, '0.0.0.0', () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`)
})
