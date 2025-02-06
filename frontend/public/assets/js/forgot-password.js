document.getElementById("forgotPasswordForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const messageBox = document.getElementById("message");

    try {
        const response = await fetch("/api/v1/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        messageBox.textContent = result.message;
        messageBox.style.color = response.ok ? "green" : "red";
    } catch (error) {
        messageBox.textContent = "Something went wrong! Try again.";
        messageBox.style.color = "red";
    }
});
