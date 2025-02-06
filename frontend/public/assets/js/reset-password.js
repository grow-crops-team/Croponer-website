document.getElementById("resetPasswordForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token"); // Get token from URL
    const newPassword = document.getElementById("newPassword").value
    const messageBox = document.getElementById("message")

    try {
        const response = await fetch(`/api/v1/auth/reset-password/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword }),
        });

        const result = await response.json();
        messageBox.textContent = result.message;
        messageBox.style.color = response.ok ? "green" : "red";

        if (response.ok) setTimeout(() => window.location.href = "/login.html", 2000);
    } catch (error) {
        messageBox.textContent = "Something went wrong! Try again."
        messageBox.style.color = "red"
    }
})
