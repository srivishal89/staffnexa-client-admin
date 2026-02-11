const auth = localStorage.getItem("auth");

if (!auth) {
  window.location.href = "index.html";
}

function loadData() {
  fetch("https://staffnexa-backend.onrender.com/client-enquiries", {
    headers: {
      "Authorization": "Basic " + auth
    }
  })
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

    data.forEach(item => {
      const row = `
        <tr>
          <td><input type="checkbox"></td>
          <td>${item.company}</td>
          <td>${item.contact}</td>
          <td>${item.phone}</td>
          <td>${item.role}</td>
          <td>${item.staff}</td>
          <td>${item.location}</td>
          <td>${item.timeline}</td>
          <td>${item.quotation}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  })
  .catch(() => {
    alert("Failed to load data");
  });
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("auth");
  window.location.href = "index.html";
});

document.getElementById("exportBtn").addEventListener("click", () => {
  alert("Export feature will be enhanced in next update");
});

document.getElementById("deleteBtn").addEventListener("click", () => {
  alert("Delete feature coming soon");
});

loadData();
