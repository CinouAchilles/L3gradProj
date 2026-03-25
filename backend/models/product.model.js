import mongoose from "mongoose";



const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Product name is required"],
    },
    description:{
        type: String,
        required: [true, "Product description is required"],
    },
    price:{
        type: Number,
        min: [0, "Price cannot be negative"],
        required: [true, "Product price is required"],
    },
   // 🔥 Option 1: URL
    imageUrl: {
        type: String,
        default: null,
    },

    // 🔥 Option 2: uploaded image (stored path or cloud URL)
    imageFile: {
        type: String, // e.g. "/uploads/image.jpg" or Cloudinary URL
        default: null,
    },
    category:{
        type: String,
        required: [true, "Product category is required"],
    },
    isFeatured:{
        type: Boolean,
        default: false,
    },
}, {timestamps: true});

productSchema.pre('save', async function(){
    if(!this.imageUrl && !this.imageFile){
        throw new Error("Either imageUrl or imageFile must be provided");
    }else if(this.imageUrl && this.imageFile){
        throw new Error("Only one of imageUrl or imageFile should be provided");
    }
})



const Product = mongoose.model("Product", productSchema);

export default Product;