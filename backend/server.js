// Using Express
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors'); // 1. Import CORS
require("dotenv").config();
// Create an instance of express
const app = express();
// 2. Setup your single, explicit CORS rule right here!
app.use(cors({ 
  origin: 'https://f-zo9g.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json()); // Parsing JSON middleware         
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};
connectDB();
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

// ADD INDEXES HERE
todoSchema.index({ createdAt: -1 });
todoSchema.index({ location: "text", title: "text" });

// creating model
const todoModel = mongoose.model("Todo", todoSchema);

// Add this route to your active server.js code!
app.get("/todos/location/:location", async (req, res) => {
  try {
    const todos = await todoModel.find({
      location: req.params.location,
    });
    res.json({ todos });
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos", error: error.message });
  }
});

// Create a new todo item - CHANGED FROM router.post TO app.post AND FIXED model
app.post('/todos', async (req, res) => {
    try {
        const newTodo = new todoModel({
            title: req.body.title,
            description: req.body.description,
            location: req.body.location
        });
        
        // Save to MongoDB
        const savedTodo = await newTodo.save(); 
        
        // Send the document back to the frontend
        res.status(201).json(savedTodo); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a todo item
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

// Delete a todo item
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// PUT SUMMARY HERE
app.get("/todos/summary", async (req, res) => {
  try {
    const result = await todoModel.aggregate([
      { $match: {} },
      { $addFields: { titleLength: { $strLenCP: "$title" } } },
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
      { $sort: { totalTodos: -1 } },
      { $limit: 10 },
    ]);

    const total = await todoModel.countDocuments();
    res.json({ summary: result, totalTodos: total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Aggregation + Pagination
app.get("/todos", async (req, res) => {
  try {
    const { startDate, endDate, filterLocation, page = 1, limit = 5, search } = req.query;
    const skip = (page - 1) * limit;
    let matchStage = {};

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + "T23:59:59.999Z"),
      };
    }

    if (filterLocation && filterLocation.trim() !== "") {
      matchStage.location = { $regex: filterLocation, $options: "i" };
    }

    if (search && search.trim() !== "") {
      matchStage.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const result = await todoModel.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
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
    let matchStage = {};

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

app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await todoModel.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Not found" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/todos/stats", async (req, res) => {
  try {
    const total = await todoModel.countDocuments();
    const locations = await todoModel.distinct("location");
    res.json({ totalTodos: total, totalLocations: locations.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// Start server
const port = 8000;
app.listen(port, () => {
  console.log("Server is listening to port " + port);
});
