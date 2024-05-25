import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserRegister } from "../models/userRegisterModel.js";

const router = express.Router();

//Signup API
router.post("/signup", async (request, response) => {
  try {
    if (!request.body.name || !request.body.email || !request.body.password) {
      return response
        .status(400)
        .send({ message: "Send All Required Fields: name, email, password" });
    }
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    const newUser = {
      name: request.body.name,
      email: request.body.email,
      password: hashedPassword,
    };
    const user = await UserRegister.create(newUser);
  } catch (err) {
    console.log(err.message);
    response.status(500).send(err.message);
  }
});

//Login API
/* Here im using email as Username to verify */
router.post("/login", async (request, response) => {
  const { username, password } = request.body;
  //console.log(request.body)
  try {
    if (!username || !password) {
      return response
        .status(400)
        .send({ message: "username and password are required" });
    }
    /* email as username */
    const userDetails = await UserRegister.findOne({
      email: username,
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

export default router;
