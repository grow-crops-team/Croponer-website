import express from "express";
import { trackVisitor, getVisitorByCountry } from "../controllers/track-visitor.controller.js";
import requestIp from "request-ip";

const router = express.Router();
router.use(requestIp.mw());

console.log("🚀 Visitor routes loaded");  // Debugging log


router.use((req, res, next) => {
    req.clientIp = requestIp.getClientIp(req) || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    next();
});


router.get("/visitor", (req, res) => {
    console.log("🟢 /visitor route accessed!");
    console.log("Client IP:", req.clientIp);
    trackVisitor(req, res);
});


router.get("/visitor-countries", (req, res) => {
    console.log("🟢 /visitor-countries route accessed");
    getVisitorByCountry(req, res);
});

export default router;
