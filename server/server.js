import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
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

app.put("/reviews", async function (req, res) {
  // console.log(reviewId);
  // console.log(req.body);
  const reviewId = req.body[0];
  const reviewLikes = req.body[1];
  // console.log(reviewId);
  // console.log(reviewLikes);
  // console.log(typeof reviewLikes);
  const result = await db.query("UPDATE reviews SET likes = $1 WHERE id = $2", [
    reviewLikes,
    reviewId,
  ]);
});

app.delete("/reviews/:id", async function (req, res) {
  const getReviewId = req.url.split("/", [3]);
  const reviewId = getReviewId[2];
  console.log(reviewId);
  const result = await db.query("DELETE FROM reviews WHERE id = $1", [
    reviewId,
  ]);
});

app.listen(8080, () => console.log("App is running on port 8080"));
