import { UserLogout } from "./user.login_logout.js"
import {showLoader, hideLoader} from "./utils.js"

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

    // console.log(isLoggedIn, username, userAvatar, userName, loginOptionDesktop, loginOptionMobile, userProfileModal)

    // Ensure elements exist before modifying them
    if (userAvatar && userName && loginOptionDesktop && loginOptionMobile && userProfileModal && searchBar && avatars) {
        if (isLoggedIn) {
            // console.log("User is logged in.")

            userAvatar.classList.remove("hidden")
            userName.textContent = username
            loginOptionDesktop.classList.remove("lg:block")
            loginOptionMobile.classList.add("hidden")
            searchBar.classList.add("ml-96")

            avatars.forEach(avatar => {
                avatar.style.backgroundImage = `url(${avatarUrl})`
            })




        } else {
            // console.log("User is logged out.")

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

// loader element


window.addEventListener("beforeunload", showLoader)
window.addEventListener("load", hideLoader)