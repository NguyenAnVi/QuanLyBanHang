import { existsSync, mkdirSync, readdirSync, unlinkSync } from "fs"
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
    const jwtSecret = process.env.JWT_SECRET;
    const createFolderIfNotExist = (dir)=>{
      if (!existsSync(dir)) {
        mkdirSync(dir);
      } else {
        readdirSync(dir, (err, files) => {
          if (err) throw err;
        
          for (const file of files) {
            unlinkSync(join(dir, file), (err) => {
              if (err) throw err;
            });
          }
        });
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
