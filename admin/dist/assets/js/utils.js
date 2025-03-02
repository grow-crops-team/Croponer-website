
//--------------------- Toggle Eye Button-----------------
function showPassword(showPassWordBtn, password) {
    if (showPassWordBtn && password) {
        showPassWordBtn.addEventListener("click", (evt) => {
            // console.log("clicked");
            
            const type = password.getAttribute("type") === "password" ? "text" : "password"
            password.setAttribute("type", type)
    
            evt.target.classList.toggle("bi-eye-slash-fill")
            evt.target.classList.toggle("bi-eye-fill")
        })
    }
}

// ---------------------- Display Message ----------------------
function displayMessage(type, message) {
    const displayError = document.querySelector("#displayError");
    const messageElement = document.querySelector("#message");
    if (displayError && messageElement) {
        messageElement.textContent = message;
        displayError.classList.remove("hidden");
        setTimeout(() => {
            displayError.classList.add("hidden");
        }, 5000);
    } else {
        console.error("Message elements not found!");
        
    }
}

// function for Loader 

function showLoader() {
    const loader = document.querySelector("#loader")
    if (loader) {
        loader.classList.add("show")
    }
}

function hideLoader() {
    const loader = document.querySelector("#loader")
    if (loader) {
        loader.classList.remove("show")
    }
}


export { showPassword,  displayMessage, hideLoader, showLoader }