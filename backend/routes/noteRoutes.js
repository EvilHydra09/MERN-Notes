const express = require("express");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Note with Basic Validation
router.post("/", authMiddleware, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }

    try {
        const newNote = new Note({ title, content, userId: req.user.id });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get All Notes for the Authenticated User
router.get("/", authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id });

        if (!notes || notes.length === 0) {
            return res.status(404).json({ error: "No notes found" });
        }

        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Update Note with Basic Validation
router.put("/:id", authMiddleware, async (req, res) => {
    const { title, content } = req.body;

    if (!title && !content) {
        return res.status(400).json({ error: "At least one field (title or content) is required for update" });
    }

    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        if (note.userId.toString() !== req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        note.title = title || note.title;
        note.content = content || note.content;
        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Note (Basic Validation)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        if (note.userId.toString() !== req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        await note.deleteOne();
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;