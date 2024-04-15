const express = require("express");
const router = require("express").Router();
const { encrypt, decrypt } = require("../utils/encrypt");
const { Snippet } = require("../models");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// get all snippets
router.get("/", async (req, res, next) => {
    try {
        let found_snippets = [];
        if (req.query.lang) {
            const lang = req.query.lang.toLocaleLowerCase();
            found_snippets = await Snippet.findAll({
                where: { language: lang },
            });
        } else {
            found_snippets = await Snippet.findAll();
        }
        if (!found_snippets || found_snippets.length === 0) {
            return res.status(404).json({ error: "Snippets not found" });
        }
        const decrypted_snippets = found_snippets.map((snippet) => ({
            language: snippet.language,
            code: decrypt(snippet.code),
        }));
        res.json(decrypted_snippets);
    } catch (error) {
        next(error);
    }
});

// get a snippet by id
router.get("/:id", async (req, res, next) => {
    const snippet_id = parseInt(req.params.id);
    const found_snippet = await Snippet.findByPk(snippet_id);
    if (!found_snippet) {
        return res.status(404).json({ error: "Snippet not found" });
    }
    res.json(found_snippet);
});

// delete a snippet by id
router.delete("/:id", async (req, res, next) => {
    try {
        const snippet_id = parseInt(req.params.id);
        const found_snippet = await Snippet.findByPk(snippet_id);

        if (!found_snippet) {
            return res.status(404).json({ error: "Snippet not found" });
        }

        // Delete the snippet from the database
        await found_snippet.destroy();

        // Respond with a success message
        res.json({ message: "Snippet deleted successfully" });
    } catch (error) {
        // Handle errors
        next(error);
    }
});

// create a new snippet
router.post("/", async (req, res, next) => {
    try {
        req.body.language = req.body.language.toLocaleLowerCase();
        req.body.code = encrypt(req.body.code);
        await Snippet.create(req.body);
        const snippets = await Snippet.findAll();
        res.send(snippets);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
