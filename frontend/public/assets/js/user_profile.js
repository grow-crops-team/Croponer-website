import { displayMessage } from "./utils.js";

const default_coverImage = "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const default_profileImage = "/assets/images/avatar/default_user.jpg"

const coverImage = document.querySelector("#coverImage");
const profileImage = document.querySelector("#userProfileImage");
const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#userEmail");
const userPhoneNumber = document.querySelector("#userPhoneNumber");
const userAddress = document.querySelector("#userAddress");
const userJoinDate = document.querySelector("#userJoinDate");
const userBio = document.querySelector("#userBio");

document.addEventListener("DOMContentLoaded", async () => {

    userName.innerHTML = sessionStorage.getItem("userFullname")
    userEmail.innerHTML = sessionStorage.getItem("email")

    try {
        const userId = sessionStorage.getItem("userID");

        if (!userId) {
            displayMessage("error", "User not logged in.");
            return;
        }

        const response = await fetch(`/api/v1/users/get-profile/${userId}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        // console.log(data);

        if (data.statuscode === 200) {

            // ✅ Store values in sessionStorage
            sessionStorage.setItem("userFullname", data.data.fullName)
            sessionStorage.setItem("phoneNumber", data.data.phoneNumber);
            sessionStorage.setItem("bio", data.data.bio || "");
            sessionStorage.setItem("coverImage", data.data.coverImage || default_coverImage);
            sessionStorage.setItem("avatar", data.data.avatar || default_profileImage);
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
                data.data.address.country
            ].filter(Boolean);
            userAddress.innerHTML = addressParts.length ? addressParts.join(", ") : "Not provided";

            const joinDate = new Date(data.data.createdAt);
            const day = joinDate.getDate();
            const month = joinDate.toLocaleString("en-US", { month: "long" })
            const year = joinDate.getFullYear();
            userJoinDate.innerText = `Joined ${day} ${month}, ${year}`;
            userBio.innerHTML = data.data.bio ? data.data.bio.replace(/\n/g, "<br>") : "No bio available";

        } else {
            displayMessage("error", data.message);
        }
    } catch (error) {
        console.error("Profile fetch error:", error);
        displayMessage("error", "An error occurred while loading the user profile.", error);
    }
});
