const router = require("express").Router();
const { User } = require("../models");

router.get("/", async (req, res) => {
    const all_users = await User.findAll();
    res.json(all_users);
});

router.get("/profile", (req, res, next) => {
    res.send(JSON.stringify(req.oidc.user));
});

module.exports = router;
