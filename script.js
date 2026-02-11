const API_URL = "https://staffnexa-backend.onrender.com/client-enquiries";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Staffnexa$5000";

let allData = [];

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
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
  document.getElementById("loginError").innerText = "";
}

async function loadData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    allData = data.data || [];
    renderTable(allData);
    populateFilters();
  } catch (err) {
    alert("Failed to load data");
  }
}

function renderTable(data) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  data.forEach(item => {
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
        <td>
          <select>
            <option>No</option>
            <option>Yes</option>
          </select>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function toggleAll(source) {
  document.querySelectorAll("tbody input[type='checkbox']")
    .forEach(cb => cb.checked = source.checked);
}

function deleteSelected() {
  const selected = [...document.querySelectorAll("tbody input[type='checkbox']:checked")]
    .map(cb => cb.value);

  allData = allData.filter(item => !selected.includes(item._id));
  renderTable(allData);
}

function exportCSV() {
  let csv = "Company,Contact,Phone,Role,Staff,Location,Timeline\n";
  allData.forEach(item => {
    csv += `${item.companyName},${item.contactPerson},${item.phone},${item.requirementType},${item.numberOfStaff},${item.location},${item.timeline}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "client-enquiries.csv";
  a.click();
}

function populateFilters() {
  const roles = [...new Set(allData.map(i => i.requirementType))];
  const timelines = [...new Set(allData.map(i => i.timeline))];

  const roleSelect = document.getElementById("roleFilter");
  const timeSelect = document.getElementById("timelineFilter");

  roles.forEach(role => {
    roleSelect.innerHTML += `<option value="${role}">${role}</option>`;
  });

  timelines.forEach(time => {
    timeSelect.innerHTML += `<option value="${time}">${time}</option>`;
  });
}

function filterTable() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const role = document.getElementById("roleFilter").value;
  const timeline = document.getElementById("timelineFilter").value;

  const filtered = allData.filter(item => {
    return (
      item.companyName.toLowerCase().includes(search) &&
      (role === "" || item.requirementType === role) &&
      (timeline === "" || item.timeline === timeline)
    );
  });

  renderTable(filtered);
}
