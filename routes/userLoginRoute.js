import express from "express";
import bcrypt from "bcrypt";

import { UserLogin } from "../models/userLoginModel.js";

const router = express.Router();

router.post("/login", async (request, response) => {
  console.log(request.body);
});

export default router;
