const express = require("express");
const userRouter = express.Router();
const {
  getUserById,
  getUser,
  getUsers,
  getUserByEmail,
  getUsersReservations,
  createUser,
} = require("../db");

const jwt = require("jsonwebtoken");

const { requireUser } = require("./utils");

// {baseUrl}/users/id
// userRouter.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await getUserById(id);
//     res.send(result);
//   } catch (err) {
//     res.send({ err, message: "something went wrong" });
//   }
// });

// {baseUrl}/users/me
userRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    if (req.user) {
      const userReservations = await getUsersReservations(req.user.id);
      console.log(userReservations);
      req.user.books = userReservations;
      res.send(req.user);
    } else {
      res.send("Error, make sure you're logged in correctly.");
    }
  } catch (err) {}
});

userRouter.post("/register", async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;
  
  try {
    if (!email || !password) {
      res.status(400).send({
        name: "MissingCredentialsError",
        message: "All fields are required"
      });
      return;
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400).send({
        name: "UserExistsError",
        message: "A user with that email already exists"
      });
      return;
    }

    const user = await createUser({ firstname, lastname, email, password });
    if (user) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1w" }
      );

      res.send({
        message: "Registration Successful!",
        token,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
      });
    } else {
      res.status(500).send({
        name: "RegistrationError",
        message: "Error registering user",
      });
    }
  } catch (err) {
    next(err);
  }
});

userRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both an email and password!",
    });
  }
  try {
    const result = await getUser(req.body);
    if (result) {
      // create your token here and send with user id and email
      const token = jwt.sign({ id: result.id, email }, process.env.JWT_SECRET, {
        expiresIn: "1w",
      });
      res.send({ message: "Login successful", token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
