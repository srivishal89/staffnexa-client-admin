const API_BASE = "https://staffnexa-backend.onrender.com";

let enquiriesData = [];

/* LOAD DATA */
async function loadEnquiries() {
  try {

    const auth = localStorage.getItem("clientAuth");

    if (!auth) {
      window.location.href = "index.html";
      return;
    }

    const response = await fetch(`${API_BASE}/client-enquiries`, {
      headers: {
        "Authorization": "Basic " + auth
      }
    });

    if (response.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "index.html";
      return;
    }

    if (!response.ok) {
      throw new Error("API Error");
    }

    const result = await response.json();

    enquiriesData = result.data;

    renderTable(enquiriesData);

  } catch (error) {
    alert("Failed to load data");
    console.error(error);
  }
}

/* RENDER TABLE */
function renderTable(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  data.forEach(item => {

    const row = `
      <tr>
        <td><input type="checkbox" data-id="${item._id}" /></td>
        <td>${item.companyName}</td>
        <td>${item.contactPerson}</td>
        <td>${item.phone}</td>
        <td>${item.requirementType}</td>
        <td>${item.numberOfStaff}</td>
        <td>${item.location}</td>
        <td>${item.timeline}</td>
      </tr>
    `;

    tableBody.innerHTML += row;
  });
}

/* SEARCH */
document.getElementById("searchInput").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  const filtered = enquiriesData.filter(item =>
    item.companyName.toLowerCase().includes(value)
  );

  renderTable(filtered);
});

/* ROLE FILTER */
document.getElementById("roleFilter").addEventListener("change", function () {
  const value = this.value;

  const filtered = value
    ? enquiriesData.filter(item => item.requirementType === value)
    : enquiriesData;

  renderTable(filtered);
});

/* TIMELINE FILTER */
document.getElementById("timelineFilter").addEventListener("change", function () {
  const value = this.value;

  const filtered = value
    ? enquiriesData.filter(item => item.timeline === value)
    : enquiriesData;

  renderTable(filtered);
});

/* EXPORT CSV */
document.getElementById("exportBtn").addEventListener("click", function () {
  let csv = "Company,Contact,Phone,Role,Staff,Location,Timeline\n";

  enquiriesData.forEach(item => {
    csv += `${item.companyName},${item.contactPerson},${item.phone},${item.requirementType},${item.numberOfStaff},${item.location},${item.timeline}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "client-enquiries.csv";
  a.click();
});

/* DELETE */
document.getElementById("deleteBtn").addEventListener("click", async function () {

  const auth = localStorage.getItem("auth");

  const checked = document.querySelectorAll("input[type='checkbox']:checked");

  for (let box of checked) {
    const id = box.getAttribute("data-id");

    await fetch(`${API_BASE}/client-enquiries/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Basic " + auth
      }
    });
  }

  loadEnquiries();
});

/* LOGOUT FUNCTION */
function logout() {
  localStorage.removeItem("auth");
  window.location.href = "index.html";
}

/* INITIAL LOAD */
loadEnquiries();
