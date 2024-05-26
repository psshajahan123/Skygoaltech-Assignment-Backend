import mongoose from "mongoose";

const userRegisterSchema = new mongoose.Schema(
  {
    username: {
      type: "String",
      required: true,
      unique: true,
    },
    email: {
      type: "String",
      required: true,
      unique: true,
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

export const UserRegister = mongoose.model("userRegister", userRegisterSchema);
