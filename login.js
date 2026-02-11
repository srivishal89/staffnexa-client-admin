const API_BASE = "https://staffnexa-backend.onrender.com";

const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch(`${API_BASE}/client-enquiries`, {
      headers: {
        "Authorization": "Basic " + btoa(username + ":" + password)
      }
    });

    if (response.status === 401) {
      errorMsg.textContent = "Invalid credentials";
      return;
    }

    localStorage.setItem("adminUser", username);
    localStorage.setItem("adminPass", password);

    window.location.href = "dashboard.html";

  } catch (error) {
    errorMsg.textContent = "Server error";
  }
});
