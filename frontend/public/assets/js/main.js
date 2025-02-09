import { UserLogout } from "./user.login_logout.js"
import { showLoader, hideLoader } from "./utils.js"


// --------- animated on scroll(Aos)----
AOS.init({
    duration: 1000,
    easing: 'ease-in-sine',
    delay: 100,
  });
// --------- swiper slider----
const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    speed: 1000,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true,
    },
    allowTouchMove: true,
    on: {
        click: function() {
            this.autoplay.stop(); 
        }
    }
    
});



// ---------- Menu bar----------------------------
function openMenu() {
    const menuBar = document.querySelector("#menuBar")
    const menu = document.querySelector("#menu")
    // console.log(menuBar, menu);
    if (menu && menuBar) {
        function openMenu() {
            if (menu.classList.contains("right-0")) {
                menu.classList.remove("right-0")
                menu.classList.add("right-[-224px]")
            }
            else {
                menu.classList.remove("right-[-224px]")
                menu.classList.add("right-0")
            }
        }
        menuBar.addEventListener("click", (evt) => {
            // console.log("clicked");
            openMenu()
        })
        document.addEventListener("click", (evt) => {
            if (!menuBar.contains(evt.target) && !menu.contains(evt.target)) {
                menu.classList.remove("right-0")
                menu.classList.add("right-[-224px]")
            }
        })

    }
}
openMenu()

// ---------------------- Login Dropdown ----------------------
function openLoginDropdown() {
    const loginDropDowns = document.querySelectorAll("#loginDropDown")
    const loginDropDownMenus = document.querySelectorAll("#loginDropDownMenu")

    if (loginDropDowns && loginDropDownMenus) {

        loginDropDowns.forEach((dropDown, index) => {
            dropDown.addEventListener("click", (evt) => {
                // console.log("open");
                loginDropDownMenus[index].classList.toggle("hidden")
            })
            dropDown.addEventListener("mouseover", (evt) => {
                // console.log("open");
                loginDropDownMenus[index].classList.remove("hidden")
            })
        })

        document.addEventListener("click", (evt) => {
            loginDropDowns.forEach((dropDown, index) => {
                if (!dropDown.contains(evt.target) && !loginDropDownMenus[index].contains(evt.target)) {
                    // console.log("close");
                    loginDropDownMenus[index].classList.add("hidden")
                }
            })
        })
    }
}
openLoginDropdown()


// ------- when the user logged in ---

document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true"
    const username = sessionStorage.getItem("userFullname") || ""
    const avatarUrl = sessionStorage.getItem("avatar") || "../images/avatar/person_circle.svg"
    const userAvatar = document.querySelector(".userAvatar")
    const userName = document.querySelector(".userName")
    const loginOptionDesktop = document.querySelector("#loginOptionDesktop")
    const loginOptionMobile = document.querySelector("#loginOptionMobile")

    const userProfileModal = document.querySelector("#userProfileModal")
    const searchBar = document.querySelector(".searchOption")
    const avatars = document.querySelectorAll(".avatar")

    if (userAvatar && userName && loginOptionDesktop && loginOptionMobile && userProfileModal && searchBar && avatars) {
        if (isLoggedIn) {
            userAvatar.classList.remove("hidden")
            userName.textContent = username
            loginOptionDesktop.classList.remove("lg:block")
            loginOptionMobile.classList.add("hidden")
            searchBar.classList.add("ml-96")

            avatars.forEach(avatar => {
                avatar.style.backgroundImage = `url(${avatarUrl})`
            })
        } else {
            userAvatar.classList.add("hidden")
            userName.textContent = ""
            loginOptionDesktop.classList.add("lg:block")
            loginOptionMobile.classList.remove("hidden")
        }
        if (userAvatar && userProfileModal) {
            userAvatar.addEventListener("click", (evt) => {
                evt.stopPropagation();
                userProfileModal.classList.toggle("hidden")
            })
            document.addEventListener("click", (evt) => {
                if (!userAvatar.contains(evt.target) && !userProfileModal.contains(evt.target)) {
                    userProfileModal.classList.add("hidden")
                }
            })
        }
    }
})



// ------------- when user logged out ------------
const logoutBtn = document.querySelector(".logout")
if (logoutBtn) {
    logoutBtn.addEventListener("click", (evt) => {
        UserLogout()
    })
}

async function fetchWithAuth(url, options = {}) {
    let token = sessionStorage.getItem("accessToken")

    // Attach Authorization header
    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`
    };

    let response = await fetch(url, options);

    // If accessToken is expired, refresh it
    if (response.status === 401) {
        const refreshResponse = await fetch("/api/v1/users/refresh-token", {
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
            window.location.href = "/login";
        }
    }

    return response.json();
}



//  