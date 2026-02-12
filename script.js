const API_URL = "https://staffnexa-backend.onrender.com/client-enquiries";

const username = localStorage.getItem("clientUser");
const password = localStorage.getItem("clientPass");

if (!username || !password) {
  window.location.href = "index.html";
}

function loadEnquiries() {
  fetch(API_URL, {
    headers: {
      Authorization: "Basic " + btoa(username + ":" + password),
    },
  })
    .then((res) => res.json())
    .then((response) => {
      if (!response.success) {
        alert("Failed to load data");
        return;
      }

      renderTable(response.data);
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to load data");
    });
}

function renderTable(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  data.forEach((item) => {
    const row = `
      <tr>
        <td><input type="checkbox" value="${item._id}"></td>
        <td>${item.companyName}</td>
        <td>${item.contactPerson}</td>
        <td>${item.phone}</td>
        <td>${item.requirementType}</td>
        <td>${item.numberOfStaff}</td>
        <td>${item.location}</td>
        <td>${item.timeline}</td>
        <td>-</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

loadEnquiries();
