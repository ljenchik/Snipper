const express = require("express");
const router = require("express").Router();
const { Snippet } = require("../models");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// get all snippets
router.get("/", async (req, res, next) => {
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
    res.json(found_snippets);
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

// create a new snippet
router.post("/", async (req, res, next) => {
    try {
        req.body.language = req.body.language.toLocaleLowerCase();
        await Snippet.create(req.body);
        const snippets = await Snippet.findAll();
        res.send(snippets);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
