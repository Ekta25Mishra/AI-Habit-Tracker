import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habits.js";
import logRoutes from "./routes/logs.js";
import aiRoutes from "./routes/ai.js";

import { notFound, errorHandler } from "./middleware/errorHandler.js";


const app = express();


// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-habit-tracker-ten.vercel.app"
];


const corsOptions = {
  origin: (origin, callback) => {

    // allow requests without origin
    // (Postman, mobile apps, server calls)
    if (!origin) {
      return callback(null, true);
    }


    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }


    console.log("Blocked by CORS:", origin);

    return callback(null, false);
  },


  credentials: true,


  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "OPTIONS"
  ],


  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],


  optionsSuccessStatus: 200
};


// IMPORTANT: CORS MUST COME FIRST
app.use(cors(corsOptions));


// Handle browser preflight requests
app.options("*", cors(corsOptions));


// Body parser
app.use(
  express.json({
    limit: "1mb"
  })
);



// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString()
  });
});



// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/habits", habitRoutes);

app.use("/api/logs", logRoutes);

app.use("/api/ai", aiRoutes);



// ===============================
// ERROR HANDLING
// ===============================

app.use(notFound);

app.use(errorHandler);



// ===============================
// SERVER START
// ===============================

const PORT = process.env.PORT || 8000;


connectDB()
  .then(() => {

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });

  })
  .catch((err) => {

    console.error("Database connection failed:", err);

    process.exit(1);

  });