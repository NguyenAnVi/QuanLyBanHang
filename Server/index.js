import cors from "cors"
import path from 'path';
import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser";
import Locals from "./providers/local.js"
import { Database } from "./providers/database.js"
import customerRouter from "./routers/customer.router.js";
import employeeRouter from "./routers/employee.router.js";
import { fileURLToPath } from 'url';

const app = express()
const db = new Database();
const __dirname = fileURLToPath(import.meta.url);

[
  './public',
  './public/storage',
  './public/storage/products',
].forEach((path) => {
  Locals.config().createFolderIfNotExist(path);
});

db.init();

app.use(cors());
app.use(bodyParser.json({ limit: '1gb' }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/c", customerRouter());
app.use("/m", employeeRouter());

app.use("/", (req, res) => {
  return res
    .status(200)
    .json({ message: Locals.config().quote })
    .send()
})

app.use((req, res) => {
  return res.status(404).json({
    message: "Resource not found",
    status: false,
  }).send();
});

app.listen(Locals.config().port, function () {
  console.log("Listening on port " + Locals.config().port + "!");
});