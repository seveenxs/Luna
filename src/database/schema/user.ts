import { Schema, model } from "mongoose";

export const userObject = {
    _id: { type: String, required: true },
    stardust: { type: Number, default: 0 },
    blacklist: {
        banned: { type: String, default: '0' },
        timestamp: { type: Date,  default: +Date.now()}
    }
};

export const userSchema = new Schema(userObject);
export const userModel = model('LunaUsers', userSchema);
