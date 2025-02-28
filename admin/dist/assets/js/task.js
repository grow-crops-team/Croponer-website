import { displayMessage } from "./utils.js"
const openModalBtn = document.querySelector("#taskModalBtn")
const taskModal = document.querySelector("#taskModal")
const closeModalBtn = document.querySelector("#cancelButton")
const editTaskModal = document.querySelector("#editTaskModal")

openModalBtn.addEventListener("click", (evt)=>{
    taskModal.classList.remove("hidden")
})

document.addEventListener("DOMContentLoaded", () => {
    loadTasks() 

    const createTaskForm = document.querySelector("#taskForm")
    createTaskForm.addEventListener("submit", async (event) => {
        event.preventDefault() 

        const title = document.querySelector("#taskTitle").value.trim();
        const description = document.querySelector("#taskDescription").value.trim();
        const assignedTo = document.querySelector("#taskAssignedTo").value.trim();
        const status = document.querySelector("#taskStatus").value.toLowerCase();
        const priority = document.querySelector("#taskPriority").value.toLowerCase();
        const dueDate = document.querySelector("#taskDueDate").value;

        if (!title || !description || !assignedTo) {
            displayMessage("error","Title, description, and assigned admin are required!");
            return;
        }

        try {
            const response = await fetch("/api/v1/admin/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, assignedTo, status,priority, dueDate })
            });

            const result = await response.json();

            if (response.ok) {
               displayMessage("success", result.message);
                taskModal.classList.add("hidden");
                createTaskForm.reset();
                loadTasks();  
            } else {
                displayMessage("error", result.message);
            }
        } catch (error) {
            console.error("Error:", error);
           displayMessage("error", "Failed to create task");
        }
    });
});

closeModalBtn.addEventListener("click", (evt)=>{
    taskModal.classList.add("hidden")
})



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
                 <td class="py-3 px-6">
                    <button onclick="openEditTaskModal( '${task._id}', '${task.title}', '${task.description}','${task.assignedTo}',  '${task.status}','${task.priority}', '${task.dueDate}')" 
                        class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md">Edit</button>
                    <button onclick="deleteTask('${task._id}')" 
                        class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md mt-2">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        tableBody.innerHTML = "<tr><td colspan='6' class='py-4 px-6 text-center text-red-500'>Failed to load tasks</td></tr>";
    }
}

// Open Edit Task Modal and Populate Fields
window.openEditTaskModal= async function( id,title, description, assignedTo, status, priority, dueDate) {
   
    taskModal.dataset.taskId = id; 
    document.querySelector("#editTaskTitle").value = title;
    document.querySelector("#editTaskDescription").value = description;
    document.querySelector("#editTaskAssignedTo").value = assignedTo;
    document.querySelector("#editTaskStatus").value = status;
    document.querySelector("#editTaskPriority").value = priority;
    document.querySelector("#editTaskDueDate").value = dueDate ? new Date(dueDate).toISOString().split("T")[0] : "";

    document.querySelector("#editTaskModal").classList.remove("hidden");
}


document.querySelector("#cancelButton").addEventListener("click", () => {
    document.querySelector("#editTaskModal").classList.add("hidden");
});


document.querySelector("#editTaskForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskId = taskModal.dataset.taskId; 
    // console.log(taskId);
    
    const updatedTask = {
        title: document.querySelector("#editTaskTitle").value.trim(),
        description: document.querySelector("#editTaskDescription").value.trim(),
        assignedTo: document.querySelector("#editTaskAssignedTo").value.trim(),
        status: document.querySelector("#editTaskStatus").value.toLowerCase(),
        priority: document.querySelector("#editTaskPriority").value.toLowerCase(),
        dueDate: document.querySelector("#editTaskDueDate").value || null
    };

    try {
        const response = await fetch(`/api/v1/admin/update-tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTask)
        });

        const result = await response.json();
console.log("update result : ",result);

        if (response.ok) {
            displayMessage("success", result.message);
            document.querySelector("#editTaskModal").classList.add("hidden");
            loadTasks(); // Refresh the table
            
        } else {
            displayMessage("error", result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        displayMessage("error", "Failed to update task.");
    }
});


window.deleteTask = async function (taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const response = await fetch(`/api/v1/admin/update-tasks/${taskId}`, { 
            method: "DELETE",
        });

        const result = await response.json();
        // console.log("Delete Response:", result); 

        if (response.ok) {
            displayMessage("success", result.message);
            document.querySelector(`#task-${taskId}`).remove();
        } else {
            displayMessage("error", result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        displayMessage("error", "Failed to delete task");
    }
};




