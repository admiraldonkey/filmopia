import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(
  cors({
    origin: "https://filmopia-1.onrender.com",
    headers: ["Content-Type"],
  })
);
app.options("*", cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.get("/", (req, res) => res.json("Root route"));

app.get("/reviews", async function (req, res) {
  const result = await db.query("SELECT * FROM reviews");
  const reviews = result.rows;
  res.json(reviews);
});

app.post("/reviews", async function (req, res) {
  // Get request body from form
  const { title, rating, review, fact, likes } = req.body;
  // Query the db
  const result = await db.query(
    "INSERT INTO reviews (title, rating, review, fact, likes) VALUES ($1, $2, $3, $4, $5)",
    [title, rating, review, fact, likes]
  );

  // Receive data from db
  res.json("Success!");
});

app.listen(8080, () => console.log("App is running on port 8080"));
