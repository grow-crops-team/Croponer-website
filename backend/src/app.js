import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import errorHandler from "./middlewares/errorHandler.middleware.js"


const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true 
}))

app.use(express.json({limit:"100kb"}))
app.use(express.urlencoded({extended:true, limit:"100kb"}))
app.use(express.static("public"))
app.use(express.static("dist"))
app.use(cookieParser())



//Importing Routes
import userRoutes from './routes/user.routes.js'
import staticRoutes from './routes/static.routes.js'
import adminRoutes from "./routes/admin.routes.js"
import adminStaticRoutes from './routes/admin.static.routes.js'
import visitorRoutes from './routes/visitor.routes.js'
import aiRoutes from "./routes/ai.routes.js";

//Routes Declaration
app.use("/admin", adminStaticRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/ai", aiRoutes);
app.use("/", staticRoutes)
app.use("/api", visitorRoutes);


//Error Handler
app.use(errorHandler)



export default app 