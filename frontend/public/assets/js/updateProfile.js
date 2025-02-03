import { displayMessage } from './utils.js'

const UpdateUserProfile = document.querySelector(".UpdateUserProfile")
const avatar = document.querySelector("#avatar")
const fullName = document.querySelector("#fullName")
const email = document.querySelector("#email")
const avatarPreview = document.getElementById("avatarPreview")

// Handle form submission
UpdateUserProfile.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    // Check if required fields are filled
    if (!fullName.value.trim() || !email.value.trim()) {
        displayMessage("error", "Full name and email are required!")
        return;
    }

    // Check if an avatar file is selected
    if (!avatar.files.length) {
        displayMessage("error", "Please upload an avatar!")
        return;
    }

    // Create FormData object
    const formdata = new FormData();
    formdata.append("avatar", avatar.files[0])
    formdata.append("fullName", fullName.value)
    formdata.append("email", email.value)

    try {
        const response = await fetch("/api/v1/users/update-account", {
            method: "PATCH",
            body: formdata, 
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        const result = await response.json()

        if (result.statuscode === 200) {
            displayMessage("success", result.message)
            setTimeout(() => {
                location.assign("/user-Profile/edit")
            }, 2000);
        } else {
            displayMessage("error", result.message)
        }
    } catch (error) {
        displayMessage("error", "An unexpected error occurred! Please try again.")
        console.error("Patch error:", error)
    }
})

// Avatar Preview Function
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
});

const cancelButton = document.querySelector("#cancelBtn")
cancelButton.addEventListener("click", () => {
    window.location.href = "/"
})
