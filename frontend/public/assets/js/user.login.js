import {loginValidateInput,displayMessage,showPassword,closeDisplayModal} from './main.js'

const username = document.querySelector("#username")
const password = document.querySelector("#password")
const loginForm = document.querySelector(".loginForm")
const loginBtn = document.querySelector(".loginBtn")
const showPassWord = document.querySelector("#showPassword")


loginForm.addEventListener("submit", async (evt) => {
    evt.preventDefault()
    if (loginValidateInput(username, password)) {
        const formData = new FormData(evt.target)
        const data = {
            username: formData.get('username').trim(),
            password: formData.get('password').trim()
        }
        try {
            const response = await fetch('/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()
            if (response.status === 200) {
                // console.log(result)
                displayMessage('success', result.message)
                loginForm.reset()
                setTimeout(() => {
                    window.location.href = "/"
                }, 3000)
            } else {
                // console.log(result)
                displayMessage('error', result.error)
            }
        } catch (error) {
            console.log("Data fetched error", error)
            displayMessage("An error occurred while processing your request", 'error')
        }
    }
})



showPassword(showPassWord,password)
closeDisplayModal()