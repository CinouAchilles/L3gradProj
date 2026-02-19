import express from 'express';
import router from './routes/auth.routes.js';

const app = express();
const PORT = 3000;

app.get('/' , (req , res)=>{
    res.send("Hello World in Express.js!");
})

app.use('/api/auth' , router)


app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})


console.log("Server is running...");