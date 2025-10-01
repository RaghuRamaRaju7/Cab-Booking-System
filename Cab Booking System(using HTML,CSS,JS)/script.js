let cabs = [];
let customers = [];

function addCab() {
    const cabId = document.getElementById("cabId").value;
    const driverName = document.getElementById("driverName").value;

    if (!cabId || !driverName) {
        logActivity("Please enter valid Cab details.", "error");
        return;
    }

    if (cabs.some(cab => cab.cabId == cabId)) {
        logActivity(`Cab ID ${cabId} already exists!`, "error");
        return;
    }

    cabs.push({ cabId, driverName, isAvailable: true });
    updateCabsDisplay();
    logActivity(`Cab ID ${cabId} driven by ${driverName} added successfully.`, "success");

    document.getElementById("cabId").value = "";
    document.getElementById("driverName").value = "";
}

function addCustomer() {
    const customerId = document.getElementById("customerId").value;
    const customerName = document.getElementById("customerName").value;

    if (!customerId || !customerName) {
        logActivity("Please enter valid Customer details.", "error");
        return;
    }

    if (customers.some(cust => cust.customerId == customerId)) {
        logActivity(`Customer ID ${customerId} already exists!`, "error");
        return;
    }

    customers.push({ customerId, customerName });
    updateCustomersDisplay();
    logActivity(`Customer ${customerName} (ID: ${customerId}) added successfully.`, "success");

    document.getElementById("customerId").value = "";
    document.getElementById("customerName").value = "";
}

function bookCab() {
    const customerId = document.getElementById("bookCustomerId").value;
    const cabId = document.getElementById("bookCabId").value;

    if (!customerId || !cabId) {
        logActivity("Please enter valid booking details.", "error");
        return;
    }

    const customer = customers.find(cust => cust.customerId == customerId);
    const cab = cabs.find(c => c.cabId == cabId);

    if (!customer) {
        logActivity(`Customer ID ${customerId} not found.`, "error");
        return;
    }

    if (!cab) {
        logActivity(`Cab ID ${cabId} not found.`, "error");
        return;
    }

    const bookingText = document.getElementById("bookingText");
    const bookingLoader = document.getElementById("bookingLoader");
    bookingText.style.display = "none";
    bookingLoader.style.display = "inline-block";

    setTimeout(() => {
        if (cab.isAvailable) {
            cab.isAvailable = false;
            updateCabsDisplay();
            logActivity(`✅ Booking confirmed! ${customer.customerName} got Cab ID ${cab.cabId} driven by ${cab.driverName}.`, "success");

            // Keep cab booked for 10 seconds before making it available again
            setTimeout(() => {
                cab.isAvailable = true;
                updateCabsDisplay();
                logActivity(`🚖 Cab ID ${cab.cabId} is now available again.`, "success");
            }, 10000);
        } else {
            logActivity(`❌ Sorry ${customer.customerName}, Cab ID ${cab.cabId} is already booked.`, "error");
        }

        bookingText.style.display = "inline";
        bookingLoader.style.display = "none";
    }, 1500);

    document.getElementById("bookCustomerId").value = "";
    document.getElementById("bookCabId").value = "";
}

function updateCabsDisplay() {
    const cabsDisplay = document.getElementById("cabsDisplay");
    cabsDisplay.innerHTML = "";

    if (cabs.length === 0) {
        cabsDisplay.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #718096;">No cabs added yet.</p>`;
        return;
    }

    cabs.forEach(cab => {
        const cabCard = document.createElement("div");
        cabCard.classList.add("cab-card");
        cabCard.classList.add(cab.isAvailable ? "available" : "booked");

        cabCard.innerHTML = `
            <div class="cab-id">Cab ID: ${cab.cabId}</div>
            <div class="driver-name">Driver: ${cab.driverName}</div>
            <div class="status ${cab.isAvailable ? "available" : "booked"}">
                ${cab.isAvailable ? "Available" : "Booked"}
            </div>
        `;
        cabsDisplay.appendChild(cabCard);
    });
}

function updateCustomersDisplay() {
    const customersDisplay = document.getElementById("customersDisplay");
    customersDisplay.innerHTML = "";

    if (customers.length === 0) {
        customersDisplay.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #718096;">No customers registered yet.</p>`;
        return;
    }

    customers.forEach(customer => {
        const custCard = document.createElement("div");
        custCard.classList.add("customer-card");
        custCard.innerHTML = `
            <div class="customer-id">ID: ${customer.customerId}</div>
            <div class="customer-name">${customer.customerName}</div>
        `;
        customersDisplay.appendChild(custCard);
    });
}

function logActivity(message, type = "info") {
    const activityLog = document.getElementById("activityLog");
    const logEntry = document.createElement("div");
    logEntry.classList.add("log-entry");
    if (type === "success") logEntry.classList.add("success");
    if (type === "error") logEntry.classList.add("error");

    const time = new Date().toLocaleTimeString();
    logEntry.innerHTML = `
        <div class="log-time">${time}</div>
        <div>${message}</div>
    `;
    activityLog.prepend(logEntry);
}
