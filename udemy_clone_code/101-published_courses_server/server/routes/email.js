import express from "express";

const router = express.Router();

// middlewares
import { requireSignin } from "../middlewares";
// controller
const { supportEmail } = require("../controllers/email");

router.post("/contact-support", requireSignin, supportEmail);

module.exports = router;
