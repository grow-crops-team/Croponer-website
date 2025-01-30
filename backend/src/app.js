import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(express.static('public'))
app.use(cookieParser())

//import routes
// import userRoutes from './routes/user.routes.js'
import staticRoutes from './routes/static.routes.js'


//routes
// app.use('/api/v2/user', userRoutes)
app.use('/', staticRoutes)


export default app