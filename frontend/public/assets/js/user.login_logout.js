import { loginValidateInput, showPassword, displayMessage, showLoader, hideLoader } from './utils.js'

const userLogin = document.querySelector("#loginForm")
const username = document.querySelector("#username")
const password = document.querySelector("#password")

if (userLogin) {
    userLogin.addEventListener("submit", async (evt) => {
        showLoader()
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

                    sessionStorage.setItem("isLoggedIn", true)
                    sessionStorage.setItem("userID", result.data.user._id)
                    sessionStorage.setItem("userFullname", result.data.user.fullName)
                    sessionStorage.setItem("email", result.data.user.email)
                    sessionStorage.setItem("accessToken", result.data.accessToken)


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
            } finally {
                hideLoader()
            }

        }
    })
}

// Show password function
const showPassWordBtn = document.querySelector("#showPassword")
showPassword(showPassWordBtn, password)

// logout function
async function UserLogout() {
    showLoader() 
    try {
        const response = await fetch("/api/v1/users/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        if (response.ok) {
            displayMessage("success", data.message);
            sessionStorage.clear();

           
            setTimeout(() => {
                window.location.href = "/";
            }, 3000)

        } else {
            displayMessage("error", data.message);
        }
    } catch (error) {
        console.error("Logout error:", error);
        displayMessage("error", "An error occurred. Please check your connection.");
    } finally {
        hideLoader()
    }
}

export { UserLogout }
