
const taskInput = document.getElementById("taskName");
const deadlineInput = document.getElementById("deadline");
const taskList = document.getElementById("taskList");
const addButton = document.querySelector("form button");
const searchInput = document.getElementById("searchTask");

const allTasksButton = document.getElementById("allTasks");
const pendingTasksButton = document.getElementById("pendingTasks");
const completedTasksButton = document.getElementById("completedTasks");

// Load saved tasks
let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (error) {
    tasks = [];
}

// Current filter
let currentFilter = "all";

// Save tasks in browser storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
addButton.addEventListener("click", function () {
    const name = taskInput.value.trim();
    const deadline = deadlineInput.value;

    if (name === "" || deadline === "") {
        alert("Please enter a task and select a deadline.");
        return;
    }

    const task = {
        name: name,
        deadline: deadline,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";
    deadlineInput.value = "";

    displayTasks();
});

// Show all tasks
allTasksButton.addEventListener("click", function () {
    currentFilter = "all";
    displayTasks();
});

// Show pending tasks
pendingTasksButton.addEventListener("click", function () {
    currentFilter = "pending";
    displayTasks();
});

// Show completed tasks
completedTasksButton.addEventListener("click", function () {
    currentFilter = "completed";
    displayTasks();
});

// Search tasks
searchInput.addEventListener("input", function () {
    displayTasks();
});

// Display and filter tasks
function displayTasks() {
    
    // Calculate task completion progress
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    let progress = 0;

    if (totalTasks > 0) {
        progress = Math.round(
            (completedTasks / totalTasks) * 100
        );
    }

    // Update the progress bar
    document.getElementById("progressFill").style.width =
        progress + "%";

    document.getElementById("progressText").textContent =
        progress + "% completed (" +
        completedTasks + " of " + totalTasks + " tasks)";

    taskList.innerHTML = "";
    document.getElementById("totalCount").textContent =
    tasks.length;

document.getElementById("pendingCount").textContent =
    tasks.filter(function (task) {
        return !task.completed;
    }).length;

document.getElementById("completedCount").textContent =
    tasks.filter(function (task) {
        return task.completed;
    }).length;

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredTasks = tasks
        .map(function (task, index) {
            return {
                task: task,
                index: index
            };
        })
        .filter(function (item) {
            const matchesSearch = item.task.name
                .toLowerCase()
                .includes(searchText);

            const matchesFilter =
                currentFilter === "all" ||
                (currentFilter === "pending" &&
                    !item.task.completed) ||
                (currentFilter === "completed" &&
                    item.task.completed);

            return matchesSearch && matchesFilter;
        });

    // Show a message when no tasks match
       if (filteredTasks.length === 0) {
        const message = document.createElement("li");

        if (tasks.length === 0) {
            message.textContent = "No tasks yet. Add your first task!";
        } else {
            message.textContent = "No matching tasks found.";
        }

        taskList.appendChild(message);
        return;
    }

    // Create each task card
    filteredTasks.forEach(function (item) {
        const task = item.task;
        const index = item.index;

        const li = document.createElement("li");
        // Highlight overdue tasks
const today = new Date();
today.setHours(0, 0, 0, 0);

const deadlineDate = new Date(task.deadline + "T00:00:00");

if (!task.completed && deadlineDate < today) {
    li.style.backgroundColor = "#fee2e2";
    li.style.borderLeft = "5px solid #dc2626";
} else {
    li.style.borderLeft = "5px solid #16a34a";
}

        // Task name
        const taskName = document.createElement("span");
        taskName.textContent = task.name;

        if (task.completed) {
            taskName.style.textDecoration = "line-through";
            taskName.style.color = "gray";
        }

        li.appendChild(taskName);
        

        // Task deadline
        const date = document.createElement("p");

        date.textContent =
            "Deadline: " +
            new Date(task.deadline + "T00:00:00")
                .toLocaleDateString();

        li.appendChild(date);

        // Complete or Undo button
        const completeButton = document.createElement("button");

        completeButton.type = "button";
        completeButton.textContent =
            task.completed ? "Undo" : "Complete";

        completeButton.addEventListener("click", function () {
            tasks[index].completed = !tasks[index].completed;

            saveTasks();
            displayTasks();
        });

        li.appendChild(completeButton);
        
        // Edit button
        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.style.marginLeft = "8px";
        editButton.style.backgroundColor = "#7c3aed";

        editButton.addEventListener("click", function () {
            const newName = prompt(
                "Enter the updated task name:",
                task.name
            );
            li.appendChild(editButton);

            // Cancel if the user presses Cancel
            if (newName === null) {
                return;
            }

            if (newName.trim() === "") {
                alert("Task name cannot be empty.");
                return;
            }

            const newDeadline = prompt(
                "Enter the new deadline (YYYY-MM-DD):",
                task.deadline
            );

            if (newDeadline === null) {
                return;
            }

            // Check the deadline format
            if (!/^\d{4}-\d{2}-\d{2}$/.test(newDeadline)) {
                alert("Please enter the date as YYYY-MM-DD.");
                return;
            }

            // Update the existing task
            tasks[index].name = newName.trim();
            tasks[index].deadline = newDeadline;

            saveTasks();
            displayTasks();
        });


        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.style.marginLeft = "8px";
        deleteButton.style.backgroundColor = "#dc2626";

        deleteButton.addEventListener("click", function () {
            tasks.splice(index, 1);

            saveTasks();
            displayTasks();
        });

        li.appendChild(deleteButton);

        // Add card to the page
        taskList.appendChild(li);
    });
}

// Display saved tasks when the page opens
displayTasks();
