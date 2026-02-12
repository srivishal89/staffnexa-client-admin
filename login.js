function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("errorMessage");

  if (!username || !password) {
    errorMessage.innerText = "Please enter username and password";
    return;
  }

  // Basic Auth header
  const encoded = btoa(username + ":" + password);

  fetch("https://staffnexa-backend.onrender.com/client-enquiries", {
    method: "GET",
    headers: {
      "Authorization": "Basic " + encoded
    }
  })
  .then(res => {
    if (res.status === 401) {
      throw new Error("Invalid Credentials");
    }
    if (!res.ok) {
      throw new Error("Server error");
    }
    return res.json();
  })
  .then(data => {
    // Save auth in localStorage
    localStorage.setItem("auth", encoded);
    window.location.href = "dashboard.html";
  })
  .catch(err => {
    errorMessage.innerText = err.message;
  });
}

function resetForm() {
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("errorMessage").innerText = "";
}
