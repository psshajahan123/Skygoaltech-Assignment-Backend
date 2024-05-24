import express from "express";
import bcrypt from "bcrypt";

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
    const hashedPassword = await bcrypt.hash(request.body.password, 10)
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
router.post("/login", async (request, response) => {
  console.log(request.body);
});


export default router;
