require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");
const port = 3000;

app.use(express.json());

app.use("/snippets", routes.snippets);
app.use("/users", routes.users);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
