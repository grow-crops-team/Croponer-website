import express, { Router } from "express"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()
const staticPath = path.join(__dirname, "../../../admin/dist")


router.use(express.static(staticPath))
router.use("/assets", express.static(path.join(staticPath, "assets")))


router.get("/", (req, res) => { 
    res.sendFile(path.join(staticPath, "index.html"), (err) => {
        if (err) {
            res.status(500).send("Error loading index.html")
        }
    })
})


router.get("/manage-users", (req, res) => {
    res.sendFile(path.join(staticPath, "manage-user.html"), (err) => {
        if (err) {
            res.status(500).send("Error loading manage-user.html")
        }
    })
})

router.get("/task-panel", (req, res) => {
    res.sendFile(path.join(staticPath, "task-panel.html"), (err) => {
        if (err) {
            res.status(500).send("Error loading task-panel.html")
        }
    })
})

router.get("/admin-panel", (req, res) => {
    res.sendFile(path.join(staticPath, "admin-panel.html"), (err) => {
        if (err) {
            res.status(500).send("Error loading admin-panel.html")
        }
    })
})

router.get("/register-admin", (req, res) => {
    res.sendFile(path.join(staticPath, "admin-register.html"), (err) => {
        if (err) {
            res.status(500).send("Error loading admin-register.html")
        }
    })
})



router.use((req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();  
    res.status(404).sendFile(path.join(staticPath, "404.html"), (err) => {
        if (err) {
            res.status(500).send("Error loading 404.html");
        }
    });
})

export default router
