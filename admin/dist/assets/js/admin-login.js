import { displayMessage,showPassword } from "./utils.js";

const loginModal = document.querySelector("#loginModal");
const adminLoginBtn = document.querySelector("#adminLogin");
const adminProfile = document.querySelector("#adminProfile");
const cancelBtn = document.querySelector("#cancelBtn");
const adminLoginForm = document.querySelector("#adminLoginForm");

adminLoginBtn.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
});

adminLoginForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const identifier = document.querySelector("#identifier").value.trim(); 
    const password = document.querySelector("#password").value.trim();

    const isEmail = identifier.includes("@");

    try {
        const response = await fetch("/api/v1/admin/admin-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: isEmail ? identifier : null,   
                username: !isEmail ? identifier : null,  
                password
            })
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            displayMessage("success", data.message);
            localStorage.setItem("adminLogged", "true");
            window.location.href = "/admin";
            loginModal.classList.add("hidden");
        } else {
            console.log("Login Error:", data.message);
            displayMessage("error", data.message);
        }
    } catch (error) {
        console.error("Login Error:", error);
        displayMessage("error", "An error occurred. Please try again.");
    }
});

cancelBtn.addEventListener("click", () => {
    loginModal.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
    const isLogged = localStorage.getItem("adminLogged");
    if (isLogged === "true") {
        adminProfile.classList.remove("hidden");
    } else {
        adminProfile.classList.add("hidden");
    }
});

const password = document.querySelector("#password")
const showPasswordBtn = document.querySelector("#showPassword")
showPassword( showPasswordBtn,password)