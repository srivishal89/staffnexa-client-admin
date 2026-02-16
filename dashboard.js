const API_BASE = "https://staffnexa-backend.onrender.com";

let enquiriesData = [];

const auth = localStorage.getItem("clientAuth");

if (!auth) {
    window.location.href = "index.html";
}

// =======================
// LOAD DATA
// =======================
async function loadEnquiries() {
    try {
        const response = await fetch(`${API_BASE}/client-enquiries`, {
            method: "GET",
            headers: {
                "Authorization": "Basic " + auth,
                "Content-Type": "application/json"
            },
            cache: "no-store"
        });

        const result = await response.json();

        enquiriesData = Array.isArray(result) ? result : [];

        renderTable(enquiriesData);

    } catch (error) {
        alert("Failed to load data");
        console.error(error);
    }
}

// =======================
// RENDER TABLE
// =======================
function renderTable(data) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    data.forEach(item => {
        tableBody.innerHTML += `
            <tr>
                <td><input type="checkbox" data-id="${item._id}"></td>
                <td>${item.companyName}</td>
                <td>${item.contactPerson}</td>
                <td>${item.phone}</td>
                <td>${item.requirementType}</td>
                <td>${item.numberOfStaff}</td>
                <td>${item.location}</td>
                <td>${item.timeline}</td>

                <td>
                    <select onchange="updateStatus('${item._id}', this.value)">
                        <option ${item.status === "New" ? "selected" : ""}>New</option>
                        <option ${item.status === "Contacted" ? "selected" : ""}>Contacted</option>
                        <option ${item.status === "In Progress" ? "selected" : ""}>In Progress</option>
                        <option ${item.status === "Closed" ? "selected" : ""}>Closed</option>
                    </select>
                </td>
            </tr>
        `;
    });
}

// =======================
// UPDATE STATUS
// =======================
async function updateStatus(id, status) {
    try {
        await fetch(`${API_BASE}/client-enquiries/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + auth
            },
            body: JSON.stringify({ status })
        });

        loadEnquiries();

    } catch (error) {
        console.error("Status update failed", error);
    }
}

// =======================
// SEARCH
// =======================
document.getElementById("searchInput").addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const filtered = enquiriesData.filter(item =>
        item.companyName.toLowerCase().includes(value)
    );

    renderTable(filtered);
});

// =======================
// DELETE
// =======================
document.getElementById("deleteBtn").addEventListener("click", async function () {
    const checked = document.querySelectorAll("input[type='checkbox']:checked");

    for (let box of checked) {
        const id = box.getAttribute("data-id");

        await fetch(`${API_BASE}/client-enquiries/${id}`, {
            method: "DELETE"
        });
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

// INIT
loadEnquiries();
