const address = require('../models/address')

const saveAddress = async(req, res) => {
    try {
        const saveAddress = await address.create(req.body);
        res.json({message: "Address saved Successfully", saveAddress});
    } catch (error) {
        res.status(500).json({message: "Error saving Address", error});
    }
}

const getAddress = async(req, res) => {
    try {
        const getaddress = await address.find({
            userId: req.params.userId
        })
        res.json(getaddress);
    } catch (error) {
        res.status(500).json({message: "Error fetching Address", error});
    }
}

module.exports = {
    saveAddress, 
    getAddress
}