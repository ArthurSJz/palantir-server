const express = require("express");
const router = express.Router();
const Hall = require("../models/Hall.model");
const Scroll = require("../models/Scroll.model");
const Realm = require("../models/Realm.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /api/halls - Create hall
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { name, description, icon, type, realm } = req.body;
    const realmDoc = await Realm.findById(realm);
    if (!realmDoc) return res.status(404).json({ message: "Realm not found" });
    if (!realmDoc.wardens.includes(req.payload._id) && realmDoc.owner.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Only wardens can create halls" });
    }
    const hall = await Hall.create({ name, description, icon, type, realm });
    res.status(201).json(hall);
  } catch (error) {
    next(error);
  }
});

// GET /api/halls/realm/:realmId - Get all halls in a realm
router.get("/realm/:realmId", isAuthenticated, async (req, res, next) => {
  try {
    const halls = await Hall.find({ realm: req.params.realmId });
    res.json(halls);
  } catch (error) {
    next(error);
  }
});

// GET /api/halls/:hallId - Get single hall
router.get("/:hallId", isAuthenticated, async (req, res, next) => {
  try {
    const hall = await Hall.findById(req.params.hallId).populate("realm");
    if (!hall) return res.status(404).json({ message: "Hall not found" });
    res.json(hall);
  } catch (error) {
    next(error);
  }
});

// PUT /api/halls/:hallId - Update hall
router.put("/:hallId", isAuthenticated, async (req, res, next) => {
  try {
    const hall = await Hall.findById(req.params.hallId).populate("realm");
    if (!hall) return res.status(404).json({ message: "Hall not found" });
    const realm = await Realm.findById(hall.realm._id);
    if (!realm.wardens.includes(req.payload._id) && realm.owner.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Only wardens can edit halls" });
    }
    const updated = await Hall.findByIdAndUpdate(req.params.hallId, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/halls/:hallId - Delete hall
router.delete("/:hallId", isAuthenticated, async (req, res, next) => {
  try {
    const hall = await Hall.findById(req.params.hallId);
    if (!hall) return res.status(404).json({ message: "Hall not found" });
    const realm = await Realm.findById(hall.realm);
    if (!realm.wardens.includes(req.payload._id) && realm.owner.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Only wardens can delete halls" });
    }
    await Scroll.deleteMany({ hall: req.params.hallId });
    await Hall.findByIdAndDelete(req.params.hallId);
    res.json({ message: "Hall deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;