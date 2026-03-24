import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()) // Middleware to parse JSON bodies
app.use(cookieParser()) // Middleware to parse cookies
app.get('/' , (req , res)=>{
    res.send("Hello World in Express.js!");
})

app.use('/api/auth' , authRouter)


app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})


console.log("Server is running...");