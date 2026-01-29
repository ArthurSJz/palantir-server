const express = require("express");
const router = express.Router();
const Realm = require("../models/Realm.model");
const Traveler = require("../models/Traveler.model");
const Hall = require("../models/Hall.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /api/realms - Create a new realm
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { name, description, icon, isPublic } = req.body;
    const ownerId = req.payload._id;

    const newRealm = await Realm.create({
      name,
      description,
      icon,
      isPublic,
      owner: ownerId,
      members: [ownerId],
      wardens: [ownerId],
    });

    // Add realm to traveler's realms
    await Traveler.findByIdAndUpdate(ownerId, {
      $push: { realms: newRealm._id },
    });

    // Create default "general" hall
    await Hall.create({
      name: "general",
      description: "Welcome to the realm!",
      icon: "🏠",
      realm: newRealm._id,
    });

    res.status(201).json(newRealm);
  } catch (error) {
    next(error);
  }
});

// GET /api/realms - Get all realms for current traveler
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const travelerId = req.payload._id;
    const realms = await Realm.find({ members: travelerId })
      .populate("owner", "name avatar")
      .populate("members", "name avatar journeyStatus");
    res.json(realms);
  } catch (error) {
    next(error);
  }
});

// GET /api/realms/:realmId - Get single realm
router.get("/:realmId", isAuthenticated, async (req, res, next) => {
  try {
    const realm = await Realm.findById(req.params.realmId)
      .populate("owner", "name avatar")
      .populate("members", "name avatar journeyStatus")
      .populate("wardens", "name avatar");
    if (!realm) return res.status(404).json({ message: "Realm not found" });
    res.json(realm);
  } catch (error) {
    next(error);
  }
});

// PUT /api/realms/:realmId - Update realm (owner only)
router.put("/:realmId", isAuthenticated, async (req, res, next) => {
  try {
    const realm = await Realm.findById(req.params.realmId);
    if (!realm) return res.status(404).json({ message: "Realm not found" });
    if (realm.owner.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Only the owner can edit this realm" });
    }
    const updated = await Realm.findByIdAndUpdate(req.params.realmId, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/realms/:realmId - Delete realm (owner only)
router.delete("/:realmId", isAuthenticated, async (req, res, next) => {
  try {
    const realm = await Realm.findById(req.params.realmId);
    if (!realm) return res.status(404).json({ message: "Realm not found" });
    if (realm.owner.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Only the owner can delete this realm" });
    }
    // Delete all halls in realm
    await Hall.deleteMany({ realm: req.params.realmId });
    // Remove realm from all travelers
    await Traveler.updateMany({ realms: req.params.realmId }, { $pull: { realms: req.params.realmId } });
    await Realm.findByIdAndDelete(req.params.realmId);
    res.json({ message: "Realm deleted" });
  } catch (error) {
    next(error);
  }
});

// POST /api/realms/join - Join realm with gate password
router.post("/join", isAuthenticated, async (req, res, next) => {
  try {
    const { gatePassword } = req.body;
    const travelerId = req.payload._id;
    const realm = await Realm.findOne({ gatePassword: gatePassword.toUpperCase() });
    if (!realm) return res.status(404).json({ message: "Invalid gate password" });
    if (realm.members.includes(travelerId)) {
      return res.status(400).json({ message: "Already a member" });
    }
    realm.members.push(travelerId);
    await realm.save();
    await Traveler.findByIdAndUpdate(travelerId, { $push: { realms: realm._id } });
    res.json(realm);
  } catch (error) {
    next(error);
  }
});

// POST /api/realms/:realmId/leave - Leave realm
router.post("/:realmId/leave", isAuthenticated, async (req, res, next) => {
  try {
    const travelerId = req.payload._id;
    const realm = await Realm.findById(req.params.realmId);
    if (!realm) return res.status(404).json({ message: "Realm not found" });
    if (realm.owner.toString() === travelerId) {
      return res.status(400).json({ message: "Owner cannot leave. Delete the realm instead." });
    }
    await Realm.findByIdAndUpdate(req.params.realmId, { $pull: { members: travelerId, wardens: travelerId } });
    await Traveler.findByIdAndUpdate(travelerId, { $pull: { realms: req.params.realmId } });
    res.json({ message: "Left realm successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;