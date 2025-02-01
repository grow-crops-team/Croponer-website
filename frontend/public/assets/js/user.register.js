import {
    signupValidateInput,
    showPassword,
    closeDisplayModal,
    displayMessage,
} from "./main.js"

const signupForm = document.querySelector("#signupFrom")
const username = document.querySelector("#username")
const fullName = document.querySelector("#fullName")
const userEmail = document.querySelector("#email")
const password = document.querySelector("#password")
const confirmPassword = document.querySelector("#confirmPassword")
const showPassWord = document.querySelector("#showPassword")
const signupBtn = document.querySelector("#submitBtn")

signupForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    if (
        signupValidateInput(
            username,
            fullName,
            userEmail,
            password,
            confirmPassword
        )
    ) {
        const formData = new FormData(evt.target)
        const data = {
            username: formData.get("username"),
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            password: formData.get("password"),
        };

        console.log("Sending data:", data) // Debugging

        try {
            const response = await fetch("/api/v2/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const text = await response.text() // Read response as text
            console.log("Raw response:", text) // Log raw response
            console.log("Response status:", response.status)// Log response status

            if (response.status === 201) {
                const result = JSON.parse(text) // Parse JSON only if status is 201
                displayMessage("success", result.message)
                signupForm.reset();
                setTimeout(() => {
                    window.location.href = "/"
                }, 3000)
            } else {
                let result
                try {
                    result = JSON.parse(text) // Try parsing JSON
                } catch (error) {
                    console.error("Error parsing JSON:", error)
                    throw new Error("Server returned invalid JSON: " + text)
                }
                displayMessage("error", result.error || "An error occurred")
            }
        } catch (error) {
            console.error("Fetch error:", error)
            displayMessage(
                "error",
                error.message || "An error occurred while processing your request"
            )
        }
    }
})

showPassword(showPassWord, password)
closeDisplayModal();
