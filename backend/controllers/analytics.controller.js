import Product from "../models/product.model.js";
import User from "../models/user.model.js"



export const getAnalytics = async (req, res) => {
    const countUsers = await User.countDocuments();
    const countProducts = await Product.countDocuments();
    
    return res.status(200).json({
        users: countUsers,
        products: countProducts
    });
}