
import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

// File size limit (5MB for example)
const fileSizeLimit = 5 * 1024 * 1024 // 5MB

// Create single file upload middleware
const upload = multer({
    storage,
    limits: { fileSize: fileSizeLimit }, 
}).single("avatar")

// Create multiple file upload middleware
const uploadMultiple = multer({
    storage,
    limits: { fileSize: fileSizeLimit }, 
}).array("images", 10)

export { upload, uploadMultiple }
