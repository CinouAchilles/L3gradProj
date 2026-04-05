import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({
      products: products.length === 0 ? ["No products found"] : products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return res.status(500).json({ message: "Error fetching product" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featuredProducts");
    if (featuredProducts) {
      return res.json({ products: JSON.parse(featuredProducts) });
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (featuredProducts.length === 0) {
      return res.json({ products: ["No featured products found"] });
    }
    //store in redis cache for faster access next time
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: "Error fetching featured products" });
  }
};

export const createProduct = async (req, res) => {
  if (req.body == undefined) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  try {
    const {
      name,
      description,
      price,
      isFeatured,
      imageUrl,
      imageFile,
      category,
    } = req.body;
    //validation

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Product name is required" });
    }

    if (!description || description.trim() === "") {
      return res
        .status(400)
        .json({ message: "Product description is required" });
    }

    if (!category || category.trim() === "") {
      return res.status(400).json({ message: "Product category is required" });
    }

    if (price === undefined || price === null) {
      return res.status(400).json({ message: "Product price is required" });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res
        .status(400)
        .json({ message: "Price must be a valid non-negative number" });
    }

    if (!imageUrl && !imageFile) {
      return res
        .status(400)
        .json({ message: "Either imageUrl or imageFile must be provided." });
    }
    if (imageUrl && imageFile) {
      return res.status(400).json({
        message: "Only one of imageUrl or imageFile should be provided.",
      });
    }

    let cloudinaryImageUrl = null;

    // If the user uploads a file, upload it to Cloudinary
    if (imageFile) {
      const result = await cloudinary.uploader.upload(imageFile, {
        folder: "productsGraduationProject",
      });
      cloudinaryImageUrl = result.secure_url;
    }

    const product = new Product({
      name,
      description,
      price,
      isFeatured: isFeatured || false,
      category,
      imageUrl: imageUrl || null, // save the URL if provided
      imageFile: imageFile ? cloudinaryImageUrl : null, // save uploaded image URL if uploaded
    });

    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image from Cloudinary ONLY if it was uploaded (imageFile)
    if (product.imageFile) {
      // extract public_id from Cloudinary URL
      const urlParts = product.imageFile.split("/");
      const fileName = urlParts[urlParts.length - 1]; // e.g. abc123.jpg
      const publicId = `productsGraduationProject/${fileName.split(".")[0]}`;

      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image from Cloudinary: ${publicId}`);
      } catch (error) {
        console.error(`Error deleting image from Cloudinary: ${error.message}`);
      }
    }

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

export const getRecommendedUnderProduct = async (req, res) => {
  try {
    const recommendedProducts = await Product.aggregate([
      {
        $sample: { size: 4 }, // Adjust the number of recommended products as needed
      },
      {
        $project: {
          id: 1,
          name: 1,
          description: 1,
          price: 1,
          imageUrl: 1,
          imageFile: 1,
        },
      },
    ]);
    res.json({ recommendedProducts });
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    res.status(500).json({
      message: "Error fetching recommended products",
      error: error.message,
    });
  }
};

export const getByCategoryProducts = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category: category });
    res.json({ products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      message: "Error fetching products by category",
      error: error.message,
    });
  }
};

export const toggleFeaturedStatus = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  try {
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.isFeatured = !product.isFeatured;
    await product.save();
    await updateFeaturedFromCache();
    res.json({ message: "Featured status updated successfully", product });
  } catch (error) {
    console.error("Error updating featured status:", error);
    res.status(500).json({
      message: "Error updating featured status",
      error: error.message,
    });
  }
};

async function updateFeaturedFromCache() {
  try {
    const featruedProduct = await Product.find({ isFeatured: true }).lean();
    await redis.set("featuredProducts", JSON.stringify(featruedProduct));
  } catch (error) {
    console.log("error in update the cache function ");
  }
}
