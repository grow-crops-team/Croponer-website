import express from "express";
import { processPendingImages } from "../utils/AiCornJob.js"; 

const router = express.Router();

// router.route("/process").post(processPendingImages)
router.post("/process", async (req, res) => {
    try {
        await processPendingImages();
        
    } catch (error) {
        console.error("Error processing images:", error);
       
    }
});

export default router;
