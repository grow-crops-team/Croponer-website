import { Router } from "express"
import { getUser,createUser,deleteUser } from "../controllers/admin.controller.js"
import {createTask,getTasks,updateTask,deleteTask} from '../controllers/task.controller.js'

import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
router.route("/admin-login").post(verifyJWT,adminLogin)
router.route("/get-admin").get(getAdmin)
router.route("/users").get(getUser)
router.route("/Create-user").post(verifyJWT, createUser)
router.route("/delete-user/:id").delete(verifyJWT, deleteUser)

//task routes

router.route("/tasks").post(createTask).get(getTasks)
router.route("/tasks/:id").put(updateTask).delete(deleteTask)
  


export default router