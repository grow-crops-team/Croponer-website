import mongoose,{Schema} from "mongoose";


const adminSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        }

    },
    {timestamps:true}
)

export const Admin = mongoose.model("Admin", adminSchema)