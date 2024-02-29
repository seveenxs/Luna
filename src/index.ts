import LunaClient from "@classes/Luna";

import dotenv from 'dotenv';
dotenv.config();

const client = new LunaClient({
    cosmics: ['1170153272984739893', '903186158937325569'],
    intents: 122627,
    token: process.env.LunaToken as string
});

import('./database/index');