import Repository from "./repository";
import mongoose from "mongoose";
import colorize from "strcolorize";

import { userModel, userObject } from "./schema/user";
import { guildModel, guildObject } from "./schema/guild";

import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.LunaDatabase as string)
.then(() => colorize('[Database](#328da8) successful to connect.', true))
.catch((error) => colorize(`[Database](#a83242) failed to connect. \n${error}`, true));

export const lunaDB = {
    user: new Repository(userModel, userObject),
    guild: new Repository(guildModel, guildObject)
};