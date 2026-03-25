import Product from '../models/product.model.js';

export const getAllProducts = async(req, res) => {
    try {
        const products = await Product.find({});
        res.json({products: products.length === 0 ? ["No products found"] : products});
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({message: "Error fetching products"});
    }
}

export const getFeaturedProducts = async(req, res) => {
    try {
        const featuredProducts = await Product.find({isFeatured: true});
        res.json({products: featuredProducts.length === 0 ? ["No featured products found"] : featuredProducts});
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({message: "Error fetching featured products"});
    }
}