import mongoose ,{Schema} from "mongoose"

const userSchema = new Schema(
    {
        userName:{
            type:String,
            required:[true,"Username is required"],
            unique:[true, "Username is already taken"],
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:[true, "Email is already taken"],
            trim:true,
            index:true
        },
        fullName:{
            type:String,
            required:[true,"Full Name is required"],
            trim:true,
            index:true
        },
        password:{
            type:String,
            required:[true,"Password is required"],
            trim:true,
            index:true
        },
        refreshToken:{
            type:String,
        }

    },
    {timestamps:true}
)





export const User = mongoose.model("User",userSchema)
