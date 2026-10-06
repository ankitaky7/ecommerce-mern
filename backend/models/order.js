const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            quantity: Number,
            price: Number,
        }
    ],
    address: {
        fullName: String,
        phone: String,
        addressLine: String,
        city: String,
        state: String,
        pincode: String,
    },
    totalAmount: Number,
    paymentMethod: {
        type: String,
        default: 'COD'
    },
    status: {
        type: String,
        default: 'Placed',
    },
}, {
    timestamps: true
});

const order = mongoose.model("order", orderSchema);

module.exports = order;