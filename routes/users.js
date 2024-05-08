const router = require("express").Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const authorize = require("../utils/authorize");

router.get("/", async (req, res) => {
    const all_users = await User.findAll();
    res.json(all_users);
});

router.get("/profile", (req, res, next) => {
    res.send(JSON.stringify(req.oidc.user));
});

router.post("/", async (req, res) => {
    const all_users = await User.findAll();
    res.json(all_users);
});

router.post("/", async (req, res) => {
    const { email, password } = req.user;

    // hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = {
        id,
        email,
        password: hashedPassword,
    };

    // save the user
    user.push(user);

    // don't send back the hashed password
    res.status(201).json({ id, email });
});

module.exports = router;
