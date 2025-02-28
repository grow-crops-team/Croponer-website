import { displayMessage, hideLoader, showLoader } from "./utils.js"


document.addEventListener("DOMContentLoaded",()=>{
    fetchUser()
})

async function fetchUser() {
    const tableData = document.querySelector(".user-data-table tbody")
            
    try {
        const response = await fetch("/api/v1/admin/users")
        const users = await response.json()
        console.log(users)


        if (users.statuscode === 200) {

          

            tableData.innerHTML = `<tr><td colspan='6' class='py-4 px-6 text-center text-red-500'>${users.message}</td></tr>`

           
            tableData.innerHTML = ""

           users.data.forEach((user, i) => {
                const row = document.createElement("tr")
                row.classList.add("hover:bg-[#4d4d4d33]", "transition-all")
                if (i % 2 === 0) {
                    row.classList.add("bg-slate-100")
                }
                else {
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
        else{
            console.log("error :",users.message);
            
        }
    }

    catch (error) {
        console.error("Fetch error:", error)
        tableData.innerHTML = "<tr><td colspan='6' class='py-4 px-6 text-center text-red-500'>Failed to load Users</td></tr>"
    } finally {
        hideLoader()
    }
}

console.log(localStorage.getItem("username"));
