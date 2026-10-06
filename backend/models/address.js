const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'user'
    },
    fullName: String, 
    phone: String, 
    addressLine: String, 
    city: String,
    state: String, 
    pincode: String,
}, {    
    timestamps: true
});

const address = mongoose.model('address', addressSchema);

module.exports = address;