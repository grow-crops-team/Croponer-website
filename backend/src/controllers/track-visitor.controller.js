import Visitor from "../models/visitor.model.js";
import axios from "axios";


async function getCountry(ip) {
    try {
        const response = await axios.get(`https://ipinfo.io/${ip}/json`);
        console.log("IP Info Response:", response.data);  // Debugging log
        
        return response.data.country || "Unknown";  
    } catch (error) {
        console.error("Error fetching country data:", error);
        return "Unknown";  
    }
}

// **Track Unique Visitors**
export async function trackVisitor(req, res) {
    console.log("🔥 trackVisitor function is running!");  // Debugging log

    const visitorIp = req.clientIp;  
    console.log("Visitor IP:", visitorIp);  // Check if IP is detected

    if (!visitorIp) {
        console.error("🚨 No IP detected!"); 
        return res.status(400).json({ error: "No IP detected" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingVisitor = await Visitor.findOne({ ip: visitorIp, date: { $gte: today } });

    if (existingVisitor) {
        console.log("✅ Visitor already exists for today:", existingVisitor);
    } else {
        const country = await getCountry(visitorIp);  
        const newVisitor = new Visitor({ ip: visitorIp, country });
        await newVisitor.save();
        console.log("✅ New visitor saved:", newVisitor);
    }

    const totalVisitors = await Visitor.countDocuments();
    console.log("Total Visitors Count:", totalVisitors);

    res.json({ totalVisitors });
}



export async function getVisitorByCountry(req, res) {
    const countryCounts = await Visitor.aggregate([
        { $group: { _id: "$country", count: { $sum: 1 } } }
    ]);
    res.json(countryCounts);
}
