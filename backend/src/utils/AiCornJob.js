import cron, { CronJob } from "cron";
import axios from "axios";
import File from "../models/files.model.js"; 

// AI Model API Endpoint
const AI_MODEL_URL = "http://127.0.0.1:8000/predict_url";  

// Function to process images
const processPendingImages = async () => {
    try {
        console.log("Checking for new images to process...");

        // Find images that have no AI recommendation
        const files = await File.find({ 
            "images.status": "Processing",
        });
        // console.log(files);

        if (files.length === 0) {
            console.log("No new images to process.");
            return;
        }

        for (const file of files) {
            for (const image of file.images) {
                if (!image.ai_recommendation) {
                    console.log(`Processing image: ${image.url}`);

                    try {
                        // Modified to match our AI model's API format
                        const response = await axios.post(AI_MODEL_URL, {
                            url: image.url  // Changed from imageUrl to file
                        });
console.log(response);

                        // Check for predictions in the response
                        if (response.data.predictions) {  // Changed from recommendations to predictions
                            // Update database with AI recommendation
                            image.ai_recommendation = response.data.predictions;
                            // Add status and processed timestamp
                            image.status = 'Completed';
                            image.processedAt = new Date();
                            await file.save();
                            console.log(`AI recommendation saved for image: ${image.url}`);
                        } else {
                            console.error(`No predictions received for image: ${image.url}`);
                           
                           
                        }
                    } catch (error) {
                        console.error(`Error processing image ${image.url}:`, error.message);
                      
            
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error processing images:", error);
    }
};

const Job = new CronJob("*/1 * * * *", async()=>{
    console.log("Running AI Processing Cron Job...");
    await processPendingImages();
});

Job.start();
console.log("AI Cron Job Initialized! Running every 5 minutes...");

export { processPendingImages };