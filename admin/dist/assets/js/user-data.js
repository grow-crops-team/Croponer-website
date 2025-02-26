import { displayMessage, hideLoader, showLoader } from "./utils.js"

async function fetchUser() {
    showLoader()

    try {
        const response = await fetch("/api/v1/admin/users")
        const user = await response.json()
        // console.log(user)
        

        if (user.statuscode === 200) {
            displayMessage("success", user.message)
            populateTable(user.data)
        } else {
            displayMessage("error", user.message)
        }
    } catch (error) {
        displayMessage("error", "An unexpected error occurred! Please try again.")
        console.error("Fetch error:", error)
    } finally {
        hideLoader()
    }
}

const populateTable = (users) => {
    const tableData = document.querySelector(".user-data-table tbody")
    tableData.innerHTML = ""

    users.forEach((user,i) => {
        const row = document.createElement("tr")
        row.classList.add("hover:bg-[#4d4d4d33]", "transition-all")
        if (i % 2 === 0) {
            row.classList.add("bg-slate-100")
        }
        else{
            row.classList.add("bg-slate-300")
        }
        
        row.innerHTML = `
            <td class="py-2 px-6 font-medium text-gray-900">${user.username}</td>
            <td class="py-2 px-6 text-gray-800">${user.fullName}</td>
            <td class="py-2 px-6 text-gray-800">${user.email}</td>
            <td class="py-2 px-6">
                <img src="${user.avatar}" alt="avatar"
                     class="w-18 h-18 rounded-full border border-gray-400 shadow-md"/>
            </td>
        `
        tableData.appendChild(row)
    })
}


window.onload = fetchUser
