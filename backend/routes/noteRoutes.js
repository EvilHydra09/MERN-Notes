const express = require("express");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Note
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = new Note({ title, content, userId: req.user.id });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Notes for a User
router.get("/", authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Note
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (note.userId.toString() !== req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        note.title = req.body.title || note.title;
        note.content = req.body.content || note.content;
        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Note
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (note.userId.toString() !== req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        await note.deleteOne();
        res.json({ message: "Note deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;