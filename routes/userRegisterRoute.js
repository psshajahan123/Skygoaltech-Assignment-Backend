import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserRegister } from "../models/userRegisterModel.js";

const router = express.Router();

const authenticateJWTToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT token");
  } else {
    jwt.verify(jwtToken, "Secret_Token", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.username = payload.username;
        next();
      }
    });
  }
};

//Signup API
router.post("/signup", async (request, response) => {
  const { username, email, password } = request.body;
  try {
    if (!username || !email || !password) {
      return response.status(400).send({
        message: "Send All Required Fields: username, email, password",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username: username,
      email: email,
      password: hashedPassword,
    };
    /*If user already exists */
    const userAlreadyExists = await UserRegister.findOne({ username });
    if (userAlreadyExists === null) {
      const user = await UserRegister.create(newUser);
      response.status(200).send("Your registration is successful");
    } else {
      response.status(400).send("User already exists");
    }
  } catch (err) {
    console.log(err.message);
    response.status(500).send(err.message);
  }
});

//Login API
router.post("/login", async (request, response) => {
  const { username, password } = request.body;
  //console.log(request.body)
  try {
    if (!username || !password) {
      return response
        .status(400)
        .send({ message: "username and password are required" });
    }
    const userDetails = await UserRegister.findOne({
      username: username,
    });
    if (userDetails === null) {
      response.status(400);
      response.send("Invalid User");
    } else {
      const isPasswordMatched = await bcrypt.compare(
        password,
        userDetails.password
      );
      /*checking password */
      if (isPasswordMatched === true) {
        const payload = {
          username: username,
        };
        const jwtToken = await jwt.sign(payload, "Secret_Token");
        response.status(200).send({ jwtToken });
      } else {
        response.status(400);
        response.send("Invalid Password");
      }
    }
  } catch (err) {
    console.log(err.message);
    response.status(500).send(err.message);
  }
});

//userDetails API
router.get("/user", authenticateJWTToken, async (request, response) => {
  let { username } = request;
  const user = await UserRegister.findOne({ username });
  response.status(200).send(user);
});

//Change password API
router.put("/change-password", async (request, response) => {
  try {
    const { username, oldPassword, newPassword } = request.body;
    if (!username || !oldPassword || !newPassword) {
      response.status(403).send({
        message: "Send all required fields: ueername, oldpassword, newpassword",
      });
    }
    const dbUser = await UserRegister.findOne({ username });
    if (dbUser === null) {
      response.status(400);
      response.send("User not registered");
    } else {
      const isOldPasswordMatched = await bcrypt.compare(
        oldPassword,
        dbUser.password
      );
      if (isOldPasswordMatched === true) {
        if (newPassword.length < 5) {
          response.status(400);
          response.send("Password is too short");
        } else {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          await UserRegister.updateOne(
            { username },
            { $set: { password: hashedPassword } }
          );
          response.send("Password updated successfully");
        }
      } else {
        response.status(400);
        response.send("Invalid current password");
      }
    }
  } catch (error) {
    console.log(error.message);
    response.status(500).send(error.message);
  }
});

//Delete user API when logged In
router.delete("/delete", authenticateJWTToken, async (request, response) => {
  try {
    const { username } = request;
    const dbUser = await UserRegister.findOne({ username });
    if (dbUser === null) {
      response.status(404).send("User not found");
    } else {
      await UserRegister.deleteOne({ username });
      response.status(200).send("User deleted successfully");
    }
  } catch (err) {
    console.log(err.message);
    response.status(500).send(err.message);
  }
});

//Delete user API by ID
router.delete(
  "/delete/:id",
  authenticateJWTToken,
  async (request, response) => {
    try {
      const { _id } = request.params.id;
      const dbUser = await UserRegister.findById(_id);
      if (dbUser === null) {
        response.status(404).send("User not found");
      } else {
        await UserRegister.findByIdAndDelete(id);
        response.status(200).send("User deleted successfully");
      }
    } catch (err) {
      console.log(err.message);
      response.status(500).send(err.message);
    }
  }
);

export default router;
