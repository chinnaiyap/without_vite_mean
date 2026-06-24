const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "user"
  }
});

module.exports =
mongoose.model("User", userSchema);


// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
//   role: {
//     type: String,
//     enum: ["user", "admin"],
//     default: "user",
//   },
// });

// module.exports = mongoose.model("User", userSchema);




// const express = require("express");
// const router = express.Router();

// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");

// const { deleteTodo } = require("../controllers/todoController");

// router.delete(
//   "/delete/:id",
//   auth,
//   admin,
//   deleteTodo
// );

// module.exports = router;

// const express = require("express");

// const router = express.Router();

// const auth = require("../middleware/auth");

// const admin = require("../middleware/admin");

// // router.delete("/delete/:id", auth, admin, deleteTodo);

// module.exports = router;

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
//   role: {
//     type: String,
//     enum: ["user", "admin"],
//     default: "user",
//   },
// });

// module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model(
//   "User",
//   userSchema
// );