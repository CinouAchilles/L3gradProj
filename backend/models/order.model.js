import mongoose from "mongoose";


const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 3
    },
    lineTotal: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

/* Auto-calculate lineTotal */
orderItemSchema.pre("validate", function (next) {
  this.lineTotal = this.price * this.quantity;
  next();
});


const customerInfoSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  { _id: false }
);


const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "baridimob"],
      default: "cash_on_delivery",
      required: true,
    },

    customer: {
      type: customerInfoSchema,
      required: true,
    },

    items: {
      type: [orderItemSchema],
      validate: [
        (val) => val.length > 0,
        "Order must have at least one item",
      ],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

orderSchema.pre("validate", function (next) {
  this.subtotal = this.items.reduce(
    (acc, item) => acc + item.lineTotal,
    0
  );
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;