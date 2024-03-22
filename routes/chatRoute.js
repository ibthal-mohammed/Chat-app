const router = require("express").Router();
const { accessChat, getChats, createGroupChat, addToGroup, getGroupChat } = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").post(protect, accessChat).get(protect, getChats)
router.route("/group").post(protect, createGroupChat).get(protect, getGroupChat)
router.route("/groupadd/:id").patch(protect, addToGroup)

module.exports = router;
