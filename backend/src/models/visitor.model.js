import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
    ip: String,
    country: String,
    date: { type: Date, default: Date.now }
});

const Visitor = mongoose.model("Visitor", visitorSchema);
export default Visitor;
