// ---------- Menu bar----------------------------
const menuBar = document.querySelector("#menuBar")
const menu = document.querySelector("#menu")

function openMenu() {
    if (menu.classList.contains("right-0")) {
        menu.classList.remove("right-0")
        menu.classList.add("right-[-224px]")
    }
    else {
        menu.classList.remove("right-[-224px]")
        menu.classList.add("right-0")
    }
}
menuBar.addEventListener("click", (evt) => {
    openMenu()
})
document.addEventListener("click", (evt) => {
    if (!menuBar.contains(evt.target) && !menu.contains(evt.target)) {
        menu.classList.remove("right-0")
        menu.classList.add("right-[-224px]")
    }
})

// ---------------------- Login Dropdown ----------------------

const loginDropDowns = document.querySelectorAll("#loginDropDown")
const loginDropDownMenus = document.querySelectorAll("#loginDropDownMenu")

loginDropDowns.forEach((dropDown, index) => {
    dropDown.addEventListener("click", (evt) => {
        // console.log("open");
        loginDropDownMenus[index].classList.toggle("hidden")
    })
    dropDown.addEventListener("mouseover", (evt) => {
        // console.log("open");
        loginDropDownMenus[index].classList.remove("hidden")
    })
})

document.addEventListener("click", (evt) => {
    loginDropDowns.forEach((dropDown, index) => {
        if (!dropDown.contains(evt.target) && !loginDropDownMenus[index].contains(evt.target)) {
            // console.log("close");
            loginDropDownMenus[index].classList.add("hidden")
        }
    })
})




// ----------------------  checking user login form------
const loginValidateInput = () => {
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
//-------------------------------- Toggle Eye Button-----------------
const showPassWord = document.querySelector("#showPassword")
function showPassword() {
    showPassWord.addEventListener("click", (evt) => {
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type)

        evt.target.classList.toggle("bi-eye-slash-fill")
        evt.target.classList.toggle("bi-eye-fill")
    })
}

// ---------------- checking user registration form  ------------------
const signupValidateInput = () => {
    let isValid = true;
    const userNameValue = userName.value.trim()
    const fullNameValue = fullName.value.trim()
    const emailValue = email.value.trim()
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
        setError(password, "* username contains only letter and number .");
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


export { loginValidateInput, showPassword , signupValidateInput }