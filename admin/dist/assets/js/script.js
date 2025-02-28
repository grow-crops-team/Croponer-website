
window.addEventListener("DOMContentLoaded", () => {
    fetchUser();
    loadTasks();
});


async function fetchUser() {
    const tableData = document.querySelector(".user-data-table tbody")
            
    try {
        const response = await fetch("/api/v1/admin/users")
        const users = await response.json()
        // console.log(users)


        if (users.statuscode === 200) {

          window.dataStore={
            users:[]
          }

          window.dataStore.user = users.data

            tableData.innerHTML = `<tr><td colspan='6' class='py-4 px-6 text-center text-red-500'>${users.message}</td></tr>`

           
            tableData.innerHTML = ""

           users.data.forEach((user, i) => {
                const row = document.createElement("tr")
                row.classList.add("hover:bg-[#4d4d4d33]", "transition-all")
                if (i % 2 === 0) {
                    row.classList.add("bg-slate-200")
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
    } 
}


async function loadTasks() {
    const tableBody = document.querySelector(".task-table tbody");
    tableBody.innerHTML = "<tr><td colspan='6' class='py-4 px-6 text-center'>Loading...</td></tr>";

    try {
        const response = await fetch("/api/v1/admin/tasks");
        const tasks = await response.json();
        // console.log(tasks);
        
        
        

        if (!response.ok) {
            tableBody.innerHTML = `<tr><td colspan='6' class='py-4 px-6 text-center text-red-500'>${tasks.message}</td></tr>`;
            return;
            
        }
        window.dataStore = {
            task: []
        }
        window.dataStore.task = tasks.data;
        tableBody.innerHTML = ""; 

        tasks.data.forEach(task => {
            const row = document.createElement("tr");
            row.id = `task-${task._id}`;

           
            let statusColor;
            switch (task.status.toLowerCase()) {
                case "pending":
                    statusColor = "bg-yellow-200 text-yellow-800";
                    break;
                case "in-progress":
                    statusColor = "bg-blue-200 text-blue-800";
                    break;
                case "completed":
                    statusColor = "bg-green-200 text-green-800";
                    break;
                default:
                    statusColor = "bg-gray-400";
            }

            // **Apply Priority Colors**
            let priorityColor;
            switch (task.priority.toLowerCase()) {
                case "low":
                    priorityColor = "bg-green-200 text-green-800";
                    break;
                case "medium":
                    priorityColor = "bg-orange-200 text-orange-800";
                    break;
                case "high":
                    priorityColor = "bg-red-200 text-red-800";
                    break;
                default:
                    priorityColor = "bg-gray-300";
            }

            row.innerHTML = `
                <td class="py-3 px-6 font-medium text-gray-900">${task.title}</td>
                <td class="py-3 px-6 text-gray-800">${task.description}</td>
                 <td class="py-3 px-6 text-gray-800">${task.assignedTo}</td>
                <td class="py-3 px-6 text-gray-800">
                    <span class="px-3 py-1 rounded-full ${statusColor}">${task.status}</span>
                </td>
                <td class="py-3 px-6 text-gray-800">
                    <span class="px-3 py-1 rounded ${priorityColor}">${task.priority}</span>
                </td>
                <td class="py-3 px-6 text-gray-800">${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due Date"}</td>
                
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        tableBody.innerHTML = "<tr><td colspan='6' class='py-4 px-6 text-center text-red-500'>Failed to load tasks</td></tr>";
    }
}