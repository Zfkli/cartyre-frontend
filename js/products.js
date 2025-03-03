document.addEventListener("DOMContentLoaded", function() {
    fetch("https://cartyre-backend-production.up.railway.app/products")
        .then((response) => response.json())
        .then((data) => {
            const productContainer = document.querySelector(".row");
            productContainer.innerHTML = ""; // Clear existing content
            data.forEach((product) => {
                const productHTML = `
                    <div class="col-md-6 mb-4">
                        <div class="product-card">
                            <img src="picture/products/${product.fld_product_id}.jpg" class="product-img" alt="Picture of ${product.fld_product_name}">
                            <div class="product-details">
                                <h5>${product.fld_product_name}</h5>
                                <p><strong>Price: </strong> RM${product.fld_price.toFixed(2)}</p>
                                <p><strong>Brand: </strong>${product.fld_brand}</p>
                                <p><strong>Tyre Size: </strong>${product.fld_tyre_size}</p>
                                <p><strong>Stock:</strong>${product.fld_stock_left}</p>
                                <p><strong>Warranty: </strong>${product.fld_warranty_length}</p>
                                <div class="product-buttons">
                                    <button class="btn btn-warning me-2">Edit</button>
                                    <button class="btn btn-danger delete-btn" data-id="${product.fld_product_id}">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    productContainer.innerHTML += productHTML;
            });

            //Event Listener to delete
            document.querySelectorAll(".delete-btn").forEach((button) => {
                button.addEventListener("click", function() {
                    const productID = this.dataset.id;

                    if (confirm("Are you sure you want to delete this product?")) {
                        fetch(`https://cartyre-backend-production.up.railway.app/products/${productID}`, {
                            method: "DELETE",
                        })
                        .then((response) => response.json())
                        .then((data) => {
                            alert(data.message);
                            location.reload(); //refresh the page to update product list
                        })
                        .catch((error) => console.error("Error deleting products:", error));
                    }
                });
            });
        })
        .catch((error) => console.error("Error fetching product data:", error));
});


//Event listener for add new product
document.addEventListener("DOMContentLoaded", function() {
    const addProductBtn = document.getElementById("addProductBtn");
    const addProductModal = new bootstrap.Modal(document.getElementById("addProductModal"));
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const addProductForm = document.getElementById("addProductForm");
    const productIDField = document.getElementById("productID");

    //Show modal when Add Product is clicked
    addProductBtn.addEventListener("click", function() {
        fetch("https://cartyre-backend-production.up.railway.app/products/last-id")
            .then(response => response.json())
        .then(data => {
            productIDField.value = data.nextID;
            productIDField.setAttribute("readonly", true);
            addProductModal.show();
        })
        .catch(error => {
            console.error("Error fetching last product ID:", error);
            alert("Failed to generate Product ID");
        })
    });

    //Close modal when clicking Cancel or X button
    function closeform() {
        addProductModal.hide();
        addProductForm.reset();
    }
    closeModal.addEventListener("click", closeform);
    cancelBtn.addEventListener("click", closeform);

    //Handle form submission
    addProductForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const productData = {
            fld_product_id: productIDField.value,
            fld_product_name: document.getElementById("productName").value.trim(),
            fld_price: parseFloat(document.getElementById("productPrice").value),
            fld_brand: document.getElementById("productBrand").value.trim(),
            fld_tyre_size: document.getElementById("productSize").value.trim(),
            fld_stock_left: parseInt(document.getElementById("productStock").value),
            fld_warranty_length: parseInt(document.getElementById("productWarranty").value),
            fld_product_image: document.getElementById("productImg").value.trim()
        };

        fetch("https://cartyre-backend-production.up.railway.app/products", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(productData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            closeform();
            location.reload();
        })
        .catch(error => {
            console.error("Error adding product:", error);
            alert("Faied to add product");
        });
    });
});