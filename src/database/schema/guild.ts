import { Schema, model } from "mongoose";

export const guildObject = {
    _id: { type: String, required: true },
    prefix: { type: String, default: '-' }
  }

export const guildSchema = new Schema(guildObject);
export const guildModel = model('LunaGuilds', guildSchema);