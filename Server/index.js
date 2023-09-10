import cors from "cors"
import express from "express"
import bodyParser from "body-parser"
import router from "./routers/index.js"
import cookieParser from "cookie-parser";
import Locals from "./providers/local.js"
import {Database} from "./providers/database.js"

const app = express()
const db = new Database();
db.init();

app.use(cors());
app.use(bodyParser.json({limit:'1gb'}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/", router());

app.use((req, res) => {
  return res.status(404).json({
    message:"Resource not found",
    status: false,
  }).send();
});

app.listen(Locals.config().port, function () {
  console.log("Listening on port "+Locals.config().port+"!");
});