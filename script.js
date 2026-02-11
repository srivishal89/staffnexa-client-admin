// ==============================
// STAFFNEXA CLIENT ADMIN SCRIPT
// ==============================

const API_BASE = "https://staffnexa-backend.onrender.com";

// ==============================
// AUTH CHECK
// ==============================

const user = localStorage.getItem("adminUser");
const pass = localStorage.getItem("adminPass");

if (!user || !pass) {
  window.location.href = "index.html";
}

// ==============================
// GLOBAL DATA
// ==============================

let enquiries = [];
let filteredData = [];

// ==============================
// LOAD DATA
// ==============================

async function loadClientEnquiries() {
  try {
    const response = await fetch(`${API_BASE}/client-enquiries`, {
      headers: {
        "Authorization": "Basic " + btoa(user + ":" + pass)
      }
    });

    if (response.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.clear();
      window.location.href = "index.html";
      return;
    }

    enquiries = await response.json();
    filteredData = enquiries;
    renderTable(filteredData);

  } catch (error) {
    console.error(error);
    alert("Failed to load data");
  }
}

// ==============================
// RENDER TABLE
// ==============================

function renderTable(data) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  data.forEach((item) => {
    const row = `
      <tr>
        <td><input type="checkbox" class="rowCheckbox" value="${item._id}" /></td>
        <td>${item.company || ""}</td>
        <td>${item.contact || ""}</td>
        <td>${item.phone || ""}</td>
        <td>${item.role || ""}</td>
        <td>${item.staff || ""}</td>
        <td>${item.location || ""}</td>
        <td>${item.timeline || ""}</td>
        <td>${item.quotation || ""}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ==============================
// SEARCH + FILTER
// ==============================

function applyFilters() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const roleValue = document.getElementById("roleFilter").value;
  const timelineValue = document.getElementById("timelineFilter").value;

  filteredData = enquiries.filter(item => {
    const matchesSearch =
      !searchValue ||
      (item.company && item.company.toLowerCase().includes(searchValue));

    const matchesRole =
      roleValue === "All Roles" || item.role === roleValue;

    const matchesTimeline =
      timelineValue === "All Timelines" || item.timeline === timelineValue;

    return matchesSearch && matchesRole && matchesTimeline;
  });

  renderTable(filteredData);
}

// ==============================
// SELECT ALL
// ==============================

document.getElementById("selectAll").addEventListener("change", function () {
  const checkboxes = document.querySelectorAll(".rowCheckbox");
  checkboxes.forEach(cb => cb.checked = this.checked);
});

// ==============================
// DELETE SELECTED
// ==============================

async function deleteSelected() {
  const selected = Array.from(document.querySelectorAll(".rowCheckbox:checked"))
    .map(cb => cb.value);

  if (selected.length === 0) {
    alert("No rows selected");
    return;
  }

  if (!confirm("Are you sure you want to delete selected entries?")) return;

  for (let id of selected) {
    await fetch(`${API_BASE}/client-enquiries/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Basic " + btoa(user + ":" + pass)
      }
    });
  }

  loadClientEnquiries();
}

// ==============================
// EXPORT CSV
// ==============================

function exportCSV() {
  if (!filteredData.length) {
    alert("No data to export");
    return;
  }

  let csv = "Company,Contact,Phone,Role,Staff,Location,Timeline,Quotation\n";

  filteredData.forEach(item => {
    csv += `"${item.company}","${item.contact}","${item.phone}","${item.role}","${item.staff}","${item.location}","${item.timeline}","${item.quotation}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "client_enquiries.csv";
  a.click();

  window.URL.revokeObjectURL(url);
}

// ==============================
// LOGOUT
// ==============================

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ==============================
// EVENT LISTENERS
// ==============================

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("roleFilter").addEventListener("change", applyFilters);
document.getElementById("timelineFilter").addEventListener("change", applyFilters);
document.getElementById("deleteBtn").addEventListener("click", deleteSelected);
document.getElementById("exportBtn").addEventListener("click", exportCSV);
document.getElementById("logoutBtn").addEventListener("click", logout);

// ==============================
// INIT
// ==============================

loadClientEnquiries();
