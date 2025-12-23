import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './Routes/index.js';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

/* -----------------------------------------
   1️⃣ RAW BODY PARSER FOR RAZORPAY (FIRST!)
------------------------------------------ */
// RAW parser ONLY for this one route
// RAW BODY PARSER ONLY FOR RAZORPAY WEBHOOK
app.post(
  "/api/billing/webhook/razorpay",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    req.rawBody = req.body.toString(); // convert buffer → exact string Razorpay expects
    next();
  }
);



/* -----------------------------------------
   2️⃣ NORMAL MIDDLEWARES (AFTER RAW PARSER)
------------------------------------------ */
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        process.env.FRONTEND_URL,
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

/* -----------------------------------------
   3️⃣ ALL ROUTES
------------------------------------------ */
app.use('/api', routes);

/* -----------------------------------------
   4️⃣ ERROR HANDLER
------------------------------------------ */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});

export default app;
