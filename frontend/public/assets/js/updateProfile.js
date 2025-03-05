import { displayMessage } from './utils.js';

const coverImageInput = document.querySelector("#coverImage");
const avatarImageInput = document.querySelector("#avatar");
const userName = document.querySelector("#userName");
const profileUpdateForm = document.querySelector("#profileUpdateForm");
const fullName = document.querySelector("#fullName");
const email = document.querySelector("#email");
const phoneNumber = document.querySelector("#phoneNumber");
const userBio = document.querySelector("#bio");

// Address Fields
const country = document.querySelector("#country");
const state = document.querySelector("#state");
const district = document.querySelector("#district");
const village = document.querySelector("#village");
const pincode = document.querySelector("#pincode");
const streetAddress = document.querySelector("#streetAddress");

const cancelBtn = document.querySelector("#cancelBtn");

// Progress Bars
const coverProgressBar = document.querySelector("#coverProgress");
const avatarProgressBar = document.querySelector("#avatarProgress");

// 📌 Helper Function to Show Image Preview & Handle File Validation
function handleImagePreview(inputElement, previewElement, progressBarElement, maxSizeMB = 2) {
    const file = inputElement.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
        displayMessage("error", "Invalid file type. Please upload an image.");
        inputElement.value = "";
        return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        displayMessage("error", `File size should be less than ${maxSizeMB}MB.`);
        inputElement.value = "";
        return;
    }

    // Show progress bar
    progressBarElement.classList.remove("hidden");
    const reader = new FileReader();

    reader.onprogress = function (e) {
        if (e.lengthComputable) {
            const percentLoaded = Math.round((e.loaded / e.total) * 100);
            progressBarElement.style.width = percentLoaded + "%";
        }
    };

    reader.onload = function (e) {
        previewElement.src = e.target.result;
        progressBarElement.style.width = "100%";
        setTimeout(() => progressBarElement.classList.add("hidden"), 500);
    };

    reader.readAsDataURL(file);
}


coverImageInput.addEventListener("change", function (e) {
    handleImagePreview(coverImageInput, document.getElementById("coverPreview"), coverProgressBar);
});

avatarImageInput.addEventListener("change", function (e) {
    handleImagePreview(avatarImageInput, document.getElementById("avatarPreview"), avatarProgressBar);
});


document.getElementById("bio").addEventListener("input", function (e) {
    const maxLength = 250;
    const currentLength = e.target.value.length;
    const counter = document.getElementById("bioCounter");

    counter.textContent = currentLength;

    if (currentLength > maxLength) {
        e.target.value = e.target.value.substring(0, maxLength);
        counter.textContent = maxLength;
    }
});


profileUpdateForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    if (!fullName.value || !phoneNumber.value || !country.value || !state.value || !district.value || !village.value || !pincode.value) {
        displayMessage("error", "Please fill all the required fields");
        return;
    }

    // 🛠 Create FormData Object
    const formData = new FormData();
    formData.append("fullName", fullName.value);
    formData.append("email", email.value); // Email is disabled but still included
    formData.append("phoneNumber", phoneNumber.value);
    formData.append("bio", userBio.value);
    formData.append("country", country.value);
    formData.append("state", state.value);
    formData.append("district", district.value);
    formData.append("village", village.value);
    formData.append("pincode", pincode.value);
    formData.append("streetAddress", streetAddress.value);

    // 🖼️ Append Images Only If Selected
    if (coverImageInput.files[0]) formData.append("coverImage", coverImageInput.files[0]);
    if (avatarImageInput.files[0]) formData.append("avatarImage", avatarImageInput.files[0]);

    try {
        // 📨 Send FormData with PATCH Request
        const response = await fetch("/api/v1/users/update-account", {
            method: "PATCH",
            body: formData,
        });

        const result = await response.json();
        if (result.statuscode === 200) {
            displayMessage("success", result.message);
            setTimeout(() => {
                window.location.href = "/user-profile";
            }, 2000);
        } else {
            displayMessage("error", result.message);
        }
    } catch (error) {
        console.error("Profile update error:", error);
        displayMessage("error", "Something went wrong");
    }
});


cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/user-profile";
})



document.addEventListener("DOMContentLoaded", function () {
    // Profile Update Form & Tooltip
    const profileUpdateForm = document.getElementById("profileUpdateForm");
    const updateProfileBtn = document.getElementById("updateProfileBtn");

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip-message hidden absolute bg-gray-800 text-white text-sm px-2 py-1 rounded-md shadow-md";
    tooltip.textContent = "Make changes before updating!";
    document.body.appendChild(tooltip);

    const formInputs = profileUpdateForm.querySelectorAll("input, textarea, select");
    const initialValues = {};
    formInputs.forEach(input => initialValues[input.name] = input.value);

    function checkForChanges() {
        let isChanged = [...formInputs].some(input => 
            (input.type === "file" && input.files.length > 0) || 
            input.value !== initialValues[input.name]
        );

        updateProfileBtn.disabled = !isChanged;
        updateProfileBtn.classList.toggle("opacity-50", !isChanged);
        updateProfileBtn.classList.toggle("cursor-not-allowed", !isChanged);
    }

    formInputs.forEach(input => {
        input.addEventListener("input", checkForChanges);
        input.addEventListener("change", checkForChanges);
    });

    updateProfileBtn.addEventListener("mouseenter", function (event) {
        if (updateProfileBtn.disabled) {
            tooltip.classList.remove("hidden");
            tooltip.style.top = `${event.clientY + 10}px`;
            tooltip.style.left = `${event.clientX}px`;
        }
    });

    updateProfileBtn.addEventListener("mouseleave", function () {
        tooltip.classList.add("hidden");
    });

    updateProfileBtn.disabled = true;
    updateProfileBtn.classList.add("opacity-50", "cursor-not-allowed");

    // 📌 Address Autofill via Pincode
    const pincode = document.getElementById("pincode");
    const stateSelect = document.getElementById("state");
    const districtSelect = document.getElementById("district");

    pincode.addEventListener("input", async function () {
        if (pincode.value.trim().length === 6) {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode.value.trim()}`);
                const data = await response.json();

                if (data[0].Status === "Success") {
                    const postOffice = data[0].PostOffice[0];
                    stateSelect.innerHTML = `<option value="${postOffice.State}" selected>${postOffice.State}</option>`;
                    districtSelect.innerHTML = `<option value="${postOffice.District}" selected>${postOffice.District}</option>`;
                } else {
                    console.error("Invalid Pincode");
                }
            } catch (error) {
                console.error("Error fetching Pincode data:", error);
            }
        }
    });
});
