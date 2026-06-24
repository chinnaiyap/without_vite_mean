const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// ==============================
// REGISTER USER
// ==============================

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check Existing User

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Encrypt Password

    const hashedPassword = await bcrypt.hash(password, 10);

    // let role = "user";

    // // Admin User

    // if (
    //   email === "admin@gmail.com"
    // ) {
    //   role = "admin";
    // }

    // const user = new User({
    //   name,
    //   email,
    //   password: hashedPassword,
    //   role,
    // });
    
    let role = "user";

    const adminEmails = [
      "admin@gmail.com",
      "chinnaiya@gmail.com",
      "manager@gmail.com",
    ];

    if (adminEmails.includes(email)) {
      role = "admin";
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
        await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// LOGIN USER
// ==============================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};