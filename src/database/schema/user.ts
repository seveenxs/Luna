import { Schema, model } from "mongoose";

export const userObject = {
    _id: { type: String, required: true },
    stardust: { type: Number, default: 0 },
    blacklist: {
        banned: { type: Boolean, default: false },
        timestamp: { type: Date,  default: +Date.now()},
        reason: { type: String, default: 'sem razão' }
    }
};

export const userSchema = new Schema(userObject);
export const userModel = model('LunaUsers', userSchema);
