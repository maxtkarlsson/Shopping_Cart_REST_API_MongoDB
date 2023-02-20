const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
} = require("../controllers/productController");

// GET - /api/v1/products/
router.get("/", getAllProducts);

// GET - /api/v1/products/:productId
router.get("/:productId", getProductById);

module.exports = router;
