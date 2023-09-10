import { existsSync, mkdirSync } from "fs"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import {dirname, join} from "path"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Locals {
  static config() {
    dotenv.config({ path: join(__dirname, "../.env") });
    const hostname = process.env.HOSTNAME;
    const port = process.env.PORT;
    const mongoUri = process.env.MONGO_URI;
    const createFolderIfNotExist = (dir)=>{
      if (!existsSync(dir)) {
        mkdirSync(dir);
      }
    }
    return {
      createFolderIfNotExist,
      port,
      mongoUri,
      jwtSecret,
      hostname
    };
  }
}
export default Locals;
