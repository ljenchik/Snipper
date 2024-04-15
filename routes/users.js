const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");

// register a user
router.post("/register", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required" });
        }
        const existing_user = await User.findOne({ where: { email } });
        if (existing_user) {
            return res.status(400).json({ error: "Email already exists" });
        }
        req.body.password = await bcrypt.hash(req.body.password, 3);
        await User.create(req.body);
        const users = await User.findAll();
        res.send(users);
    } catch (error) {
        next(error);
    }
});

// register a user
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required" });
        }
        const existing_user = await User.findOne({
            where: { email },
        });
        if (!existing_user) {
            return res.status(404).json({ error: "User not found" });
        }
        const match = await bcrypt.compare(
            req.body.password,
            existing_user.password
        );
        if (match) {
            res.send("Success");
        } else {
            res.send("Failed");
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
