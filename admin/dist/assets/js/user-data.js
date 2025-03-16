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
        // console.log(userProfile)

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
                        <td class="py-2 px-6 text-gray-800">${user.user}</td>
                        <td class="py-2 px-6 text-gray-800">${user.fullName}</td>
                       
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
            console.log("error :",userProfile.message);
            
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


// search logic for user data table


const searchUserRegisterData = document.querySelector("#searchUserREgister")
const entriesUserRegisterTable = document.querySelector("#entriesUserRegisterTable")
const showEntries1 = document.querySelector("#showEntries1")
const userRegisterDataTable =  document.querySelector(".user-registerData-table")
const paginationUserRegisterTable = document.querySelector("#paginationUserRegisterTable")

// Pagination and entries logic for user register table
let currentPage = 1;
let rowsPerPage = 10; // default value

entriesUserRegisterTable.addEventListener("change", (evt) => {
    rowsPerPage = parseInt(evt.target.value);
    currentPage = 1; // Reset to first page when changing entries
    updateTableDisplay();
});

function updateTableDisplay() {
    const rows = Array.from(userRegisterDataTable.querySelectorAll("tbody tr:not(.hidden)"));
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    // Update entries show text
    showEntries1.textContent = `Showing ${Math.min((currentPage - 1) * rowsPerPage + 1, totalRows)} to ${Math.min(currentPage * rowsPerPage, totalRows)} of ${totalRows} entries`;

    // Hide all rows first
    rows.forEach(row => row.style.display = 'none');

    // Show rows for current page
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    rows.slice(start, end).forEach(row => row.style.display = '');

    // Update pagination
    updatePagination(totalPages);
}

function updatePagination(totalPages) {
    paginationUserRegisterTable.innerHTML = '';

    // Previous button
    const prevButton = createPaginationButton('Previous', () => {
        if (currentPage > 1) {
            currentPage--;
            updateTableDisplay();
        }
    });
    prevButton.classList.toggle('opacity-50', currentPage === 1);
    paginationUserRegisterTable.appendChild(prevButton);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = createPaginationButton(i.toString(), () => {
            currentPage = i;
            updateTableDisplay();
        });
        if (i === currentPage) {
            pageButton.classList.add('bg-blue-500', 'text-white');
        }
        paginationUserRegisterTable.appendChild(pageButton);
    }

    // Next button
    const nextButton = createPaginationButton('Next', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateTableDisplay();
        }
    });
    nextButton.classList.toggle('opacity-50', currentPage === totalPages);
    paginationUserRegisterTable.appendChild(nextButton);
}

function createPaginationButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'px-3 py-1 mx-1 rounded border hover:bg-gray-100';
    button.addEventListener('click', onClick);
    return button;
}

// Call updateTableDisplay initially and after search
updateTableDisplay();

searchUserRegisterData.addEventListener("input", (evt) => {
    const searchValue = evt.target.value.trim().toLowerCase();
    const rows = userRegisterDataTable.querySelectorAll("tbody tr");

    rows.forEach((row) => {
        try {
            // Cache cell values for better performance
            const cells = {
                id: row.querySelector("td:first-child")?.textContent?.toLowerCase() || "",
                username: row.querySelector("td:nth-child(2)")?.textContent?.toLowerCase() || "",
                fullName: row.querySelector("td:nth-child(3)")?.textContent?.toLowerCase() || "",
                email: row.querySelector("td:nth-child(4)")?.textContent?.toLowerCase() || ""
            };

            const isMatch = Object.values(cells).some(cellValue => 
                cellValue.includes(searchValue)
            );

            row.classList.toggle("hidden", !isMatch);
        } catch (error) {
            console.error("Error processing row:", error);
            // Keep row visible in case of error
            row.classList.remove("hidden");
        }
    });
    
    currentPage = 1; // Reset to first page after search
    updateTableDisplay();
});






// search logic for user profile data table

const searchUserByName = document.querySelector("#searchUserByName")
const searchUserByPhone = document.querySelector("#searchUserByPhone")
const searchUserByAddress = document.querySelector("#searchUserByAddress")
const entriesUserProfileTable = document.querySelector("#entriesUserProfileTable")
const showEntries2 = document.querySelector("#showEntries2")
const userProfileDataTable =  document.querySelector(".user-profileData-table")
const paginationUserProfileTable = document.querySelector("#paginationUserProfileTable")





// const showDataBtn = document.querySelector("#showdataBtn")
// const userProfileTable = document.querySelector(".user-profileData-table")

// showDataBtn.addEventListener("click", (evt)=>{
//     const isAdminLoggedIn = sessionStorage.getItem("adminLoggedIn")
//     const role = sessionStorage.getItem("role")
//     // console.log(role);
    

//     if (isAdminLoggedIn && role === "super-admin") {
//         userProfileTable.classList.remove("hidden")
//     }
//     else{
//         displayMessage("error", "Your are not Authorized to User details.")
//     }
// })