//Display table
document.addEventListener("DOMContentLoaded", function() {
    fetch("https://cartyre-backend-production.up.railway.app/customers")
        .then((response) => response.json())
        .then((data) => {
            const customerContainer = document.querySelector(".row");
            customerContainer.innerHTML = `
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Gender</th>
                        <th>Phone Number</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                ${data.map(customer => `
                    <tr>
                        <td>${customer.fld_customer_id}</td>
                        <td>${customer.fld_customer_fname}</td>
                        <td>${customer.fld_customer_lname}</td>
                        <td>${customer.fld_customer_gender}</td>
                        <td>${customer.fld_customer_phone}</td>
                        <td>
                            <button class="btn btn-primary">Edit</button>
                            <button class="btn btn-danger delete-btn" data-id="${customer.fld_customer_id}">Delete</button>
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
            `;

            //Event Listener to delete
            document.querySelectorAll(".delete-btn").forEach((button) => {
                button.addEventListener("click", function() {
                    const customerID = this.dataset.id;

                    if (confirm("Are you sure you want to delete this customer?")) {
                        fetch(`https://cartyre-backend-production.up.railway.app/customers/${customerID}`, {
                            method: "DELETE",
                        })
                        .then((response) => response.json())
                        .then((data) => {
                            alert(data.message);
                            location.reload();
                        })
                        .catch((error) => console.error("Error deleting products:", error));
                    }
                });
            })
        })
        .catch((error) => console.error("Error fetching customer data:", error));
});

//Add Customer
document.addEventListener("DOMContentLoaded", function() {
    const addCustomerBtn = document.getElementById("addCustomer");
    const customerIDField = document.getElementById("customerID");
    const addCustomerModal = new bootstrap.Modal(document.getElementById("addCustomerModal"));
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const addCustomerForm = document.getElementById("addCustomerForm");


    //Show modal when Add Customer is clicked
    addCustomerBtn.addEventListener("click", function() {
        fetch("https://cartyre-backend-production.up.railway.app/customers/last-id")
            .then(response => response.json())
        .then(data => {
            customerIDField.value = data.nextID;
            customerIDField.setAttribute("readonly", true);
            addCustomerModal.show()
        })
        .catch(error => {
            console.error("Error fetching last product ID: ", error);
            alert("Failed to generate Product ID");
        })
    });

    //Close modal when clicking cancel or X button
    function closeform() {
        addCustomerModal.hide();
        addCustomerForm.reset();
    }
    closeModal.addEventListener("click", closeform);
    cancelBtn.addEventListener("click", closeform);

    //Handle form submission
    addCustomerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const customerData = {
            fld_customer_id: customerIDField.value,
            fld_customer_fname: document.getElementById("customerFName").value.trim(),
            fld_customer_lname: document.getElementById("customerLName").value.trim(),
            fld_customer_gender: document.getElementById("customerGender").value.trim(),
            fld_customer_phone: document.getElementById("customerPhone").value.trim()
        };

        fetch("https://cartyre-backend-production.up.railway.app/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(customerData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            closeform();
            location.reload();
        })
        .catch(error => {
            console.error("Error adding customer: ", error);
            alert("Failed to add customer");
        });
    });
});