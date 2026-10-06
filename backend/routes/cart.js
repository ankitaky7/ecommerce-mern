const express = require("express");
const {addToCart, removeItem, updateQuantity, getCart} = require('../controllers/cartController');

const router = express.Router();

router.post('/add',addToCart);
router.post('/remove',removeItem);
router.post('/update',updateQuantity);
router.get('/:userId',getCart);

module.exports = router;