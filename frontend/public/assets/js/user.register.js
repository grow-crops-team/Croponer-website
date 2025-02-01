import { signupValidateInput, showPassword, displayMessage } from './main.js'

const userRegister = document.querySelector("#signupForm")


userRegister.addEventListener("submit", async (evt) => {
    evt.preventDefault()
    const username = document.querySelector("#username")
    const fullName = document.querySelector("#fullName")
    const email = document.querySelector("#email")
    const password = document.querySelector("#password")
    const confirmPassword = document.querySelector("#confirmPassword")

    if (signupValidateInput(username, fullName, email, password, confirmPassword)) {
        const formdata = new FormData(evt.target)
        const data = {
            username: formdata.get("username").trim(),
            fullName: formdata.get("fullName").trim(),
            email: formdata.get("email").trim(),
            password: formdata.get("password").trim()
        }

        const response = await fetch("/api/v1/users/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()
        console.log("\n the json response(result) :", result)



    }
})


const showPassWordBtn = document.querySelector("#showPassword")
const password = document.querySelector("#password")
showPassword(showPassWordBtn, password)