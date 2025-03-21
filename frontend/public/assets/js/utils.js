//--------------------- Toggle Eye Button-----------------
function showPassword(showPassWordBtn, password) {
    if (showPassWordBtn && password) {
        showPassWordBtn.addEventListener("click", (evt) => {
            const type = password.getAttribute("type") === "password" ? "text" : "password"
            password.setAttribute("type", type)
    
            evt.target.classList.toggle("bi-eye-slash-fill")
            evt.target.classList.toggle("bi-eye-fill")
        })
    }
}

// ---------- error and success messages for validation check
const setError = (element, message) => {
    // console.log(element)
    const formControl = element.parentElement
    // console.log(formControl)
    const errorMessage = formControl.querySelector(".error")
    // console.log(errorMessage)
    errorMessage.innerText = message
    element.classList.add("border-red-700");

}
const setSuccess = (element) => {
    const formControl = element.parentElement
    // console.log(formControl)
    const errorMessage = formControl.querySelector(".error")
    // console.log(errorMessage)
    errorMessage.innerText = ""
    element.classList.remove("border-red-900");
}

// --------- checking user registration form  ------------------
const signupValidateInput = (userName, fullName, userEmail, password, confirmPassword) => {
    let isValid = true;
    const userNameValue = userName.value.trim()
    const fullNameValue = fullName.value.trim()
    const emailValue = userEmail.value.trim()
    const passwordValue = password.value.trim()
    const confirmPasswordValue = confirmPassword.value.trim()
    //------------- For Username----------------
    if (userNameValue === "") {
        setError(userName, "* Username cannot be blank")
        isValid = false
    }
    else if (userNameValue.length < 4) {
        setError(userName, "* Username must be atleast 4 characters")
        isValid = false
    }
    else if (userNameValue.length > 10) {
        setError(userName, "* Username must be less than 10 characters")
        isValid = false
    }

    else if (userNameValue !== userNameValue.toLowerCase()) {
        setError(userName, "* Username must be in lowercase")
        isValid = false
    }

    else if (/[^a-z0-9_]/.test(userNameValue)) {
        setError(userName, "* username contains only letter and number .");
        isValid = false
    }
    else {
        setSuccess(userName)

    }
    // ------------- for Full Name--------------
    if (fullNameValue === "") {
        setError(fullName, "* Fullname cannot be blank")
        isValid = false
    }
    else if (fullNameValue.length < 6) {
        setError(fullName, "* Name is too short")
        isValid = false
    }
    else if (/[^a-zA-Z\s]/.test(fullNameValue)) {
        setError(fullName, "* Name must be contains only letters")
        isValid = false
    }
    else {
        setSuccess(fullName)
    }
    //----------for  email--------------
    if (emailValue === "") {
        setError(email, "* Email cannot be blank")
        isValid = false
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue)) {
        setError(email, "* Email is invalid")
        isValid = false
    }
    else {
        setSuccess(email)

    }
    //------------for password--------------
    if (passwordValue === "") {
        setError(password, "* Password cannot be blank")
        isValid = false
    }
    else if (passwordValue.length < 8) {
        setError(password, "* password must be atleast 8 character")
        isValid = false
    }

    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^]).{8,}$/.test(passwordValue)) {
        setError(password, "* Password must contain atleast one uppercase, one lowercase, one number and one special character")
        isValid = false
    }
    else {
        setSuccess(password)
    }
    //------------for confirm password--------------
    if (confirmPasswordValue === "") {
        setError(confirmPassword, "* Confirm Password cannot be blank")
        isValid = false
    }
    else if (confirmPasswordValue !== passwordValue) {
        setError(confirmPassword, "Password does not match")
        isValid = false
    }
    else {
        setSuccess(confirmPassword)
    }
    return isValid
}

// ----------------------  checking user login form------
const loginValidateInput = (username, password) => {
    let isValid = true;
    const usernameValue = username.value.trim()
    const passwordValue = password.value.trim()

    //------------- For Username----------------
    if (usernameValue === "") {
        setError(username, "* Username cannot be blank")
        isValid = false
    } else {
        setSuccess(username)
    }

    //------------ For Password--------------
    if (passwordValue === "") {
        setError(password, "* Password cannot be blank")
        isValid = false
    } else {
        setSuccess(password)
    }

    return isValid
}

const resetPasswordValidateInput = (newPassword, confirmPassword) => {
    let isValid = true
    const newPasswordValue = newPassword.value.trim()
    const confirmPasswordValue = confirmPassword.value.trim()
    //------------for password--------------

    if (newPasswordValue.length < 8) {
        setError(newPassword, "* password must be atleast 8 character")
        isValid = false
    }

    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^]).{8,}$/.test(newPasswordValue)) {
        setError(oldPassword, "* Password must contain atleast one uppercase, one lowercase, one number and one special character")
        isValid = false
    }
    else {
        setSuccess(newPassword)
    }

    //------------for confirm password--------------
    if (confirmPasswordValue.length < 8) {
        setError(confirmPassword, "* password must be atleast 8 character")
        isValid = false
    }
    else if (confirmPasswordValue !== newPasswordValue) {
        setError(confirmPassword, "Password does not match")
        isValid = false
    }
    else {
        setSuccess(confirmPassword)
    }
    return isValid
}

// const updateValidateInput = ( oldPassword, newPassword) => {
//     let isValid = true;
//     const oldPasswordValue = oldPassword.value.trim()
//     const newPasswordValue = newPassword.value.trim()


//     //------------for password--------------

//     if (oldPasswordValue.length < 8) {
//         setError(oldPassword, "* password must be atleast 8 character")
//         isValid = false
//     }

//     else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^]).{8,}$/.test(oldPasswordValue)) {
//         setError(oldPassword, "* Password must contain atleast one uppercase, one lowercase, one number and one special character")
//         isValid = false
//     }
//     else {
//         setSuccess(oldPassword)
//     }

//     //------------for confirm password--------------
//     if (newPasswordValue.length < 8) {
//         setError(newPassword, "* password must be atleast 8 character")
//         isValid = false
//     }

//     else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^]).{8,}$/.test(newPasswordValue)) {
//         setError(newPassword, "* Password must contain atleast one uppercase, one lowercase, one number and one special character")
//         isValid = false
//     }
//     else {
//         setSuccess(newPassword)
//     }
//     return isValid
// }

// ---------------------- Display Message ----------------------
function displayMessage(text, type = 'error') {
    const messageElement = document.getElementById('displayMessage');
    const messageContent = document.getElementById('messageContent');
    const messageText = document.getElementById('message');
    
    // Reset any existing animation
    messageElement.classList.add('hidden');
    void messageElement.offsetWidth; // Trigger reflow
    
    // Set message content
    messageText.textContent = text;
    
    // Set message type
    messageContent.className = type === 'success' ? 'message-type-success' : 'message-type-error';
    
    // Show message
    messageElement.classList.remove('hidden');
    
    // Auto-hide after animation completes
    setTimeout(() => {
      messageElement.classList.add('hidden');
    }, 3600); // Match the total animation duration
  }
  
  // Examples of usage:
  // showMessage('Something went wrong!', 'error');
  // showMessage('Operation completed successfully!', 'success');


// function for Loader 

function showLoader() {
    const loader = document.querySelector("#loader")
    if (loader) {
       loader.classList.remove("hidden")
        
        
    }
}

function hideLoader() {
    const loader = document.querySelector("#loader")
    if (loader) {
        loader.classList.add("hidden")
        
    }
}


export { loginValidateInput, showPassword, signupValidateInput, displayMessage, hideLoader, showLoader, resetPasswordValidateInput }