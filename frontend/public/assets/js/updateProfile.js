import { displayMessage,showLoader,hideLoader } from './utils.js'

const UpdateUserProfile = document.querySelector("#UpdateUserProfile")
const avatar = document.querySelector("#avatar")
const fullName = document.querySelector("#fullName")
const email = document.querySelector("#email")
const avatarPreview = document.querySelector("#avatarPreview")
const oldPassword = document.querySelector("#oldPassword")
const newPassword = document.querySelector("#newPassword")


// Handle form submission
UpdateUserProfile.addEventListener("submit", async (evt) => {
    evt.preventDefault()

    if (!fullName.value.trim() || !email.value.trim()) {
        displayMessage("error", "Full name and email are required!")
        return
    }
    if (!avatar.files.length) {
        displayMessage("error", "There is no avatar file selected")
    }
    // Check if user wants to update the password
    // const isPasswordUpdate = oldPassword.value.trim() || newPassword.value.trim()
    // if (isPasswordUpdate) {
    //     if (!oldPassword.value.trim() || !newPassword.value.trim()) {
    //         displayMessage("error", "Both passwords are required for password change!")
    //         return
    //     }
    //     if (!updateValidateInput(oldPassword.value, newPassword.value)) {
    //         return
    //     }
    // }

    const formdata = new FormData();
    formdata.append("avatar", avatar.files[0])
    formdata.append("fullName", fullName.value)
    formdata.append("email", email.value)
    // formdata.append("oldPassword", oldPassword.value)
    // formdata.append("newPassword", newPassword.value)
showLoader()
    try {
        const response = await fetch("/api/v1/users/update-account", {
            method: "PATCH",
            body: formdata,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        });

        const result = await response.json()

        // console.log(result)

        if (result.statuscode === 200) {
            displayMessage("success", result.message)
            sessionStorage.setItem("avatar", result.data.avatar)
            sessionStorage.setItem("userFullname", result.data.fullName)
            sessionStorage.setItem("email", result.data.email)

        } else {
            displayMessage("error", result.message)
        }
    } catch (error) {
        displayMessage("error", "An unexpected error occurred! Please try again.")
        console.error("Patch error:", error)
    }finally{
        hideLoader()
    }

})

avatar.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
        // Validate file type (only images allowed)
        if (!file.type.startsWith("image/")) {
            displayMessage("error", "Invalid file type. Please upload an image.")
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            avatarPreview.src = e.target.result
        }
        reader.readAsDataURL(file)
    }
})

// click cancel button 
const cancelButton = document.querySelector("#cancelBtn")
cancelButton.addEventListener("click", () => {
    UpdateUserProfile.reset()
    window.location.href = "/"
})


// when use update the details and reload 
document.addEventListener("DOMContentLoaded", (evt) => {
    const newSrc = sessionStorage.getItem("avatar") || "./assets/images/avatar/person_circle.svg"
    avatarPreview.src = newSrc
    fullName.value = sessionStorage.getItem("userFullname") || ""
    email.value = sessionStorage.getItem("email") || ""
})

// show password function
// const showPassWordBtn = document.querySelectorAll("#showPassword")
// showPassWordBtn.forEach((btn) => {
//     const password = btn.previousElementSibling
//     showPassword(btn, password)
// })

