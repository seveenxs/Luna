import { Schema, model } from "mongoose";

export const userObject = {
    _id: { type: String, required: true },
    stardust: { type: Number, default: '-' }
  }

export const userSchema = new Schema(userObject);
export const userModel = model('LunaUsers', userSchema);