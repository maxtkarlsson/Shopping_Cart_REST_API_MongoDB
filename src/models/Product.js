const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  price: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  /*
  articleNr: {
    type: String,
    required: true,
  },
  */
});

module.exports = mongoose.model("Product", ProductSchema);
