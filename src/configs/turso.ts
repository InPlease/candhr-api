import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

/* configuration in relation to .env native by nest was not working
   could be due to a wrong configuration, need to take a look
*/
dotenv.config();

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
