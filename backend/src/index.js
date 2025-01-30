import  app  from "./app.js"
import 'dotenv/config'
import connectDB from "./db/database.js"

const port = process.env.PORT || 3000
 connectDB()

.then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is running on port: ${port}`)
        console.log(`Visit this link.... http://localhost:${port}`)
        
    })
})
.catch((error)=>{
    console.log("server Connection Error :", error)
    
})