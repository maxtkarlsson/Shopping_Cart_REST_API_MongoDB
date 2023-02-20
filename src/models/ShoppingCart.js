const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  unitPrice: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
});

const ShoppingCartSchema = new mongoose.Schema({
  totalPrice: {
    type: Number,
    default: 0,
  },
  totalQuantity: {
    type: Number,
    default: 0,
  },
  products: {
    type: [CartItemSchema],
  },
});

module.exports = mongoose.model("ShoppingCart", ShoppingCartSchema);
