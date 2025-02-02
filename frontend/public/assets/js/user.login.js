import { loginValidateInput, showPassword, displayMessage } from './main.js'

const userLogin = document.querySelector("#loginForm")
const username = document.querySelector("#username")
const password = document.querySelector("#password")



userLogin.addEventListener("submit", async (evt) => {
    evt.preventDefault()
    if (loginValidateInput(username, password)) {
        const formdata = new FormData(evt.target)
        const data = {
            username: formdata.get("username").trim(),
            password: formdata.get("password").trim()
        }
        // console.log(data)

        try {
            const response = await fetch("/api/v1/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            })

            const result = await response.json()
            console.log("Login Data frontend:", result)
            if (result.statuscode === 200) {

                displayMessage("success", result.message)

                localStorage.setItem("isLoggedIn", true)
                
                setTimeout(() => {
                    window.location.href = "/"
                }, 2000)

            }
            else {
                displayMessage("error", result.message)
            }


        } catch (error) {
            displayMessage("error", "An unexpected error occurred! Please try again.")
            console.error("Fetch error:", error)
        }

    }
})



const showPassWordBtn = document.querySelector("#showPassword")
showPassword(showPassWordBtn, password)
