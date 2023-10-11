const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();

//Login
router.post("/login", asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (username === "admin123" && password === "password123") {
        const _user = { username, password };
        res.status(201).json(_user);
    }
    else {
        res.status(401);
		throw new Error('Invalid email or password.');
    }
}));

//EXPORT
module.exports = router;