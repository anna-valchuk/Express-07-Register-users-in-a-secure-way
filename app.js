require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome");
};
app.get("/", welcome);

const { validateMovie, validateUser } = require("./validators.js");

const movieHandlers = require("./movieHandlers");
const usersHandlers = require("./usersHandlers");
const userHandlers = require("./userHandlers");
const { hashPassword, verifyPassword, verifyToken } = require("./auth");

// the public routes

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersById);

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

// then the routes to protect

app.use(verifyToken);

app.put("/api/movies/:id", validateMovie, movieHandlers.postMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.post("/api/movies", validateMovie, movieHandlers.postMovie);

app.post("/api/users", hashPassword, validateUser, usersHandlers.postUsers);
app.put("/api/users/:id", validateUser, usersHandlers.updateUsers);
app.delete("/api/users/:id", usersHandlers.deleteUsers);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
