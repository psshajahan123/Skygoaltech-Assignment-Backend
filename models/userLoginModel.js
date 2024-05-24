import mongoose from "mongoose";

const userLoginSchema = new mongoose.Schema(
  {
    username: {
      type: "String",
      required: true,
    },
    password: {
      type: "String",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserLogin = mongoose.model("UserLogin", userLoginSchema);
