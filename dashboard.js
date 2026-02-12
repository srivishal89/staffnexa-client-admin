const API_BASE = "https://staffnexa-backend.onrender.com";

let enquiriesData = [];

document.addEventListener("DOMContentLoaded", loadEnquiries);

async function loadEnquiries() {

    const auth = localStorage.getItem("clientAuth");

    if (!auth) {
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/client-enquiries`, {
            headers: {
                "Authorization": "Basic " + auth
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("clientAuth");
            window.location.href = "index.html";
            return;
        }

        const result = await response.json();

        enquiriesData = result.data;

        renderTable(enquiriesData);

    } catch (error) {
        alert("Failed to load data");
        console.error(error);
    }
}

function renderTable(data) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    data.forEach(item => {
        tableBody.innerHTML += `
            <tr>
                <td>${item.companyName}</td>
                <td>${item.contactPerson}</td>
                <td>${item.phone}</td>
                <td>${item.requirementType}</td>
                <td>${item.numberOfStaff}</td>
                <td>${item.location}</td>
                <td>${item.timeline}</td>
            </tr>
        `;
    });
}
