const API_BASE = "https://staffnexa-backend.onrender.com";

const auth = localStorage.getItem("clientAuth");

if (!auth) {
    window.location.href = "index.html";
}

let enquiriesData = [];

async function loadEnquiries() {
    try {

        const response = await fetch(`${API_BASE}/client-enquiries`, {
            method: "GET",
            headers: {
                "Authorization": "Basic " + auth
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("clientAuth");
            window.location.href = "index.html";
            return;
        }

        if (!response.ok) {
            throw new Error("API Error");
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error("Invalid response format");
        }

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

loadEnquiries();
