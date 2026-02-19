import express from 'express';
import { stat } from 'node:fs';

const router = express.Router();

router.get('/signup' , (req , res)=>{
    // res.status(200).send("Signup route");
    res.json({
        data: "you hit the signup endpoint",
        statusCode: 200
    });
})

export default router;