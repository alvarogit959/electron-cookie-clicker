import { Inngest } from 'inngest';
import dotenv from 'dotenv';
dotenv.config();

export const inngest = new Inngest({
  id: 'serverCookie',
  key: process.env.INNGEST_KEY
});
