import mongoose, { connect } from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        const mongoDBInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB Successfully Connected! DB Host: ${mongoDBInstance.connection.host}`)
    } catch (error) {
        console.log("Mongodb Connection Failed", error)
        process.exit(1);
    }
};
export default connectDB