const express = require("express");
const { saveAddress, getAddress } = require("../controllers/addressController");

const router = express.Router();

router.post("/add", saveAddress);
router.get("/:userId", getAddress);

module.exports = router;