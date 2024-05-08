const router = require("express").Router();
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const check_user = require("../utils/check_user");

router.get("/", async (req, res) => {
    const all_users = await User.findAll();
    res.json(all_users);
});

router.get("/profile", (req, res, next) => {
    res.send(JSON.stringify(req.oidc.user));
});

// router.post("/", async (req, res) => {
//     const all_users = await User.findAll();
//     res.json(all_users);
// });

// router.post("/", async (req, res) => {
//     const { email, password } = req.user;

//     // hash the password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const user = {
//         id,
//         email,
//         password: hashedPassword,
//     };

//     // save the user
//     user.push(user);

//     // don't send back the hashed password
//     res.status(201).json({ id, email });
// });

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

module.exports = router;
