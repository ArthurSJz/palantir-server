const express = require("express");
const router = express.Router();
const Scroll = require("../models/Scroll.model");
const Hall = require("../models/Hall.model");
const Realm = require("../models/Realm.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /api/scrolls - Create scroll (message)
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { content, hall } = req.body;
    const hallDoc = await Hall.findById(hall).populate("realm");
    if (!hallDoc) return res.status(404).json({ message: "Hall not found" });
    
    const realm = await Realm.findById(hallDoc.realm._id);
    if (!realm.members.includes(req.payload._id)) {
      return res.status(403).json({ message: "You must be a member of this realm" });
    }

    const scroll = await Scroll.create({
      content,
      hall,
      author: req.payload._id,
    });

    const populated = await scroll.populate("author", "name avatar title");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
});

// GET /api/scrolls/hall/:hallId - Get all scrolls in a hall
router.get("/hall/:hallId", isAuthenticated, async (req, res, next) => {
  try {
    const { limit = 50, before } = req.query;
    const query = { hall: req.params.hallId };
    if (before) query.createdAt = { $lt: new Date(before) };

    const scrolls = await Scroll.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("author", "name avatar title journeyStatus");

    res.json(scrolls.reverse());
  } catch (error) {
    next(error);
  }
});

// PUT /api/scrolls/:scrollId - Edit scroll (author only)
router.put("/:scrollId", isAuthenticated, async (req, res, next) => {
  try {
    const scroll = await Scroll.findById(req.params.scrollId);
    if (!scroll) return res.status(404).json({ message: "Scroll not found" });
    if (scroll.author.toString() !== req.payload._id) {
      return res.status(403).json({ message: "You can only edit your own scrolls" });
    }

    const updated = await Scroll.findByIdAndUpdate(
      req.params.scrollId,
      { content: req.body.content, isEdited: true, editedAt: new Date() },
      { new: true }
    ).populate("author", "name avatar title");

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/scrolls/:scrollId - Delete scroll (author only)
router.delete("/:scrollId", isAuthenticated, async (req, res, next) => {
  try {
    const scroll = await Scroll.findById(req.params.scrollId);
    if (!scroll) return res.status(404).json({ message: "Scroll not found" });
    if (scroll.author.toString() !== req.payload._id) {
      return res.status(403).json({ message: "You can only delete your own scrolls" });
    }

    await Scroll.findByIdAndDelete(req.params.scrollId);
    res.json({ message: "Scroll deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;