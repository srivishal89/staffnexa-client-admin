document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const encoded = btoa(username + ":" + password);

  fetch("https://staffnexa-backend.onrender.com/client-enquiries", {
    method: "GET",
    headers: {
      "Authorization": "Basic " + encoded
    }
  })
  .then(res => {
    if (!res.ok) throw new Error("Invalid credentials");
    localStorage.setItem("auth", encoded);
    window.location.href = "dashboard.html";
  })
  .catch(() => {
    document.getElementById('errorMsg').innerText = "Invalid Username or Password";
  });
});

document.getElementById('cancelBtn').addEventListener('click', function() {
  document.getElementById('username').value = "";
  document.getElementById('password').value = "";
});
