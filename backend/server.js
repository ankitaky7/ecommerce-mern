const express = require("express");
const {connectToMongoDB} = require("./config.js/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// routes import
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cart");
const addressRoutes = require("./routes/address");
const placeOrderRoutes = require("./routes/order");

app.use(cors());
// app.use(express.urlencoded({extended: false}));
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", placeOrderRoutes);

app.get('/', (req, res) => {
    res.send("API is running...")
})

connectToMongoDB();

app.listen(5000, () => {
    console.log("Server started at PORT: 5000")
});