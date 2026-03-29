import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const user = req.user;
    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId,
    );
    if (existingItem) {
      if (existingItem.quantity >= 3) {
        return res.status(400).json({
          message: "Maximum quantity for this product is 3",
          cart: user.cartItems,
        });
      }
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: productId, quantity: 1 });
    }
    await user.save();
    return res.json({
      message: "Product added to cart successfully",
      cart: user.cartItems,
    });
  } catch (error) {
    console.error("Error adding product to cart: " + error.message);
    return res.status(500).json({ message: "Error adding product to cart" });
  }
};

export const deleteWholeProductFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const user = req.user;
    if (!user.cartItems.some((item) => item.product.toString() === productId)) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    user.cartItems = user.cartItems.filter(
      (item) => item.product.toString() !== productId,
    );
    await user.save();
    return res.json({
      message: "Product deleted from cart successfully",
      cart: user.cartItems,
    });
  } catch (error) {
    console.error("Error deleting product from cart: " + error.message);
    return res
      .status(500)
      .json({ message: "Error deleting product from cart" });
  }
};

export const updateTheQuantityOfProductInCart = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body || {}; // safe destructuring

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (quantity === undefined) {
      return res.status(400).json({ message: "Quantity is required" });
    }
    const user = req.user;

    const item = user.cartItems.find(
      (item) => item.product.toString() === productId,
    );
    if (item) {
      if (quantity < 1) {
        user.cartItems = user.cartItems.filter(
          (item) => item.product.toString() !== productId,
        );
        await user.save();
        return res.json({
          message: "Product removed from cart successfully",
          cart: user.cartItems,
        });
      } else if (quantity > 3) {
        return res.status(400).json({
          message: "Maximum quantity for this product is 3",
          cart: user.cartItems,
        });
      }
      item.quantity = quantity;
      await user.save();
      return res.json({
        message: "Product quantity updated successfully",
        cart: user.cartItems,
      });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error updating product quantity in cart: " + error.message);
    return res
      .status(500)
      .json({ message: "Error updating product quantity in cart" });
  }
};

export const getAllCartProducts = async (req, res) => {
  try {
    const user = req.user;
    await user.populate("cartItems.product");
    return res.json({ cart: user.cartItems, user: req.user }); // return the user too for test
  } catch (error) {
    console.error("Error fetching cart products: " + error.message);
    return res.status(500).json({ message: "Error fetching cart products" });
  }
};
