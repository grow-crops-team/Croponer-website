import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true 
}))

app.use(express.json({limit:"100kb"}))
app.use(express.urlencoded({extended:true, limit:"100kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//Importing Routes
import userRoutes from './routes/user.routes.js'
import staticRoutes from './routes/static.routes.js'

//Routes Declaration
app.use("/api/v1/users", userRoutes)
app.use("/", staticRoutes)




export { app }