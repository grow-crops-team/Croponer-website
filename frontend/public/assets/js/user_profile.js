import { displayMessage, showLoader, hideLoader } from "./utils.js";

const default_coverImage =
    "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const default_profileImage = "/assets/images/avatar/default_user.jpg";

const coverImage = document.querySelector("#coverImage");
const profileImage = document.querySelector("#userProfileImage");
const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#userEmail");
const userPhoneNumber = document.querySelector("#userPhoneNumber");
const userAddress = document.querySelector("#userAddress");
const userJoinDate = document.querySelector("#userJoinDate");
const userBio = document.querySelector("#userBio");

document.addEventListener("DOMContentLoaded", async () => {
    showLoader();
    userName.innerHTML = sessionStorage.getItem("userFullname");
    userEmail.innerHTML = sessionStorage.getItem("email");
    const userId = sessionStorage.getItem("userID");

    try {
        if (!userId) {
            // displayMessage("error", "User not logged in.");
            return;
        }

        const response = await fetch(`/api/v1/users/get-profile/${userId}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        // console.log(data);

        if (data.statuscode === 200) {
            // ✅ Store values in sessionStorage
            localStorage.setItem("avatar", data.data.avatar || default_profileImage);
            sessionStorage.setItem("userFullname", data.data.fullName);
            sessionStorage.setItem("phoneNumber", data.data.phoneNumber);
            sessionStorage.setItem("bio", data.data.bio || "");
            sessionStorage.setItem(
                "coverImage",
                data.data.coverImage || default_coverImage
            );
            sessionStorage.setItem("village", data.data.address.village);
            sessionStorage.setItem("pincode", data.data.address.pincode);
            sessionStorage.setItem("streetAddress", data.data.address.streetAddress);
            sessionStorage.setItem("district", data.data.address.district);
            sessionStorage.setItem("state", data.data.address.state);

            // display user data
            coverImage.src = data.data.coverImage || default_coverImage;
            profileImage.src = data.data.avatar || default_profileImage;
            userName.innerText = data.data.fullName;
            userPhoneNumber.innerText = data.data.phoneNumber || "Not provided";
            const addressParts = [
                data.data.address.streetAddress,
                data.data.address.village,
                data.data.address.district,
                data.data.address.state,
                data.data.address.country,
            ].filter(Boolean);
            userAddress.innerHTML = addressParts.length
                ? addressParts.join(", ")
                : "Not provided";

            const joinDate = new Date(data.data.createdAt);
            const day = joinDate.getDate();
            const month = joinDate.toLocaleString("en-US", { month: "long" });
            const year = joinDate.getFullYear();
            userJoinDate.innerText = `Joined ${day} ${month}, ${year}`;
            userBio.innerHTML = data.data.bio
                ? data.data.bio.replace(/\n/g, "<br>")
                : "No bio available";
        } else {
            displayMessage("error", data.message);
        }
    } catch (error) {
        console.error("Profile fetch error:", error);
        displayMessage(
            "error",
            "An error occurred while loading the user profile.",
            error
        );
    }

    // get all images
    const photoGallery = document.getElementById("photoGallery");
    const photoCount = document.getElementById("photoCount");
    const emptyMessage = document.getElementById("emptyGalleryMessage");
    try {
        const response = await fetch(`/api/v1/users/get-file/${userId}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        // console.log(result);
        if (result.statuscode === 200) {
            const images = result.data.images;
            renderPhotos(images);
        }
    } catch (error) {
        console.error("Profile fetch error:", error);
        displayMessage("error", "Unexpected error occur.", error);
    } finally {
        hideLoader();
    }

    function renderPhotos(photos) {
        photoGallery.innerHTML = "";

        photoCount.textContent = `${photos.length} photo${photos.length !== 1 ? "s" : ""
            }`;

        if (photos.length === 0) {
            emptyMessage.classList.remove("hidden");
            return;
        } else {
            emptyMessage.classList.add("hidden");
        }

        photos.forEach((photo) => {
            const photoElement = createPhotoElement(photo);
            photoGallery.appendChild(photoElement);
        });
    }
    function createPhotoElement(photo) {
        const photoDiv = document.createElement("div");
        photoDiv.className =
            "relative group aspect-square rounded-lg overflow-hidden shadow-md";
        photoDiv.dataset.photoId = photo.publicId;

        photoDiv.innerHTML = `
            <img 
                src="${photo.url}" 
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                alt="User photo"
                loading="lazy"
            />
            <div class="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button 
                    class="p-2 bg-gray-800 bg-opacity-20 rounded-full hover:bg-opacity-100 transition-all" 
                    onclick="viewPhoto('${photo.url}', '${photo.ai_recommendation}' )"
                    aria-label="View photo"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12m-3 0a3 3 0 100-6 3 3 0 000 6zM2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                    </svg>
                </button>
                <button 
                    class="p-2 bg-red-600 bg-opacity-20 rounded-full hover:bg-opacity-100 transition-all" 
                    onclick="deletePhoto('${photo.publicId}')"
                    aria-label="Delete photo"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;

        return photoDiv;
    }

    window.deletePhoto = deletePhoto;
    async function deletePhoto(publicId) {
        if (!confirm("Are you sure you want to delete this photo?")) return;

        try {
            const response = await fetch(`/api/v1/users/delete-file`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicId }),
            });

            const result = await response.json();
            if (result.statuscode === 200) {
                displayMessage("success", "Photo deleted successfully!");

                // ✅ Select the photo by dataset attribute and remove it
                const photoElement = document.querySelector(
                    `[data-photo-id="${publicId}"]`
                );
                if (photoElement) {
                    photoElement.remove();
                }
            } else {
                displayMessage("error", result.message);
            }
        } catch (error) {
            console.error("Error deleting photo:", error);
            displayMessage("error", "Something went wrong.");
        }
    }

    window.viewPhoto = viewPhoto;
    async function viewPhoto(imageUrl, recommendationData) {
        const newWindow = window.open();

        let recommendationText = "Processing... Check back later.";
        if (recommendationData && recommendationData.trim() !== "") {
            recommendationText = recommendationData;
        }

        newWindow.document.write(`
            <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Show photo with recommendation</title>
    <link rel="stylesheet" href="./assets/css/style.css">
</head>
<body class="bg-black">
    <div class=" my-5 px-10 flex flex-col lg:flex-row items-center ">
        <img class="shadow-xl bg-white p-2 lg:max-w-2xl" src="${imageUrl}" alt="">
        <div class="bg-gray-100 text-black text-2xl w-100 h-auto py-5 px-5 mt-5 lg:mt-0 lg:ml-8">
            <p class="text-center mb-5">Recommendations :</p>
            <p class="text-xl">${recommendationText}</p>
        </div>
    </div>
</body>
</html>
        `);
    }
});

// file upload functions

const fileUploadForm = document.querySelector("#uploadImagesForm");
const fileUploadInput = document.querySelector("#file-upload");

const previewContainer = document.querySelector("#previewContainer");
const progressContainer = document.querySelector("#progressContainer");
const progressBar = document.querySelector("#progressBar");
const fileUploadBtn = document.querySelector("#fileUploadBtn");

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

fileUploadInput.addEventListener("change", (evt) => {
    previewContainer.innerHTML = "";
    const files = evt.target.files;

    let totalSize = 0;
    let validFiles = [];

    for (let file of files) {
        if (!file.type.startsWith("image/")) {
            displayMessage("error", "Invalid file type. Please upload images only.");
            return;
        }

        totalSize += file.size;

        if (totalSize > MAX_SIZE) {
            displayMessage("error", "Total file size exceeds 5MB limit.");
            return;
        }

        validFiles.push(file);
        previewImage(file);
    }
});

function previewImage(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.classList.add("h-24", "w-24", "object-cover", "rounded-md", "m-2");
        previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
}

fileUploadForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const files = fileUploadInput.files;
    if (files.length === 0) {
        displayMessage("error", "Please select files to upload.");
        return;
    }

    fileUploadBtn.innerText = "Uploading...";
    progressContainer.classList.remove("hidden");
    progressBar.style.width = "0%";

    const formData = new FormData();
    for (let file of files) {
        formData.append("images", file);
    }

    try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/v1/users/upload-files", true);

        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                // console.log(`Uploaded: ${event.loaded} / ${event.total} bytes (${percent}%)`)
                progressBar.style.width = percent + "%";
                progressBar.innerText = percent + "%";
            }
        };
        xhr.onload = function () {
            if (xhr.status === 200) {
                displayMessage("success", "Images uploaded successfully!");
                progressBar.style.width = "100%";

                progressBar.classList.add("hidden");
                window.location.reload();
            } else {
                displayMessage("error", "Upload failed.");
            }
        };

        xhr.onerror = function () {
            displayMessage("error", "Network error occurred.");
        };

        xhr.send(formData);
    } catch (error) {
        console.error("Upload error:", error);
        displayMessage("error", "Something went wrong.");
    } finally {
        fileUploadBtn.innerText = "Upload Photos";
    }
});
