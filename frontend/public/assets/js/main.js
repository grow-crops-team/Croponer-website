import { UserLogout } from "./user.login_logout.js"

// ---------- Menu bar----------------------------
function openMenu() {
    const menuBar = document.querySelector("#menuBar")
    const menu = document.querySelector("#menu")
    // console.log(menuBar, menu);
    if (menu && menuBar) {
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
            // console.log("clicked");
            openMenu()
        })
        document.addEventListener("click", (evt) => {
            if (!menuBar.contains(evt.target) && !menu.contains(evt.target)) {
                menu.classList.remove("right-0")
                menu.classList.add("right-[-224px]")
            }
        })

    }
}
openMenu()

// ---------------------- Login Dropdown ----------------------
function openLoginDropdown() {
    const loginDropDowns = document.querySelectorAll("#loginDropDown")
    const loginDropDownMenus = document.querySelectorAll("#loginDropDownMenu")

    if (loginDropDowns && loginDropDownMenus) {

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
    }
}
openLoginDropdown()

// ---------- error and success messages for validation check
const setError = (element, message) => {
    // console.log(element)
    const formControl = element.parentElement
    // console.log(formControl)
    const errorMessage = formControl.querySelector(".error")
    // console.log(errorMessage)
    errorMessage.innerText = message
    element.classList.add("border-red-900");

}
const setSuccess = (element) => {
    const formControl = element.parentElement
    // console.log(formControl)
    const errorMessage = formControl.querySelector(".error")
    // console.log(errorMessage)
    errorMessage.innerText = ""
    element.classList.remove("border-red-900");
}

//--------------------- Toggle Eye Button-----------------
function showPassword(showPassWordBtn, password) {
    if (!showPassWordBtn || !password) {
        // console.error("One or more elements not found!")
        return;
    }
    showPassWordBtn.addEventListener("click", (evt) => {
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type)

        evt.target.classList.toggle("bi-eye-slash-fill")
        evt.target.classList.toggle("bi-eye-fill")
    })
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

// ----------- display message modal open and close  -------



function displayMessage(type, message) {
    const displayError = document.querySelector(".displayError");
    const messageElement = document.querySelector("#message");
    if (displayError && messageElement) {
        messageElement.textContent = message;
        displayError.classList.remove("hidden");
    } else {
        console.error("Message elements not found!");
    }
}


// ------- when the user logged in ---
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const username = localStorage.getItem("username") || ""

    const userAvatar = document.querySelector(".userAvatar")
    const userName = document.querySelector(".userName")
    const loginOptionDesktop = document.querySelector("#loginOptionDesktop")
    const loginOptionMobile = document.querySelector("#loginOptionMobile")

    const userProfileModal = document.querySelector("#userProfileModal")
    const searchBar = document.querySelector(".searchOption")
    // console.log(searchBar)
    // console.log(isLoggedIn, username, userAvatar, userName, loginOptionDesktop, loginOptionMobile, userProfileModal)

    // Ensure elements exist before modifying them
    if (userAvatar && userName && loginOptionDesktop && loginOptionMobile && userProfileModal && searchBar) {
        if (isLoggedIn) {
            // console.log("User is logged in.")
            userAvatar.classList.remove("hidden")
            userName.textContent = username
            loginOptionDesktop.classList.remove("lg:block")
            loginOptionMobile.classList.add("hidden")
            // searchBar.classList.remove("ml-14")
            searchBar.classList.add("ml-96")
        } else {
            // console.log("User is logged out.")
            userAvatar.classList.add("hidden")
            userName.textContent = "";
            loginOptionDesktop.classList.add("lg:block")
            loginOptionMobile.classList.remove("hidden")
        }
        if (userAvatar && userProfileModal) {
            userAvatar.addEventListener("click", (evt) => {
                evt.stopPropagation();
                userProfileModal.classList.toggle("hidden")
            })
            document.addEventListener("click", (evt) => {
                if (!userAvatar.contains(evt.target) && !userProfileModal.contains(evt.target)) {
                    userProfileModal.classList.add("hidden")
                }
            })
        }
    }
})
// ------------- when user logged out ------------
const logoutBtn = document.querySelector(".logout")
if (logoutBtn) {
    logoutBtn.addEventListener("click", (evt) => {
        UserLogout()
        localStorage.setItem("isLoggedIn", false)
    })
}


export { loginValidateInput, showPassword, signupValidateInput, displayMessage }