const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const ShoppingCart = require("../models/ShoppingCart");
const { NotFoundError } = require("../utils/errors");

exports.createShoppingCart = async (req, res) => {
  try {
    // Create cart
    const newShoppingCart = await ShoppingCart.create({});

    return res
      .setHeader(
        "Location",
        `http://localhost:${process.env.PORT}/api/v1/projects/${newShoppingCart._id}`
      )
      .status(201)
      .json(newShoppingCart);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.addProductToShoppingCart = async (req, res) => {
  try {
    // Place product id in local variable
    const cartId = req.params.cartId;
    console.log(cartId);
    const productId = req.body.productId;
    console.log(productId);

    // Get cart
    const cartToUpdate = await ShoppingCart.findById(cartId);
    console.log(cartToUpdate);

    // Get product
    const productToAdd = await Product.findById(productId);
    console.log(productToAdd);

    // If (no cart) respond with Not Found
    if (!cartToUpdate) return res.sendStatus(404);

    // If (no product) respond with Not Found
    if (!productToAdd) return res.sendStatus(404);

    // Save the carts product in variable
    const productsInCart = cartToUpdate.products;

    // Create new cartItem
    const newCartItem = {
      productId: productToAdd._id,
      name: productToAdd.name,
      price: productToAdd.price,
      unitPrice: productToAdd.unitPrice,
      quantity: 1,
    };

    const foundProduct = productsInCart.find(
      (productToAdd) => productToAdd.productId == productId
    );

    var updatedCart;

    if (productsInCart.length >= 1) {
      if (foundProduct) {
        cartToUpdate.totalQuantity++;
        cartToUpdate.totalPrice += productToAdd.price;
        foundProduct.quantity++;
        foundProduct.price += productToAdd.price;
        updatedCart = await cartToUpdate.save();
      } else {
        cartToUpdate.totalQuantity++;
        cartToUpdate.totalPrice += productToAdd.price;
        productsInCart.push(newCartItem);
        updatedCart = await cartToUpdate.save();
      }
    } else {
      cartToUpdate.totalQuantity++;
      cartToUpdate.totalPrice += productToAdd.price;
      productsInCart.push(newCartItem);
      updatedCart = await cartToUpdate.save();
    }

    // Craft response (return updated cart)
    return res.json(updatedCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.removeProductFromCart = async (req, res) => {
  try {
    // Place product id in local variable
    const cartId = req.params.cartId;
    console.log(cartId);
    const productId = req.params.productId;
    console.log(productId);

    // Get cart
    const cartToUpdate = await ShoppingCart.findById(cartId);
    console.log(cartToUpdate);

    // Get product ???????????
    const productToRemove = await Product.findById(productId);
    console.log(productToRemove);

    // If (no cart) respond with Not Found
    if (!cartToUpdate) return res.sendStatus(404);

    // If (no product) respond with Not Found
    if (!productToRemove) return res.sendStatus(404);

    // Save the carts products in variable
    const productsInCart = cartToUpdate.products;

    // Find product in cart
    const foundProduct = productsInCart.find(
      (productToRemove) => productToRemove.productId == productId
    );
    console.log(JSON.stringify(foundProduct));

    //Find product position in cart
    const foundProductPos = productsInCart.findIndex(
      (productToRemove) => productToRemove.productId == productId
    );
    //Errror om den inte hittas

    console.log("FoundProductPos = " + foundProductPos);

    var updatedCart;
    //////////////////////
    if (foundProduct.quantity < 2) {
      if (cartToUpdate.totalQuantity >= 1) cartToUpdate.totalQuantity -= 1;

      if (cartToUpdate.totalPrice >= productToRemove.unitPrice)
        cartToUpdate.totalPrice -= productToRemove.unitPrice;

      productsInCart.splice(foundProductPos, 1);
      updatedCart = await cartToUpdate.save();
    } else {
      cartToUpdate.totalQuantity--;
      cartToUpdate.totalPrice -= productToRemove.price;
      foundProduct.quantity--;
      foundProduct.price -= productToRemove.price;

      updatedCart = await cartToUpdate.save();
    }

    // Craft response (return updated cart)
    return res.json(updatedCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllShoppingCarts = async (req, res) => {
  try {
    const limit = Number(req.query?.limit || 20);

    const offset = Number(req.query?.offset || 0);

    const shoppingCarts = await ShoppingCart.find().limit(limit).skip(offset);

    const totalShoppingCartsInDatabase = await ShoppingCart.countDocuments();

    return res.json({
      data: shoppingCarts, // Send projects result
      meta: {
        // meta information about request
        total: totalShoppingCartsInDatabase, // Total num projects available in db
        limit: limit, // Num of projects asked for
        offset: offset, // Num or projects asked to skip
        count: shoppingCarts.length, // Num of projects sent back
      },
    });
    // Catch any unforseen errors
  } catch (error) {
    console.error(error);
    // Send the following response if error occurred
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getShoppingCartById = async (req, res) => {
  try {
    const shoppingCartId = req.params.cartId;

    const shoppingCart = await ShoppingCart.findById(shoppingCartId);

    //if (!shoppingCart) return res.sendStatus(404);
    if (!shoppingCart) throw new NotFoundError("CastError");

    return res.json(shoppingCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteShoppingCartById = async (req, res) => {
  try {
    // Get project id and place in local variable
    const shoppingCartId = req.params.cartId;
    // Check if project exists
    const shoppingCartToDelete = await ShoppingCart.findById(shoppingCartId);
    // IF (no project) return Not Found
    if (!shoppingCartToDelete) return res.sendStatus(404);

    // Delete project
    await shoppingCartToDelete.delete();

    // Craft our response
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
