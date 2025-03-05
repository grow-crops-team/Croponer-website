import {displayMessage} from './utils.js'

const coverImageInput = document.querySelector("#coverImage")
const avatarImageInput = document.querySelector("#avatar")
const userName = document.querySelector("#userName")
const profileUpdateForm = document.querySelector("#profileUpdateForm")
const fullName = document.querySelector("#fullName")
const email = document.querySelector("#email")
const phoneNumber = document.querySelector("#phoneNumber")
const userBio = document.querySelector("#bio")
// address
const country = document.querySelector("#country")
const state = document.querySelector("#state")
const district = document.querySelector("#district")
const village = document.querySelector("#village")
const pincode = document.querySelector("#pincode")
const streetAddress = document.querySelector("#streetAddress")

const cancelBtn = document.querySelector("#cancelBtn")

// Cover image preview
coverImageInput.addEventListener("change", function (e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = function (e) {
        document.getElementById("coverPreview").src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  })

// Avatar preview
avatarImageInput.addEventListener("change", function (e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = function (e) {
        document.getElementById("avatarPreview").src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  })

// Bio character counter
document.getElementById("bio").addEventListener("input", function (e) {
  const maxLength = 250
  const currentLength = e.target.value.length;
  const counter = document.getElementById("bioCounter")

  counter.textContent = currentLength;

  if (currentLength > maxLength) {
    e.target.value = e.target.value.substring(0, maxLength)
    counter.textContent = maxLength
  }
})


// Function to handle file upload with progress
function handleImageUpload(inputElement, previewElement, progressBarElement, maxSizeMB = 2) {
    const file = inputElement.files[0];
    if (!file) return;

    // Validate file type (only images allowed)
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

profileUpdateForm.addEventListener("submit", async(evt)=>{
    evt.preventDefault()

    if(!fullName.value || !email.value || !phoneNumber.value || !country.value || !state.value || !district.value || !village.value || !pincode.value ){
        displayMessage("error", "Please fill all  the required fields")
        return
    }

    const coverProgressBar = document.querySelector("#coverProgress")
    const coverPreview = document.querySelector("#coverPreview")
    handleImageUpload(coverImageInput, coverPreview, coverProgressBar)

    

    const data = {
        coverImage: coverImageInput.value,
        avatarImage: avatarImageInput.value,
        fullName: fullName.value,
        email: email.value,
        phoneNumber: phoneNumber.value,
        address: {
            country: country.value,
            state: state.value,
            district: district.value,
            village: village.value,
            pincode: pincode.value,
            streetAddress: streetAddress.value
        },
        bio: userBio.value
    }


    try {
        const response = await fetch("/api/v1/users/update-account",{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({data})
        })

        const result = await response.json()
        if(result.statuscode === 200){
            displayMessage("success", result.message)
            setTimeout(() => {
                window.location.href= "/profile"
            }, 2000);
        }
        else{
            displayMessage("error", result.message)
        }

    } catch (error) {
        console.log(error)
        displayMessage("error", "Something went wrong")
        
    }
} )