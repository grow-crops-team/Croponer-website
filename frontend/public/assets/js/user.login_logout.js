import { loginValidateInput, showPassword, displayMessage, showLoader, hideLoader } from './utils.js'

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
            showLoader()

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

                    sessionStorage.setItem("isLoggedIn", true)
                    sessionStorage.setItem("userFullname", result.data.user.fullName)
                    sessionStorage.setItem("email", result.data.user.email)
                    sessionStorage.setItem("accessToken", result.data.accessToken)

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
            } finally {
                hideLoader()
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
    showLoader()
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
            displayMessage("success", result.message)
            sessionStorage.clear()
            window.location.href = "/"
        } else {
            displayMessage("error", result.message)
            console.error("Logout failed:", result.message)
        }
    } catch (error) {
        console.error("Logout error:", error)
    } finally {
        hideLoader()
    }
}

export { UserLogout }
