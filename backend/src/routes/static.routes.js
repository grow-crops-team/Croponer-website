import express, { Router } from "express"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()
const staticPath = path.join(__dirname, "../../../frontend/public")
router.use(express.static(staticPath))


router.route("/")
    .get((req, res) => {
        res.sendFile(path.join(staticPath, "index.html"), (err) => {
            if (err) {
                res.status(500).send("Error loading index.html")
            }
        })
    })


router.route("/register")
    .get((req, res) => {
        res.sendFile(path.join(staticPath, "userRegister.html"), (err) => {
            if (err) {
                res.status(500).send("Error loading userRegister.html")
            }
        })
        // console.log(req.url)

    })



router.route("/login")
    .get((req, res) => {
        res.sendFile(path.join(staticPath, "userLogin.html"), (err) => {
            if (err) {
                res.status(500).send("Error loading userLogin.html")
            }
        })
        // console.log(req.url)
    })


router.route("/about")
    .get((req, res) => {
        res.sendFile(path.join(staticPath, "aboutpage.html"), (err) => {
            if (err) {
                res.status(500).send("Error loading aboutpage.html")
            }
        })
        // console.log(req.url)
    })


router.route("/research")
    .get((req, res) => {
        res.sendFile(path.join(staticPath, "research.html"), (err) => {
            if (err) {
                res.status(500).send("Error loading research.html")
            }
        })
        // console.log(req.url)
    })


router.use((req, res, next) => {
    res.status(404).sendFile(path.join(staticPath, "404.html"), (err) => {
        if (err) {
            res.status(500).send("Error loading 404.html");
        }
    });
});


export default router