const Product = require("../models/Product");
//Errors

exports.getAllProducts = async (req, res) => {
  try {
    const limit = Number(req.query?.limit || 20);

    const offset = Number(req.query?.offset || 0);

    const products = await Product.find().limit(limit).skip(offset);

    const totalProductsInDatabase = await Product.countDocuments();

    return res.json({
      data: products, // Send projects result
      meta: {
        // meta information about request
        total: totalProductsInDatabase, // Total num projects available in db
        limit: limit, // Num of projects asked for
        offset: offset, // Num or projects asked to skip
        count: products.length, // Num of projects sent back
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

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) return res.sendStatus(404);

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
