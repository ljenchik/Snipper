const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");
require("dotenv").config();
const check_user = require("../utils/check_user");
const authorize = require("../utils/authorize");

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

// login a user
router.post("/login", check_user, async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            const payload = { id: user.id, email: user.email };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "1w",
            });
            console.log("access token: ", token);
            res.json({ message: "Success", token });
        } else {
            res.send("Failed");
        }
    } catch (error) {
        next(error);
    }
});

router.get("/", authorize, async (req, res) => {
    /**
     * Note that this endpoint no longer needs to repeat all the authentication logic!
     * The The authorize middleware verifies and parses the token, then attaches the
     * payload to req.user for return.
     */
    const all_users = await User.findAll();
    res.json(all_users);
});

module.exports = router;
