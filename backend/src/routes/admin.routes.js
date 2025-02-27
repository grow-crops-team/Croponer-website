import { Router } from "express"
import {adminLogin,registerAdmin, getAdmin, updateAdmin, getUser,createUser,deleteUser } from "../controllers/admin.controller.js"
import {createTask,getTasks,updateTask,deleteTask} from '../controllers/task.controller.js'

import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
// admin control routes
router.route("/register-admin").post(registerAdmin)
router.route("/admin-login").post(adminLogin)
router.route("/update-admin").patch(verifyJWT,updateAdmin)
router.route("/get-admin").get(verifyJWT,getAdmin)


// user control routes
router.route("/users").get(getUser)
router.route("/Create-user").post(verifyJWT, createUser)
router.route("/delete-user/:id").delete(verifyJWT, deleteUser)

//task routes

router.route("/tasks").post(createTask).get(getTasks)
router.route("/update-tasks/:id").patch(updateTask).delete(deleteTask)
  


export default router