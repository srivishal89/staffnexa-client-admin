const API_URL = "https://staffnexa-backend.onrender.com/client-enquiries";
let allData = [];

/* LOGIN */
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "Staffnexa$5000") {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadData();
  } else {
    document.getElementById("loginError").innerText = "Invalid credentials";
  }
}

function clearLogin() {
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

/* LOAD DATA */
async function loadData() {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();

    if (!result.success) {
      alert("Failed to load data");
      return;
    }

    allData = result.data;
    populateFilters();
    renderTable(allData);

  } catch (err) {
    alert("Failed to load data");
  }
}

/* TABLE */
function renderTable(data) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = `
      <tr>
        <td><input type="checkbox" value="${item._id}" /></td>
        <td>${item.companyName}</td>
        <td>${item.contactPerson}</td>
        <td>${item.phone}</td>
        <td>${item.requirementType}</td>
        <td>${item.numberOfStaff}</td>
        <td>${item.location}</td>
        <td>${item.timeline}</td>
        <td>${item.quotation || "No"}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

/* FILTERS */
function populateFilters() {
  const roleFilter = document.getElementById("roleFilter");
  const timelineFilter = document.getElementById("timelineFilter");

  roleFilter.innerHTML = `<option value="">All Roles</option>`;
  timelineFilter.innerHTML = `<option value="">All Timelines</option>`;

  [...new Set(allData.map(d => d.requirementType))]
    .forEach(r => roleFilter.innerHTML += `<option value="${r}">${r}</option>`);

  [...new Set(allData.map(d => d.timeline))]
    .forEach(t => timelineFilter.innerHTML += `<option value="${t}">${t}</option>`);
}

/* SEARCH */
document.getElementById("searchInput").addEventListener("input", filterData);
document.getElementById("roleFilter").addEventListener("change", filterData);
document.getElementById("timelineFilter").addEventListener("change", filterData);

function filterData() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const role = document.getElementById("roleFilter").value;
  const timeline = document.getElementById("timelineFilter").value;

  const filtered = allData.filter(item =>
    item.companyName.toLowerCase().includes(search) &&
    (role === "" || item.requirementType === role) &&
    (timeline === "" || item.timeline === timeline)
  );

  renderTable(filtered);
}

/* SELECT ALL */
function toggleAll(source) {
  const checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
  checkboxes.forEach(cb => cb.checked = source.checked);
}

/* DELETE SELECTED (Frontend only for now) */
function deleteSelected() {
  const selected = Array.from(document.querySelectorAll("tbody input:checked"))
    .map(cb => cb.value);

  if (selected.length === 0) {
    alert("No entries selected");
    return;
  }

  allData = allData.filter(item => !selected.includes(item._id));
  renderTable(allData);
}

/* EXPORT */
function exportCSV() {
  let csv = "Company,Contact,Phone,Role,Staff,Location,Timeline\n";

  allData.forEach(item => {
    csv += `${item.companyName},${item.contactPerson},${item.phone},${item.requirementType},${item.numberOfStaff},${item.location},${item.timeline}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "client-enquiries.csv";
  link.click();
}
