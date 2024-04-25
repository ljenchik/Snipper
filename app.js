// load environment variables from .env or elsewhere
require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const { auth } = require("express-openid-connect");

const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

const app = express();

const { AUTH0_SECRET, AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_BASE_URL } =
    process.env;

const config = {
    authRequired: true,
    auth0Logout: true,
    secret: AUTH0_SECRET,
    baseURL: AUTH0_AUDIENCE,
    clientID: AUTH0_CLIENT_ID,
    issuerBaseURL: AUTH0_BASE_URL,
};

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../dist")));

app.use(express.json());
app.use(auth(config));

app.use("/snippets", routes.snippets);
app.use("/users", routes.users);

app.use((req, res) => {
    res.status(404).send({
        error: "404 - Not Found",
        message: "No route found for the requested URL",
    });
});

// error handling middleware
app.use((error, req, res, next) => {
    console.error("SERVER ERROR: ", error);
    if (res.statusCode < 400) res.status(500);
    res.send({
        error: error.message,
        name: error.name,
        message: error.message,
        table: error.table,
    });
});

module.exports = app;
