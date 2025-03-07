import { displayMessage, hideLoader, showLoader } from "./utils.js"


document.addEventListener("DOMContentLoaded",()=>{
    fetchUser()
    fetchUserDetails()
})

async function fetchUser() {
    showLoader()
    const tableData = document.querySelector(".user-registerData-table tbody")
            
    try {
        const response = await fetch("/api/v1/admin/users")
        const users = await response.json()
        // console.log(users)

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
                        <td class="py-2 px-6 font-medium text-gray-900">${user._id}</td>
                        <td class="py-2 px-6 text-gray-800">${user.username}</td>
                        <td class="py-2 px-6 text-gray-800">${user.fullName}</td>
                        <td class="py-2 px-6 text-gray-800">${user.email}</td>
                        
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

async function fetchUserDetails() {
    showLoader()
    const tableData = document.querySelector(".user-profileData-table tbody")
            
    try {
        const response = await fetch("/api/v1/admin/get-userProfile",{
            method: "GET",
            credentials: "include",
            headers: {"content-type": "application/json"}
        })
        const userProfile = await response.json()
        console.log(userProfile)

        if (userProfile.statuscode === 200) {

         
            tableData.innerHTML = `<tr><td colspan='6' class='py-4 px-6 text-center text-red-500'>${userProfile.message}</td></tr>`

            tableData.innerHTML = ""

           userProfile.data.forEach((user, i) => {
                const row = document.createElement("tr")
                row.classList.add("hover:bg-[#4d4d4d33]", "transition-all")
                if (i % 2 === 0) {
                    row.classList.add("bg-slate-100")
                }
                else {
                    row.classList.add("bg-slate-300")
                }
                const addressParts = [
                    user.address.streetAddress,
                    user.address.village,
                   user.address.district,
                    user.address.state,
                    user.address.country
                ].filter(Boolean);
                const userAddress = addressParts.length ? addressParts.join(", ") : "Not provided";
                const userPhone = user.phoneNumber ? user.phoneNumber : "Not provided"

                row.innerHTML = `
                        <td class="py-2 px-6 text-gray-800">${user.fullName}</td>
                        <td class="py-2 px-6 text-gray-800">${user.email}</td>
                        <td class="py-2 px-6 text-gray-800">${userPhone}</td>
                        <td class="py-2 px-6 text-gray-800">${userAddress}</td>
                        <td class="py-2 px-6">
                            <img src="${user.avatar}" alt="avatar"
                                 class="w-18 h-18 rounded-full border border-gray-400 shadow-md"/>
                        </td>
                        <td class="py-2 px-6"> <button onclick="deleteUser('${user.user}')" 
                        class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md mt-2">Delete</button>
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

window.deleteUser = deleteUser;
async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
        const response = await fetch(`/api/v1/admin/delete-user`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();
        if (result.statuscode === 200) {
            displayMessage("success", result.message);

            window.location.reload()
        } else {
            displayMessage("error", result.message);
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        displayMessage("error", "Something went wrong.");
    }
}


const showDataBtn = document.querySelector("#showdataBtn")
const userProfileTable = document.querySelector(".user-profileData-table")

showDataBtn.addEventListener("click", (evt)=>{
    const isAdminLoggedIn = sessionStorage.getItem("adminLoggedIn")
    const role = sessionStorage.getItem("role")
    console.log(role);
    

    if (isAdminLoggedIn && role === "super-admin") {
        userProfileTable.classList.remove("hidden")
    }
    else{
        displayMessage("error", "Your are not Authorized to User details.")
    }
})