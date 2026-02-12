const API_URL = "https://staffnexa-backend.onrender.com/client-enquiries";

const username = localStorage.getItem("clientUser");
const password = localStorage.getItem("clientPass");

if (!username || !password) {
    window.location.href = "index.html";
}

async function loadEnquiries() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                Authorization: "Basic " + btoa(username + ":" + password)
            }
        });

        if (!response.ok) {
            alert("Session expired. Login again.");
            window.location.href = "index.html";
            return;
        }

        const result = await response.json();

        if (!result.success) {
            alert("Failed to load data");
            return;
        }

        renderTable(result.data);

    } catch (error) {
        alert("Failed to load data");
    }
}

function renderTable(data) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

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
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

document.addEventListener("DOMContentLoaded", loadEnquiries);
