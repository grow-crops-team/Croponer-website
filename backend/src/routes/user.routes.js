import { Router } from "express"
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    uploadFiles,
    forgotPassword,
    resetPassword
  
} from "../controllers/user.controller.js"
import { upload, uploadMultiple } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)


router.route("/login").post(loginUser)

//secured routes 
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-account").patch(verifyJWT, upload, updateAccountDetails)
router.route("/upload-files").post(verifyJWT, uploadMultiple, uploadFiles)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)



export default router