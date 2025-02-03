
import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        images: [
            {
                url: {
                    type: String,
                    required: true 
                },
                publicId: {
                    type: String,
                    required: true // Public ID for Cloudinary (or another cloud service)
                }
            }
        ],
    },
    { timestamps: true }
)


const File = mongoose.model("File", fileSchema);

export default File;
