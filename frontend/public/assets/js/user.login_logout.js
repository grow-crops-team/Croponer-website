import { loginValidateInput, showPassword, displayMessage } from './utils.js'

const userLogin = document.querySelector("#loginForm")
const username = document.querySelector("#username")
const password = document.querySelector("#password")

if (userLogin) {
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
                // console.log("Login Data frontend:", result)
                

                if (result.statuscode === 200) {

                    displayMessage("success", result.message)

                    localStorage.setItem("isLoggedIn", true)
                    localStorage.setItem("username", result.data.user.fullName)

                    setTimeout(() => {
                        window.location.href = "/"
                    }, 3000)

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
}

// Show password function
const showPassWordBtn = document.querySelector("#showPassword")
// console.log( showPassWordBtn, password)
showPassword(showPassWordBtn, password)


// logout function
async function UserLogout() {
    try {
        const response = await fetch("/api/v1/users/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const result = await response.json()
        if (result.statuscode === 200) {
            alert(result.message)
            window.location.href = "/"
            
        } else {
            console.error("Logout failed:", result.message)
        }
    } catch (error) {
        console.error("Logout error:", error)
    }
}

export { UserLogout }
