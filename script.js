const API_URL = "https://staffnexa-backend.onrender.com/client-enquiries";

async function loadEnquiries() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch data");
        }

        const enquiries = result.data; // IMPORTANT: result.data

        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        enquiries.forEach(item => {
            const row = `
                <tr>
                    <td>${item.companyName}</td>
                    <td>${item.contactPerson}</td>
                    <td>${item.phone}</td>
                    <td>${item.requirementType}</td>
                    <td>${item.numberOfStaff}</td>
                    <td>${item.location}</td>
                    <td>${item.timeline}</td>
                    <td>${item.quotation || "No"}</td>
                    <td>
                        <button onclick="deleteEnquiry('${item._id}')">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error loading enquiries:", error);
    }
}

async function deleteEnquiry(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadEnquiries();
}

loadEnquiries();
