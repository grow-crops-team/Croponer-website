import { signupValidateInput, showPassword, displayMessage,showLoader,hideLoader } from './utils.js'

const userRegister = document.querySelector("#signupForm")


userRegister.addEventListener("submit", async (evt) => {
    evt.preventDefault()
    showLoader()
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
        // console.log(data)

        try {
            const response = await fetch("/api/v1/users/register", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            })

            const result = await response.json()

            // console.log("\n the json response(result) :", result)
            if (result.statuscode === 201) {

                displayMessage( result.message, "success")
                setTimeout(() => {
                    window.location.href = "/"
                }, 3000)

            }
            else {
                displayMessage( result.message, "error")
            }

        } catch (error) {
            displayMessage( "An unexpected error occurred! Please try again.", "error")
            console.error("Fetch error:", error)
        }finally{
            hideLoader()
        }


    }
})


const showPassWordBtn = document.querySelector("#showPassword")
const password = document.querySelector("#password")
// console.log(showPassWordBtn, password);

showPassword(showPassWordBtn, password)