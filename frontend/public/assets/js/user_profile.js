import { displayMessage } from "./utils.js";

const coverImage = document.querySelector("#coverImage");
const profileImage = document.querySelector("#userProfileImage");
const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#userEmail");
const userPhoneNumber = document.querySelector("#userPhoneNumber");
const userAddress = document.querySelector("#userAddress");
const userJoinDate = document.querySelector("#userJoinDate");
const userBio = document.querySelector("#userBio");

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const userId = sessionStorage.getItem("userId"); 

        if (!userId) {
            displayMessage("error", "User not logged in.");
            return;
        }

        const response = await fetch(`/api/v1/user/get-profile/${userId}`, {
            method: "GET",
            credentials: "include", 
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        if (data.statuscode === 200) {
            
           

          
            coverImage.src = data.data.coverImage || "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
            profileImage.src = data.data.avatar || "/assets/images/avatar/default_user.jpg";

            // ✅ Populate user details in UI
            userName.innerText = data.data.fullName;
            userEmail.innerText = data.data.email;
            userPhoneNumber.innerText = data.data.phoneNumber || "Not provided";
            userAddress.innerText = data.data.address || "Not provided";
            userJoinDate.innerText = new Date(data.data.createdAt).toLocaleDateString();
            userBio.innerText = data.data.bio || "No bio available";
        } else {
            displayMessage("error", data.message);
        }
    } catch (error) {
        console.error("Profile fetch error:", error);
        displayMessage("error", "An error occurred while loading the user profile.");
    }
});
