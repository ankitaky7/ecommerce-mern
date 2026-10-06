const cart = require("../models/cart");

// add item to cart
const addToCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let userCart = await cart.findOne({ userId });

        if (!userCart) {
            userCart = new cart({
                userId, items: [
                    { productId, quantity: 1 }
                ]
            });
        } else {
            const item = userCart.items.find(
                (i) => i.productId.toString() === productId
            );

            if (item) {
                item.quantity += 1;
            } else {
                userCart.items.push({ productId, quantity: 1 });
            }
        }

        await userCart.save();
        res.json({
            message: 'Item added to cart',
            userCart
        })

    } catch (error) {
        res.status(500).json({ message: 'Add To Cart Server Error', error });
    }
}

// remove item from cart
const removeItem = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const removeItem = await cart.findOne({ userId });

        if (!removeItem) {
            return res.status(404).json({ message: "Item not Found in cart" })
        }

        removeItem.items = removeItem.items.filter(
            (i) => i.productId.toString() != productId
        );

        await removeItem.save();
        res.json({
            message: 'Item removed from cart',
            removeItem
        });

    } catch (error) {
        res.status(500).json({ message: 'Remove Item from Cart Error', error });
    }
}

// update item quantity in the cart
const updateQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const userCart = await cart.findOne({ userId });

        if (!userCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = userCart.items.find(
            i => i.productId.toString() === productId
        )

        if (!item) {
            return res.status(404).json({ message: 'Item not found in your cart' })
        }

        item.quantity = quantity;

        await userCart.save();
        res.json({
            message: 'Item quantity updated',
            userCart
        });

    } catch (error) {
        console.error('Update Quantity Error from Cart')
    }
}

// get cart by  user id
const getCart = async (req, res) => {
    try {
        const {userId} = req.params;

        const getCart = await cart.findOne({ userId }).populate('items.productId');
        
        res.json(getCart);
    } catch (error) {
        console.error("Exact error", error);
        res.status(500).json({ message: 'Get Cart Error from Cart', error });
    }
}

module.exports = {
    addToCart,
    removeItem,
    updateQuantity,
    getCart
}