import { Router } from "express"
import { getUser,createUser,deleteUser } from "../controllers/admin.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/users").get(getUser)
router.route("/Create-user").post(verifyJWT, createUser)
router.route("/delete-user/:id").delete(verifyJWT, deleteUser)

export default router