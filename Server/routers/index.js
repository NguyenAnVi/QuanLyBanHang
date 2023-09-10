import express from "express";

import AccountRouter from "./account.router.js";
const router = express.Router();

export default () => {
  AccountRouter(router);
  return router;
};