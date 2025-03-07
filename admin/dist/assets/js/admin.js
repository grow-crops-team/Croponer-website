import {displayMessage} from "./utils.js"

const addBlogBtn = document.querySelector("#addBlogBtn");

const adminAuth = document.querySelector("#auth");
const workingModalShow = document.querySelector("#working-modal");

const role = sessionStorage.getItem("role");
const isAdminLoggedIn = sessionStorage.getItem("adminLoggedIn");

document.addEventListener("DOMContentLoaded", async (evt) => {
    const adminProfileName = document.querySelector("#adminProfile p span");
    const adminName = sessionStorage.getItem("adminUsername");
    if (isAdminLoggedIn === "true") {
        adminProfileName.innerHTML = `${adminName}`;
        adminAuth.classList.add("hidden");
    } else {
        adminProfileName.innerHTML = `Admin`;
        // adminAuth.classList.remove("hidden");
    }

    fetchAdmin();
});



addBlogBtn.addEventListener("click", (evt) => {
    workingModalShow.classList.toggle("hidden");
});

workingModalShow.addEventListener("click", (evt) => {
   
        workingModalShow.classList.toggle("hidden");
    
});

async function fetchAdmin() {
    const tableData = document.querySelector(".admin-table tbody");

    try {
        const response = await fetch("/api/v1/admin/get-admin");
        const users = await response.json();
        
        if (users.statuscode === 200) {
            tableData.innerHTML = ""; // Clear previous content

            if (!users.data || users.data.length === 0) {
                tableData.innerHTML = `<tr><td colspan='6' class='py-4 px-6 text-center text-gray-600'>No Admins found.</td></tr>`;
                return;
            }

            users.data.forEach((user, i) => {
                const row = document.createElement("tr");
                row.classList.add("hover:bg-[#4d4d4d33]", "transition-all");
                row.dataset.userId = user._id; // Store user ID for easy access
                
                if (i % 2 === 0) {
                    row.classList.add("bg-slate-100");
                } else {
                    row.classList.add("bg-slate-300");
                }

                row.innerHTML = `
                    <td class="py-2 px-6 text-gray-800">${user.fullName}</td>
                    <td class="py-2 px-6 text-gray-800">${user.email}</td>
                    <td class="py-2 px-6 text-gray-800">${user.username}</td>
                    <td class="py-2 px-6 text-gray-800">${user.role}</td>
                    <td class="py-2 px-6 flex space-x-3">
                        <button onclick="editAdmin('${user._id}', '${user.fullName}', '${user.email}', '${user.username}', '${user.role}')"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md">
                            Edit
                        </button>
                        <button onclick="deleteAdmin('${user._id}')"
                            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">
                            Delete
                        </button>
                    </td>
                `;
                tableData.appendChild(row);
            });
        } else {
            console.log("error :", users.message);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        tableData.innerHTML = "<tr><td colspan='6' class='py-4 px-6 text-center text-red-500'>Failed to load Users</td></tr>";
    }
}


window.deleteAdmin = deleteAdmin;
async function deleteAdmin(userId) {
    if (!confirm("Are you sure you want to delete this Admin?")) return;

    try {
        const response = await fetch(`/api/v1/admin/delete-user/${userId}`, {
            // ✅ Pass userId in URL
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();
        if (result.statuscode === 200) {
            displayMessage("success", result.message);
            document.querySelector(`[data-user-id="${userId}"]`).remove(); // ✅ Remove from UI
        } else {
            displayMessage("error", result.message);
        }
    } catch (error) {
        console.error("Error deleting Admin:", error);
        displayMessage("error", "Something went wrong.");
    }
}

const editAdminModal =  document.getElementById("editAdminModal")

window.editAdmin = function (id, fullName, email, username, role) {
    editAdminModal.dataset.AdminId = id; 
    document.getElementById("fullName").value = fullName;
    document.getElementById("email").value = email;
    document.getElementById("username").value = username;
    document.getElementById("adminRole").value = role;

    editAdminModal.classList.remove("hidden");
};

function closeEditModal() {
    document.getElementById("editAdminModal").classList.add("hidden");
}
document.getElementById("cancelButton").addEventListener("click",()=>{
    closeEditModal()
})

document.getElementById("editAdminForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const adminId = editAdminModal.dataset.AdminId
    const updatedData = {
        fullName:  document.getElementById("fullName").value ,
        email: document.getElementById("email").value ,
        username: document.getElementById("username").value ,
        role:  document.getElementById("adminRole").value
    };

    try {
        const response = await fetch(`/api/v1/admin/update-admin/${adminId}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();
        // console.log(result);
        
        if (result.statuscode === 200) {
            displayMessage("success", result.message);
            closeEditModal();
            window.location.reload();
        } else {
            displayMessage("error", result.message);
        }
    } catch (error) {
        console.error("Error updating admin:", error);
        displayMessage("error", "Something went wrong.");
    }
})
