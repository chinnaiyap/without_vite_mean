// //Using Express

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// //create an instance of express
const app = express();
app.use(express.json());
app.use(cors());

// //Sample in-memory storage for todo items    //mongodb-as a array element
let todos = [];

// // connecting mongodb
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

//==========Register API ==========//
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User Registered",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
//==========Register API ==========//

//==========Login API ==========//
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
//==========Login API ==========//



//=== ADD INDEXES HERE (IMPORTANT POSITION) ==/
todoSchema.index({ createdAt: -1 });
todoSchema.index({ location: "text", title: "text" });

// //creating model
const todoModel = mongoose.model("Todo", todoSchema);

// //Create a new todo item
app.post("/todos", async (req, res) => {
  //next logig statement
  const { title, description, location } = req.body; //

  try {
    const newTodo = new todoModel({ title, description, location }); //
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// // Update a todo item
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, description, location },
      { new: true },
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// // Delete a todo item
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
  z;
});

//  PUT SUMMARY HERE
app.get("/todos/summary", async (req, res) => {
  console.log("SUMMARY HIT"); // debug

  try {
    const result = await todoModel.aggregate([
      {
        $match: {},
      },
      {
        $addFields: {
          titleLength: { $strLenCP: "$title" },
        },
      },
      {
        $group: {
          _id: "$location",
          totalTodos: { $sum: 1 },
          avgTitleLength: { $avg: "$titleLength" },
        },
      },
      {
        $project: {
          _id: 0,
          location: "$_id",
          totalTodos: 1,
          avgTitleLength: { $round: ["$avgTitleLength", 2] },
        },
      },
      {
        $sort: { totalTodos: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const total = await todoModel.countDocuments();

    res.json({
      summary: result,
      totalTodos: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// AFTER summary

//1. BACKEND → Aggregation + Pagination
app.get("/todos", async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      filterLocation,
      page = 1,
      limit = 5,
      search,
    } = req.query;

    const skip = (page - 1) * limit;

    let matchStage = {};

    // DATE FILTER
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + "T23:59:59.999Z"),
      };
    }

    // LOCATION FILTER
    if (filterLocation && filterLocation.trim() !== "") {
      matchStage.location = {
        $regex: filterLocation,
        $options: "i",
      };
    }

    //*
    if (search && search.trim() !== "") {
      matchStage.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const result = await todoModel.aggregate([
      { $match: matchStage },

      // SORT (latest first)
      { $sort: { createdAt: -1 } },

      // FACET (pagination + count)
      {
        $facet: {
          todos: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const todos = result[0].todos;
    const totalCount = result[0].totalCount[0]?.count || 0;

    res.json({
      todos,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/todos/search", async (req, res) => {
  try {
    const { query } = req.query;

    // Create empty filter object
    let matchStage = {};

    // Minimum 3 characters
    if (query && query.trim().length >= 3) {
      matchStage.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ];
    }

    const results = await todoModel.find(matchStage);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//*
// For viewing one item (like details page)  #01
app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await todoModel.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//*
app.get("/todos/stats", async (req, res) => {
  try {
    const total = await todoModel.countDocuments();

    const locations = await todoModel.distinct("location");

    res.json({
      totalTodos: total,
      totalLocations: locations.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/todos/location/:location", async (req, res) => {
  try {
    const todos = await todoModel.find({
      location: req.params.location,
    });

    res.json({
      todos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching todos",
    });
  }
});

// //Start the server
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Server is listening to port " + port);
});