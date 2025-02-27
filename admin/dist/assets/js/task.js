import { displayMessage } from "./utils.js"
const openModalBtn = document.querySelector("#taskModalBtn")
const taskModal = document.querySelector("#taskModal")
const closeModalBtn = document.querySelector("#cancelButton")

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
        const priority = document.querySelector("#taskPriority").value;
        const dueDate = document.querySelector("#taskDueDate").value;

        if (!title || !description || !assignedTo) {
            alert("Title, description, and assigned admin are required!");
            return;
        }

        try {
            const response = await fetch("/api/v1/admin/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, assignedTo, priority, dueDate })
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

        if (!response.ok) {
            tableBody.innerHTML = `<tr><td colspan='6' class='py-4 px-6 text-center text-red-500'>${tasks.message}</td></tr>`;
            return;
        }

        tableBody.innerHTML = ""; // Clear table before inserting new data

        tasks.forEach(task => {
            const row = document.createElement("tr");
            row.id = `task-${task._id}`;

            row.innerHTML = `
                <td class="py-3 px-6 font-medium text-gray-900">${task.title}</td>
                <td class="py-3 px-6 text-gray-800">${task.description}</td>
                <td class="py-3 px-6 text-gray-800">${task.priority}</td>
                <td class="py-3 px-6 text-gray-800">${task.status}</td>
                <td class="py-3 px-6 text-gray-800">${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due Date"}</td>
                <td class="py-3 px-6">
                    <button onclick="updateTask('${task._id}', 'in-progress')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">Start</button>
                    <button onclick="updateTask('${task._id}', 'completed')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md">Complete</button>
                    <button onclick="deleteTask('${task._id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        tableBody.innerHTML = "<tr><td colspan='6' class='py-4 px-6 text-center text-red-500'>Failed to load tasks</td></tr>";
    }
}

async function updateTask(taskId, status) {
    try {
        const response = await fetch(`/api/v1/admin/tasks/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });

        const result = await response.json();

        if (response.ok) {
            displayMessage("success", result.message);
            loadTasks(); 
        } else {
            displayMessage("error", result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        displayMessage("error", "Failed to update task");
    }
}


async function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const response = await fetch(`/api/v1/admin/tasks/${taskId}`, { method: "DELETE" });

        const result = await response.json();

        if (response.ok) {
            displayMessage("success", result.message);
            document.querySelector(`#task-${taskId}`).remove()
        } else {
           displayMessage("error", result.message);
        }
    } catch (error) {
        console.error("Error:", error);
       displayMessage("error", "Failed to delete task");
    }
}



