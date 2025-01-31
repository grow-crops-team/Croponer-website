import { signupValidateInput, showPassword, closeDisplayModal,displayMessage } from './main.js'


const signupForm = document.querySelector('#signupFrom')
const userName = document.querySelector('#username')
const fullName = document.querySelector('#fullName')
const userEmail = document.querySelector('#email')
const password = document.querySelector('#password')
const confirmPassword = document.querySelector('#confirmPassword')
const showPassWord = document.querySelector("#showPassword")
const signupBtn = document.querySelector("#submitBtn")



signupForm.addEventListener('submit', async (evt) => {
    evt.preventDefault()
    if (signupValidateInput(userName, fullName, userEmail, password, confirmPassword)) {
        const formData = new FormData(evt.target)
        const data = {
            userName: formData.get('userName'),
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            password: formData.get('password')
        }
        // console.log(data)// for testing
        try {
            const response = await fetch('/api/v2/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()
            if (response.status === 201) {
                // console.log(result)
                displayMessage('success', result.message)
                signupForm.reset()
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

showPassword(showPassWord, password)
closeDisplayModal()