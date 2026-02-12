const API_BASE = "https://staffnexa-backend.onrender.com";

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("errorMessage");

    if (!username || !password) {
        errorDiv.innerText = "Please enter username and password";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/client-enquiries`, {
            method: "GET",
            headers: {
                "Authorization": "Basic " + btoa(username + ":" + password)
            }
        });

        if (response.status === 401) {
            errorDiv.innerText = "Invalid username or password";
            return;
        }

        if (!response.ok) {
            errorDiv.innerText = "Server error";
            return;
        }

        // Save credentials temporarily
        localStorage.setItem("clientAuth", btoa(username + ":" + password));

        // Redirect
        window.location.href = "dashboard.html";

    } catch (error) {
        errorDiv.innerText = "Connection error";
        console.error(error);
    }
}

function resetForm() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("errorMessage").innerText = "";
}
