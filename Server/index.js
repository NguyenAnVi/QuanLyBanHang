import cors from "cors"
import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser";
import Locals from "./providers/local.js"
import {Database} from "./providers/database.js"
import customerRouter from "./routers/customer.router.js";
import employeeRouter from "./routers/employee.router.js";

const app = express()
const db = new Database();
db.init();

app.use(cors());
app.use(bodyParser.json({limit:'1gb'}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/", customerRouter());
app.use("/m", employeeRouter());

app.use((req, res) => {
  return res.status(404).json({
    message:"Resource not found",
    status: false,
  }).send();
});

app.listen(Locals.config().port, function () {
  console.log("Listening on port "+Locals.config().port+"!");
});