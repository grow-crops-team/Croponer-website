import express, { Router } from "express"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()
const staticPath = path.join(__dirname, "../../../admin/dist")

console.log("Admin Static Path:", staticPath) // Debugging line

// Serve static files (CSS, JS, images)
router.use(express.static(staticPath))
router.use("/assets", express.static(path.join(staticPath, "assets")))

// Load Admin Dashboard at `/admin`
router.get("/", (req, res) => { 
    res.sendFile(path.join(staticPath, "index.html"), (err) => {
        if (err) {
            res.status(500).send("Error loading index.html")
        }
    })
})

// Other Admin Pages
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

// Handle 404 Errors for Admin Pages
router.use((req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();  // Let API routes pass
    res.status(404).sendFile(path.join(staticPath, "404.html"), (err) => {
        if (err) {
            res.status(500).send("Error loading 404.html");
        }
    });
})

export default router
