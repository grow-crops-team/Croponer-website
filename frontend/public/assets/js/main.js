import { UserLogout } from "./user.login_logout.js"

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
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const username = localStorage.getItem("username") || ""

    const userAvatar = document.querySelector(".userAvatar")
    const userName = document.querySelector(".userName")
    const loginOptionDesktop = document.querySelector("#loginOptionDesktop")
    const loginOptionMobile = document.querySelector("#loginOptionMobile")

    const userProfileModal = document.querySelector("#userProfileModal")
    const searchBar = document.querySelector(".searchOption")
    // console.log(searchBar)
    // console.log(isLoggedIn, username, userAvatar, userName, loginOptionDesktop, loginOptionMobile, userProfileModal)

    // Ensure elements exist before modifying them
    if (userAvatar && userName && loginOptionDesktop && loginOptionMobile && userProfileModal && searchBar) {
        if (isLoggedIn) {
            // console.log("User is logged in.")
            userAvatar.classList.remove("hidden")
            userName.textContent = username
            loginOptionDesktop.classList.remove("lg:block")
            loginOptionMobile.classList.add("hidden")
            // searchBar.classList.remove("ml-14")
            searchBar.classList.add("ml-96")
        } else {
            // console.log("User is logged out.")
            userAvatar.classList.add("hidden")
            userName.textContent = "";
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
        localStorage.setItem("isLoggedIn", false)
        localStorage.setItem("username", "")
    })
}

