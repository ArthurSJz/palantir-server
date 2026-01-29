const express = require("express");
const router = express.Router();
const { askGandalf, summarizeScrolls } = require("../services/gandalf.service");
const Scroll = require("../models/Scroll.model");
const Hall = require("../models/Hall.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /api/gandalf/ask - Ask Gandalf a question
router.post("/ask", isAuthenticated, async (req, res, next) => {
  try {
    const { message, hallId } = req.body;
    
    const response = await askGandalf(message);
    
    // If hallId provided, save as scroll
    if (hallId) {
      // Save user's question
      await Scroll.create({
        content: message,
        hall: hallId,
        author: req.payload._id,
      });
      
      // Save Gandalf's response
      const gandalfScroll = await Scroll.create({
        content: response,
        hall: hallId,
        author: req.payload._id,
        type: "gandalf_response",
        isGandalfResponse: true,
      });
      
      return res.json({ response, scroll: gandalfScroll });
    }
    
    res.json({ response });
  } catch (error) {
    next(error);
  }
});

// POST /api/gandalf/summarize/:hallId - Summarize a hall's conversation
router.post("/summarize/:hallId", isAuthenticated, async (req, res, next) => {
  try {
    const scrolls = await Scroll.find({ hall: req.params.hallId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("author", "name");
    
    const summary = await summarizeScrolls(scrolls.reverse());
    res.json({ summary });
  } catch (error) {
    next(error);
  }
});

module.exports = router;