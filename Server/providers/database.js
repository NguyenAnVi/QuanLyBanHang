import mongoose from "mongoose";
import bluebird from "bluebird";
import Locals from "./local.js";

class Database {
  init() {
    mongoose.Promise = bluebird
    mongoose
      .connect(Locals.config().mongoUri)
      .then(() => {
        console.log("Connected to MongoDB!");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB: ", error);
        console.log(error);
        process.exit(1);
      });
  }
}
export {Database};
export default mongoose;
