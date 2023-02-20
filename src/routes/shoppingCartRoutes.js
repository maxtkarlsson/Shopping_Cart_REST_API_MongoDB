const express = require("express");
const router = express.Router();
const {
  createShoppingCart,
  addProductToShoppingCart,
  removeProductFromCart,
  getAllShoppingCarts,
  getShoppingCartById,
  deleteShoppingCartById,
} = require("../controllers/shoppingCartController");

// POST - /api/v1/shoppingcarts
router.post("/", createShoppingCart);

// PUT - /api/v1/shoppingcarts/:cartId/
router.put("/:cartId", addProductToShoppingCart);

// PUT - /api/v1/shoppingcarts/:cartId/product/:productId
router.put("/:cartId/product/:productId", removeProductFromCart);

// GET - /api/v1/shoppingcarts/
router.get("/", getAllShoppingCarts);

// GET - /api/v1/shoppingcarts/:cartId
router.get("/:cartId", getShoppingCartById);

// DELETE - /api/v1/shoppingcarts/:cartId
router.delete("/:cartId", deleteShoppingCartById);

module.exports = router;
