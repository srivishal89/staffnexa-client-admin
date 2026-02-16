const API_BASE = "https://staffnexa-backend.onrender.com";

let enquiriesData = [];

const auth = localStorage.getItem("clientAuth");

// =======================
// AUTH CHECK
// =======================
if (!auth) {
    window.location.href = "index.html";
}

// =======================
// LOAD ENQUIRIES
// =======================
async function loadEnquiries() {
    try {
        const response = await fetch(`${API_BASE}/client-enquiries`, {
            method: "GET",
            headers: {
                "Authorization": "Basic " + auth,
                "Content-Type": "application/json"
            },
            cache: "no-store" // avoid 304 cache issue
        });

        if (response.status === 401) {
            logout();
            return;
        }

        const result = await response.json();

        console.log("API Response:", result);

        // FIX: backend returns array directly
        enquiriesData = Array.isArray(result) ? result : [];

        renderTable(enquiriesData);

    } catch (error) {
        alert("Failed to load data");
        console.error("Load error:", error);
    }
}

// =======================
// RENDER TABLE
// =======================
function renderTable(data) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    if (!data.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">No data found</td>
            </tr>
        `;
        return;
    }

    data.forEach(item => {
        tableBody.innerHTML += `
            <tr>
                <td><input type="checkbox" data-id="${item.id}"></td>
                <td>${item.companyName || ""}</td>
                <td>${item.contactPerson || ""}</td>
                <td>${item.phone || ""}</td>
                <td>${item.requirementType || ""}</td>
                <td>${item.numberOfStaff || ""}</td>
                <td>${item.location || ""}</td>
                <td>${item.hiringTimeline || ""}</td>
            </tr>
        `;
    });
}

// =======================
// SEARCH
// =======================
document.getElementById("searchInput").addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const filtered = enquiriesData.filter(item =>
        (item.companyName || "").toLowerCase().includes(value)
    );

    renderTable(filtered);
});

// =======================
// ROLE FILTER
// =======================
document.getElementById("roleFilter").addEventListener("change", function () {
    const value = this.value;

    const filtered = value
        ? enquiriesData.filter(item => item.requirementType === value)
        : enquiriesData;

    renderTable(filtered);
});

// =======================
// TIMELINE FILTER
// =======================
document.getElementById("timelineFilter").addEventListener("change", function () {
    const value = this.value;

    const filtered = value
        ? enquiriesData.filter(item => item.hiringTimeline === value)
        : enquiriesData;

    renderTable(filtered);
});

// =======================
// EXPORT CSV
// =======================
document.getElementById("exportBtn").addEventListener("click", function () {

    if (!enquiriesData.length) {
        alert("No data to export");
        return;
    }

    let csv = "Company,Contact,Phone,Role,Staff,Location,Timeline\n";

    enquiriesData.forEach(item => {
        csv += `${item.companyName || ""},${item.contactPerson || ""},${item.phone || ""},${item.requirementType || ""},${item.numberOfStaff || ""},${item.location || ""},${item.hiringTimeline || ""}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "client-enquiries.csv";
    a.click();
});

// =======================
// DELETE
// =======================
document.getElementById("deleteBtn").addEventListener("click", async function () {

    const checked = document.querySelectorAll("input[type='checkbox']:checked");

    if (!checked.length) {
        alert("Please select records to delete");
        return;
    }

    if (!confirm("Are you sure you want to delete selected records?")) {
        return;
    }

    for (let box of checked) {
        const id = box.getAttribute("data-id");

        try {
            await fetch(`${API_BASE}/client-enquiries/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Basic " + auth
                }
            });
        } catch (err) {
            console.error("Delete error:", err);
        }
    }

    loadEnquiries();
});

// =======================
// LOGOUT
// =======================
function logout() {
    localStorage.removeItem("clientAuth");
    window.location.href = "index.html";
}

// =======================
// INIT
// =======================
loadEnquiries();
