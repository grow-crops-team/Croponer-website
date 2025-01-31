

// ------------------------------------- Menu bar-------------------------------------




const menuBar = document.querySelector("#menuBar")
const menu = document.querySelector("#menu")

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
    openMenu()
})
document.addEventListener("click", (evt) => {
    if (!menuBar.contains(evt.target) && !menu.contains(evt.target)) {
        menu.classList.remove("right-0")
        menu.classList.add("right-[-224px]")
    }
})


// ----------------------log in DropDrown----------------------

// ---------------------- Login Dropdown ----------------------

const loginDropDowns = document.querySelectorAll("#loginDropDown")
const loginDropDownMenus = document.querySelectorAll("#loginDropDownMenu")

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
