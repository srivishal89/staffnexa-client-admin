const API_URL = "https://staffnexa-backend.onrender.com/client-enquiries";

let allData = [];

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

  } catch (error) {
    alert("Failed to load data");
  }
}

function renderTable(data) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = `
      <tr>
        <td>${item.companyName}</td>
        <td>${item.contactPerson}</td>
        <td>${item.phone}</td>
        <td>${item.requirementType}</td>
        <td>${item.numberOfStaff}</td>
        <td>${item.location}</td>
        <td>${item.timeline}</td>
        <td>
          <select onchange="updateQuotation('${item._id}', this.value)">
            <option value="No" ${item.quotation === "No" ? "selected" : ""}>No</option>
            <option value="Yes" ${item.quotation === "Yes" ? "selected" : ""}>Yes</option>
          </select>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function populateFilters() {
  const roleFilter = document.getElementById("roleFilter");
  const timelineFilter = document.getElementById("timelineFilter");

  const roles = [...new Set(allData.map(item => item.requirementType))];
  const timelines = [...new Set(allData.map(item => item.timeline))];

  roles.forEach(role => {
    roleFilter.innerHTML += `<option value="${role}">${role}</option>`;
  });

  timelines.forEach(time => {
    timelineFilter.innerHTML += `<option value="${time}">${time}</option>`;
  });
}

document.getElementById("searchInput").addEventListener("input", filterData);
document.getElementById("roleFilter").addEventListener("change", filterData);
document.getElementById("timelineFilter").addEventListener("change", filterData);

function filterData() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const role = document.getElementById("roleFilter").value;
  const timeline = document.getElementById("timelineFilter").value;

  let filtered = allData.filter(item => {
    return (
      item.companyName.toLowerCase().includes(search) &&
      (role === "" || item.requirementType === role) &&
      (timeline === "" || item.timeline === timeline)
    );
  });

  renderTable(filtered);
}

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

function logout() {
  location.reload();
}

loadData();
