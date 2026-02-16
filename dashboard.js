const API_BASE = "https://staffnexa-backend.onrender.com";

let enquiriesData = [];

// =======================
// LOAD DATA
// =======================
async function loadEnquiries() {
    try {
        const res = await fetch(`${API_BASE}/client-enquiries`, {
            cache: "no-store"
        });

        const data = await res.json();

        enquiriesData = Array.isArray(data) ? data : [];

        renderTable(enquiriesData);

    } catch (err) {
        console.error("Load error:", err);
        alert("Failed to load data");
    }
}

// =======================
// RENDER TABLE
// =======================
function renderTable(data) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    if (!data.length) {
        tableBody.innerHTML = `<tr><td colspan="6">No data</td></tr>`;
        return;
    }

    data.forEach(item => {

        const initials = (item.companyName || "NA")
            .split(" ")
            .map(w => w[0])
            .join("")
            .toUpperCase();

        tableBody.innerHTML += `
        <tr>

            <td>
                <div class="flex items-center">
                    <div class="h-8 w-8 bg-blue-100 text-blue-700 text-xs flex items-center justify-center rounded">
                        ${initials}
                    </div>
                    <div class="ml-2">
                        <div>${item.companyName}</div>
                        <div class="text-xs">${item.location}</div>
                    </div>
                </div>
            </td>

            <td>
                <div>${item.contactPerson}</div>
                <div class="text-sm">${item.phone}</div>
            </td>

            <td>${item.requirementType} (${item.numberOfStaff})</td>

            <td>${item.timeline}</td>

            <td>
                <select onchange="updateStatus('${item._id}', this.value)">
                    <option ${item.status === "New" ? "selected" : ""}>New</option>
                    <option ${item.status === "Contacted" ? "selected" : ""}>Contacted</option>
                    <option ${item.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option ${item.status === "Closed" ? "selected" : ""}>Closed</option>
                </select>
            </td>

            <td>
                <button onclick="deleteRow('${item._id}')">Delete</button>
            </td>

        </tr>
        `;
    });
}

// =======================
// FILTER
// =======================
function filterTable() {
    const search = document.getElementById("companySearch").value.toLowerCase();
    const role = document.getElementById("roleFilter").value.toLowerCase();

    const filtered = enquiriesData.filter(item => {
        const company = (item.companyName || "").toLowerCase();
        const contact = (item.contactPerson || "").toLowerCase();
        const r = (item.requirementType || "").toLowerCase();

        return (company.includes(search) || contact.includes(search)) &&
               (role === "" || r.includes(role));
    });

    renderTable(filtered);
}

// =======================
// DELETE
// =======================
async function deleteRow(id) {
    if (!confirm("Delete this enquiry?")) return;

    await fetch(`${API_BASE}/client-enquiries/${id}`, {
        method: "DELETE"
    });

    loadEnquiries();
}

// =======================
// UPDATE STATUS
// =======================
async function updateStatus(id, status) {
    await fetch(`${API_BASE}/client-enquiries/${id}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
    });
}

// =======================
// EXPORT
// =======================
function exportCSV() {
    let csv = "Company,Contact,Phone,Role,Staff,Location,Timeline,Status\n";

    enquiriesData.forEach(item => {
        csv += `${item.companyName},${item.contactPerson},${item.phone},${item.requirementType},${item.numberOfStaff},${item.location},${item.timeline},${item.status}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "client-enquiries.csv";
    a.click();
}

// =======================
// LOGOUT
// =======================
function logout() {
    localStorage.removeItem("clientAuth");
    window.location.href = "index.html";
}

// INIT
loadEnquiries();
