const Product = require("../models/Product");
const ShoppingCart = require("../models/ShoppingCart");
const { NotFoundError } = require("../utils/errors");

exports.createShoppingCart = async (req, res) => {
  try {
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
  const cartId = req.params.cartId;
  console.log(cartId);
  const productId = req.body.productId;
  console.log(productId);

  const cartToUpdate = await ShoppingCart.findById(cartId);
  console.log(cartToUpdate);

  const productToAdd = await Product.findById(productId);
  console.log(productToAdd);

  if (!cartToUpdate)
    throw new NotFoundError("A cart with that ID does not exist");

  if (!productToAdd)
    throw new NotFoundError("A product with that ID does not exist");

  const productsInCart = cartToUpdate.products;

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

  return res.json(updatedCart);
};

exports.removeProductFromCart = async (req, res) => {
  const cartId = req.params.cartId;
  console.log(cartId);
  const productId = req.params.productId;
  console.log(productId);

  const cartToUpdate = await ShoppingCart.findById(cartId);
  console.log(cartToUpdate);

  const productToRemove = await Product.findById(productId);
  console.log(productToRemove);

  if (!cartToUpdate)
    throw new NotFoundError("A cart with that ID does not exist");

  if (!productToRemove)
    throw new NotFoundError("A product with that ID does not exist");

  const productsInCart = cartToUpdate.products;

  const foundProduct = productsInCart.find(
    (productToRemove) => productToRemove.productId == productId
  );

  if (!foundProduct)
    throw new NotFoundError("This product does not exist in the cart");

  console.log(JSON.stringify(foundProduct));

  const foundProductPos = productsInCart.findIndex(
    (productToRemove) => productToRemove.productId == productId
  );

  console.log("FoundProductPos = " + foundProductPos);

  var updatedCart;

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

  return res.json(updatedCart);
};

exports.getAllShoppingCarts = async (req, res) => {
  const limit = Number(req.query?.limit || 20);

  const offset = Number(req.query?.offset || 0);

  const shoppingCarts = await ShoppingCart.find().limit(limit).skip(offset);

  const totalShoppingCartsInDatabase = await ShoppingCart.countDocuments();

  return res.json({
    data: shoppingCarts,
    meta: {
      total: totalShoppingCartsInDatabase,
      limit: limit,
      offset: offset,
      count: shoppingCarts.length,
    },
  });
};

exports.getShoppingCartById = async (req, res) => {
  const shoppingCartId = req.params.cartId;

  const shoppingCart = await ShoppingCart.findById(shoppingCartId);

  if (!shoppingCart)
    throw new NotFoundError("A cart with that ID does not exist");

  return res.json(shoppingCart);
};

exports.deleteShoppingCartById = async (req, res) => {
  const shoppingCartId = req.params.cartId;

  const shoppingCartToDelete = await ShoppingCart.findById(shoppingCartId);

  if (!shoppingCartToDelete)
    throw new NotFoundError("A cart with that ID does not exist");

  await shoppingCartToDelete.delete();

  return res.sendStatus(204);
};
