const router = require("express").Router();
const users = require("./users_data.json");
let id = users.length;

// get all users
router.get("/", (req, res) => {
    let found_users = [];

    found_users = users.map((user) => user);
    if (!found_users || found_users.length === 0) {
        return res.status(404).json({ error: "Users not found" });
    }
    res.json(found_users);
});

module.exports = router;
