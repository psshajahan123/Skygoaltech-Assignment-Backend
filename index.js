import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/userRegisterRoute.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", router)

const port = process.env.PORT;

mongoose.connect(process.env.MONGODBURL).then(() => {
  console.log("DB connected Successfully");
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
