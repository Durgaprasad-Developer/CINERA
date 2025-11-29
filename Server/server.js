import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
console.log(process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET)
app.listen(PORT, () => console.log(`✅ CINERA backend running on port ${PORT}`));
