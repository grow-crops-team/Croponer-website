
import { displayMessage,showPassword } from "./utils.js";

const loginModal = document.querySelector("#loginModal");
const adminLoginBtn = document.querySelector("#adminLogin");
const adminProfile = document.querySelector("#adminProfile");
const adminProfileModal = document.querySelector("#adminProfileModal");
const cancelBtn = document.querySelector("#cancelBtn");
const adminLogoutBtn = document.querySelector("#adminLogoutBtn");
const adminProfileName = document.querySelector("#adminProfile p span")
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

        const result = await response.json();
        // console.log(result);

        if (response.ok) {
            displayMessage("success", result.message);
            sessionStorage.setItem("adminLoggedIn", true);
            sessionStorage.setItem("accessToken", result.data.accessToken);
            sessionStorage.setItem("adminUsername", result.data.user.username)
            sessionStorage.setItem("role", result.data.user.role)
            setTimeout(() => {
            // window.location.href = "/admin";
            }, 3000);
            loginModal.classList.add("hidden");
        } else {
            console.log("Login Error:", result.message);
            displayMessage("error", result.message);
        }
    } catch (error) {
        console.error("Login Error:", error);
        displayMessage("error", "An error occurred. Please try again.");
    }
});

async function adminLogout() {
    
    try {
        const response = await fetch("/api/v1/admin/admin-logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        if (response.ok) {
            displayMessage("success", data.message);
            sessionStorage.clear();

           
            setTimeout(() => {
                window.location.href = "/admin";
            }, 1000)

        } else {
            displayMessage("error", data.message);
        }
    } catch (error) {
        console.error("Logout error:", error);
        displayMessage("error", "An error occurred. Please check your connection.");
    }
}

cancelBtn.addEventListener("click", () => {
    loginModal.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
    const isAdminLoggedIn =  sessionStorage.getItem("adminLoggedIn")
    const adminName = sessionStorage.getItem("adminUsername")
    if (isAdminLoggedIn === "true") {
        adminProfile.classList.remove("hidden");
        adminLoginBtn.classList.add("hidden");
        adminProfileName.innerHTML= `${adminName}`
    } else {
        adminProfile.classList.add("hidden");
        adminLoginBtn.classList.remove("hidden");
    }
});

adminLogoutBtn.addEventListener("click", () => {
    adminLogout()
})

adminProfile.addEventListener("click", () => {
    adminProfileModal.classList.toggle("hidden");
});

window.addEventListener("click", (evt) => {
    if (evt.target === adminProfileModal) {
        adminProfileModal.classList.toggle("hidden");
    }
});


const password = document.querySelector("#password")
const showPasswordBtn = document.querySelector("#showPassword")
showPassword( showPasswordBtn,password)



async function fetchWithAuth(url, options = {}) {
    let token = sessionStorage.getItem("accessToken");

    if (!token) {
        console.error("No access token found, redirecting to login...");
        sessionStorage.clear();
        window.location.href = "/admin-login";
        return;
    }

    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`
    };

    let response = await fetch(url, options);

    if (response.status === 401) {
        const refreshResponse = await fetch("/api/v1/admin/refresh-token", {
            method: "POST",
            credentials: "include"
        });

        const refreshData = await refreshResponse.json();

        if (refreshData.accessToken) {
            sessionStorage.setItem("accessToken", refreshData.accessToken);
            options.headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
            response = await fetch(url, options); // Retry request
        } else {
            sessionStorage.clear();
            window.location.href = "/admin-login";
        }
    }

    return response.json();
}
