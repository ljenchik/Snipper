const router = require("express").Router();
const snippets = require("./snippets_data.json");
let id = snippets.length;

// get all snippets
router.get("/", (req, res) => {
    let found_snippets = [];
    if (req.query.lang) {
        const lang = req.query.lang.toLocaleLowerCase();
        found_snippets = snippets.filter(
            (snippet) => snippet.language.toLowerCase() === lang
        );
    } else {
        found_snippets = snippets.map((snippet) => snippet);
    }
    if (!found_snippets || found_snippets.length === 0) {
        return res.status(404).json({ error: "Snippets not found" });
    }
    res.json(found_snippets);
});

// get a snippet by id
router.get("/:id", (req, res) => {
    const snippet_id = parseInt(req.params.id);
    const found_snippet = snippets.find((snippet) => snippet.id === snippet_id);
    if (!found_snippet) {
        return res.status(404).json({ error: "Snippet not found" });
    }
    res.json(found_snippet);
});

// create a new snippet
router.post("/", (req, res) => {
    const { language, code } = req.body;

    const snippet = {
        id: ++id,
        language,
        code,
    };

    snippets.push({ ...snippet });
    res.status(201).json(snippets);
});

module.exports = router;
