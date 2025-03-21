import { UserLogout } from "./user.login_logout.js"
import { showLoader, hideLoader } from "./utils.js"


// ---------- Menu bar----------------------------
function openMenu() {
    const menuButton = document.getElementById('menubar');
    const mobileMenu = document.getElementById('menu');
    
    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('right-[-224px]');
        mobileMenu.classList.toggle('right-0');
      });
        document.addEventListener("click", (evt) => {
            if (!menuButton.contains(evt.target) && !mobileMenu.contains(evt.target)) {
                mobileMenu.classList.remove("right-0")
                mobileMenu.classList.add("right-[-224px]")
            }
        })

    }
}
openMenu()

// ---------------------- Login Dropdown ----------------------
function openLoginDropdown() {
    const userAvatar = document.querySelector('.group.cursor-pointer');
    const userProfileModal = document.getElementById('userProfileModal');
    
    // Toggle modal on avatar click
    userAvatar.addEventListener('click', function(e) {
      e.stopPropagation();
    //   console.log("clicked avatar");
      userProfileModal.classList.toggle('hidden');
    
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
      if (!userProfileModal.contains(e.target) && !userAvatar.contains(e.target)) {
        userProfileModal.classList.add('hidden');
      }
    });
}
openLoginDropdown()


// ------- when the user logged in ---

document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const username = localStorage.getItem("userName") || "user"
    const userFullname = localStorage.getItem("userFullname") || "user"
    const avatarUrl = localStorage.getItem("avatar") || "../images/avatar/default_user.jpg"
// console.log(avatarUrl);

    const userProfile = document.querySelector("#profile")
    const showName1 = document.querySelector("#showName1")
    const showName2 = document.querySelector("#showName2")
    const loginOptionDesktop = document.querySelector("#loginDesktop")
    const loginOptionMobile = document.querySelector("#loginMobile")
    const registerOption = document.querySelector("#register")

    const userProfileModal = document.querySelector("#userProfileModal")
    const avatars = document.querySelectorAll(".avatar")
    // console.log( isLoggedIn, username, avatarUrl);
    // console.log(showName,);
    
    

    if (userProfile && showName1 && showName2 && loginOptionDesktop && loginOptionMobile &&registerOption && userProfileModal  && avatars) {
        if (isLoggedIn) {
            // console.log("logged in");
            
            userProfile.classList.remove("hidden")
           showName1.innerHTML = username
           showName2.innerHTML = userFullname
            loginOptionDesktop.classList.remove("md:inline-block")
            loginOptionMobile.classList.add("hidden")
           registerOption.classList.add("hidden")

            avatars.forEach(avatar => {
                avatar.style.backgroundImage = `url(${avatarUrl})`
            })
        } else {
            // console.log("logged out");
            userProfile.classList.add("hidden")
            showName1.innerHTML = "user"
            showName2.innerHTML = "user"
             loginOptionDesktop.classList.add("md:inline-block")
             loginOptionMobile.classList.remove("hidden")
            registerOption.classList.remove("hidden")
            avatars.forEach(avatar => {
                avatar.style.backgroundImage = `url("../images/aboutPage/spring-4202968.jpg")`
            })
        }
        if (userProfile && userProfileModal) {
            userProfile.addEventListener("click", (evt) => {
                evt.stopPropagation();
                userProfileModal.classList.toggle("hidden")
            })
            document.addEventListener("click", (evt) => {
                if (!userProfile.contains(evt.target) && !userProfileModal.contains(evt.target)) {
                    userProfileModal.classList.add("hidden")
                }
            })
        }
    }
    // else{
    //     console.log("something went wrong");
        
    // }
})



// ------------- when user logged out ------------
const logoutBtn = document.querySelector(".logout")
if (logoutBtn) {
    logoutBtn.addEventListener("click", (evt) => {
        UserLogout()
    })
}


const logoutChannel = new BroadcastChannel("logout_channel");
logoutChannel.onmessage = (event) => {
    if (event.data === "logout") {
        window.location.href = "/"; 
    }
};

async function refreshAccessToken() {
    try {
        const response = await fetch("/api/v1/users/refresh-token", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Token refresh failed");
        }

        const result = await response.json();
        
        
        if (result.statuscode === 200) {
            const expiresAt = Date.now() + 2 * 24 * 60 * 60 * 1000; 
            localStorage.setItem("expiresAt", expiresAt);
            return true;
        }
        throw new Error("Invalid refresh response");
    } catch (error) {
        console.error("Token refresh failed:", error);
        await UserLogout();
        return false;
    }
}

function checkSessionExpiration() {
    const expiresAt = localStorage.getItem("expiresAt");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    if (!expiresAt || !isLoggedIn) return;

    const timeLeft = parseInt(expiresAt) - Date.now();
    
    if (timeLeft <= 0) {
        console.log("⏳ Session expired. Logging out...");
        UserLogout();
    } else if (timeLeft <= 60 * 60 * 1000) { 
        console.log("⚠️ Access token expiring soon. Refreshing...");
        refreshAccessToken();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkSessionExpiration();
    
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkSessionExpiration();
        }
    });
});