import {displayMessage,} from './utils.js'

const sendEmail = document.querySelector(".sendEmail")  
const cancelBtn = document.querySelector("#cancelBtn")

sendEmail.addEventListener("submit", async (evt) => {
    evt.preventDefault()

    const email = document.getElementById("email").value

    try {
        const response = await fetch("/api/v1/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })

        const result = await response.json()
        if (result.statuscode === 200) {
            displayMessage("success", result.message)
        } else {
            displayMessage("error", result.message)
        }
    } catch (error) {
        displayMessage("error", "Something went wrong! Try again.")
        console.error("Something went wrong! Try again.", error)
    }
})

// cancel button
cancelBtn.addEventListener("click", () => {
    window.location.href = "/"
})