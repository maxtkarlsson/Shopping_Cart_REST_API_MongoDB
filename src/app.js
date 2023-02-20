require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const shoppingCartRoutes = require("./routes/shoppingCartRoutes");
const productRoutes = require("./routes/productRoutes");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const { notFoundMiddleware } = require("./middleware/notFoundMiddleware");

const app = express();

/* ------- 3) Sätt upp våran middleware ------- */
// Parse JSON on request body and place on req.body
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Processing ${req.method} request to ${req.path}`);
  next();
});

/*Routes*/
app.use("/api/v1/shoppingcarts", shoppingCartRoutes);
app.use("/api/v1/products", productRoutes);

/* Error handling */
app.use(notFoundMiddleware);
app.use(errorMiddleware);

/* Start server */
const port = process.env.PORT || 5000;
async function run() {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

run();
