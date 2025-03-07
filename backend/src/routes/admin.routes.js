import { Router } from "express"
import {adminLogin,registerAdmin,logoutAdmin,refreshAccessToken, getAdmin, updateAdmin, getUser,createUser,deleteUser,getUserProfile,deleteAdmin } from "../controllers/admin.controller.js"
import {createTask,getTasks,updateTask,deleteTask} from '../controllers/task.controller.js'

import { verifyJWTAdmin } from "../middlewares/admin.auth.middleware.js"

const router = Router()
// admin control routes
router.route("/register-admin").post(registerAdmin)
router.route("/admin-login").post(adminLogin)
router.route("/admin-logout").post(verifyJWTAdmin, logoutAdmin)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update-admin/:id").patch(verifyJWTAdmin,updateAdmin)
router.route("/get-admin").get(verifyJWTAdmin,getAdmin)
router.route("/delete-admin/:id").delete(verifyJWTAdmin, deleteAdmin)


// user control routes
router.route("/users").get(getUser)
router.route("/get-userProfile").get(verifyJWTAdmin, getUserProfile)
router.route("/Create-user").post(verifyJWTAdmin, createUser)
router.route("/delete-user/:id").delete(verifyJWTAdmin, deleteUser)

//task routes

router.route("/tasks").post(createTask).get(getTasks)
router.route("/update-tasks/:id").patch(updateTask).delete(deleteTask)
  


export default router