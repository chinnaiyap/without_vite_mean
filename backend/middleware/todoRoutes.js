const express =
  require("express");

const router =
  express.Router();

const auth =
  require("../middleware/auth");

const admin =
  require("../middleware/admin");

router.delete(
  "/delete/:id",
  auth,
  admin,
  deleteTodo
);

module.exports = router;