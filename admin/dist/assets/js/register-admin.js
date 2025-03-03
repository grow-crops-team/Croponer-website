import { displayMessage } from "./utils.js"

const adminRegister = document.querySelector("#adminRegister")
const username = document.querySelector("#username")
const fullName = document.querySelector("#fullName")
const email = document.querySelector("#email")
const password = document.querySelector("#password")
 
adminRegister.addEventListener("submit", async (evt) => {
    evt.preventDefault()

    const usernameValue = username.value
    const fullnameValue = fullName.value
    const emailValue = email.value
    const passwordValue = password.value


    try {
        const response = await fetch("/api/v1/admin/register-admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameValue,
                fullName: fullnameValue,
                email: emailValue,
                password: passwordValue
            })
        })

        const data = await response.json()

        if (data.statuscode === 201) {
            displayMessage("success", data.message)
           adminRegister.reset()
        } else {
            displayMessage("error", data.message)
        }

    } catch (error) {
        console.log("Fetch Error: ", error)
        displayMessage("error", "An error occurred. Please try again", error)

    }
})