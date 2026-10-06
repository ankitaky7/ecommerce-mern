const order = require("../models/order");
const cart = require("../models/cart");
const product = require("../models/product");
const user = require("../models/User");

const placeOrder = async (req, res) => {
    try {
        const { userId, address } = req.body;

        // get cart
        const userCart = await cart.findOne({ userId }).populate('items.productId');
        if (!userCart || userCart.items.length == 0) {
            return res.status(400).json({ message: "Cart is Empty!" });
        }

        // prepare order items
        const orderItems = userCart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
        }));

        // calculate total amount
        const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        // deduct stock
        for (let item of userCart.items) {
            await product.findByIdAndUpdate(item.productId._id, { $inc: { stock: -item.quantity } });
        }

        //create order
        const newOrder = await order.create({
            userId,
            items: orderItems,
            address,
            totalAmount,
            paymentMethod: "COD",
        })

        // clear cart
        await cart.findOneAndUpdate({userId}, {items: []});
        res.status(201).json({message: "Order Placed Successfully", orderId: newOrder._id});
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    placeOrder
}