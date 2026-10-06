const product = require("../models/product");

// create a new product
const createProduct = async (req, res) => {
    try {
        const products = await product.create(req.body);
        res.json({
            message: 'Product Created Successfully',
            products,
        })
    } catch (error) {
        res.status(500).json({ message: 'Create Server Error', error });
    }
};

// get all product
const getAllProduct = async (req, res) => {
    try {
        const {search, category} = req.query;

        let filter = {};

        if(search) {
            filter.title = { $regex: search, $options: 'i'}; // i: case-insensitive
        }

        if(category){
            filter.category = category;
        }

        const products = await product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Get Server Error', error });
    }
}

// update a product
const updateProduct = async (req, res) => {
    try {
        const updatedProducts = await product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        )
        res.json({
            message: 'Product Updated Successfully',
            updatedProducts,
        });
    } catch (error) {
        res.status(500).json({ message: 'Update Server Error', error });
    }
}

// delete a product
const deleteProduct = async(req, res) => {
    try {
        const deletedProduct = await product.findByIdAndDelete(
            req.params.id
        )
        // if no products are there in database
        if(!deletedProduct){
            return res.status(404).json({message: "Product not found"});
        }
        res.json({
            message: "Product Deleted Successfully",
            deletedProduct
        });
    } catch (error) {
        res.status(500).json({ message: 'Delete Server Error', error });
    }
}

module.exports = {
    createProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
}