/* =====================================================
   RAJKUMAR WEBSITE
   RETAILER DASHBOARD
===================================================== */


/* ================= SERVICE PRICES ================= */

const SERVICE_PRICES = {

    "Ration Card Services": 0,

    "PAN Card Services": 0,

    "Recharge Services": 0,

    "iKhedut Portal અરજી": 0,

    "PM Kisan Samman Nidhi": 0,

    "Aadhaar → Mobile Link Check": 0,

    "Aadhaar → PAN Link Check": 0,

    "RC PDF Download": 0,

    "DL PDF Download": 0,

    "LMS Certificate Apply": 0

};


/* ================= INITIAL LOAD ================= */

document.addEventListener("DOMContentLoaded", function () {

    loadRetailerInfo();

    updateDashboardStats();

});


/* ================= RETAILER INFO ================= */

function loadRetailerInfo() {

    const retailerName =
        localStorage.getItem("retailerName");

    const retailerId =
        localStorage.getItem("retailerId");


    const nameElement =
        document.getElementById("retailerName");


    if (retailerName) {

        nameElement.textContent =
            retailerName;

    }

    else if (retailerId) {

        nameElement.textContent =
            retailerId;

    }

}


/* ================= SECTION ================= */

function showSection(sectionId, button) {

    document
        .querySelectorAll(".content-section")
        .forEach(function (section) {

            section.classList.remove("active");

        });


    const section =
        document.getElementById(sectionId);


    if (section) {

        section.classList.add("active");

    }


    document
        .querySelectorAll(".menu-item")
        .forEach(function (item) {

            item.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }

}


function showSectionById(sectionId) {

    const section =
        document.getElementById(sectionId);


    if (!section) {
        return;
    }


    document
        .querySelectorAll(".content-section")
        .forEach(function (item) {

            item.classList.remove("active");

        });


    section.classList.add("active");


    document
        .querySelectorAll(".menu-item")
        .forEach(function (item) {

            item.classList.remove("active");

        });

}


/* ================= NEW APPLICATION ================= */

function openNewApplication() {

    showSectionById("newApplication");


    document
        .querySelectorAll(".menu-item")
        .forEach(function (item) {

            item.classList.remove("active");

        });


    const newButton =
        document.querySelectorAll(".menu-item")[1];


    if (newButton) {

        newButton.classList.add("active");

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ================= SERVICE SELECT ================= */

function serviceSelected() {

    const serviceSelect =
        document.getElementById("serviceSelect");

    const service =
        serviceSelect.value;


    const info =
        document.getElementById("serviceInfo");

    const serviceText =
        document.getElementById("selectedServiceText");

    const amount =
        document.getElementById("serviceAmount");

    const paymentAmount =
        document.getElementById("paymentAmount");


    if (!service) {

        info.classList.remove("show");

        hideApplicationSections();

        return;

    }


    const price =
        SERVICE_PRICES[service] || 0;


    serviceText.textContent =
        service;


    amount.textContent =
        "₹" + price;


    paymentAmount.textContent =
        "₹" + price;


    info.classList.add("show");


    document
        .getElementById("customerDetails")
        .classList.remove("hidden");


    document
        .getElementById("documentsSection")
        .classList.remove("hidden");


    document
        .getElementById("paymentSection")
        .classList.remove("hidden");


    document
        .getElementById("submitSection")
        .classList.remove("hidden");


    updateSteps();

}


/* ================= HIDE FORM ================= */

function hideApplicationSections() {

    document
        .getElementById("customerDetails")
        .classList.add("hidden");


    document
        .getElementById("documentsSection")
        .classList.add("hidden");


    document
        .getElementById("paymentSection")
        .classList.add("hidden");


    document
        .getElementById("submitSection")
        .classList.add("hidden");

}


/* ================= STEPS ================= */

function updateSteps() {

    document
        .querySelectorAll(".step")
        .forEach(function (step) {

            step.classList.add("active");

        });

}


/* ================= SUBMIT ================= */

function submitApplication() {

    const service =
        document.getElementById("serviceSelect").value;

    const customerName =
        document.getElementById("customerName").value.trim();

    const mobile =
        document.getElementById("customerMobile").value.trim();

    const transactionId =
        document.getElementById("transactionId").value.trim();

    const paymentScreenshot =
        document.getElementById("paymentScreenshot").files[0];


    if (!service) {

        alert("Please select a service.");

        return;

    }


    if (!customerName) {

        alert("Please enter customer name.");

        return;

    }


    if (!/^[0-9]{10}$/.test(mobile)) {

        alert("Please enter valid 10 digit mobile number.");

        return;

    }


    if (!transactionId) {

        alert("Please enter UTR / Transaction ID.");

        return;

    }


    if (!paymentScreenshot) {

        alert("Please upload payment screenshot.");

        return;

    }


    /*
       Backend connection will be added here.

       Application ID will be generated by Google Apps Script
       after the final backend integration.

       Payment Status = Pending
       Application Status = Pending
    */


    alert(
        "Application form is ready.\n\n" +
        "Backend submission will be connected next."
    );

}


/* ================= TRACK ================= */

function trackApplication() {

    const applicationId =
        document
            .getElementById("trackingId")
            .value
            .trim();


    const result =
        document.getElementById("trackingResult");


    if (!applicationId) {

        result.innerHTML =
            '<p style="color:#dc2626;font-weight:700;">' +
            'Please enter Application ID.' +
            '</p>';

        return;

    }


    result.innerHTML =
        '<p style="color:#0756c9;font-weight:700;">' +
        'Application tracking backend will be connected next.' +
        '</p>';

}


/* ================= DASHBOARD STATS ================= */

function updateDashboardStats() {

    document.getElementById(
        "totalApplications"
    ).textContent = "0";


    document.getElementById(
        "pendingApplications"
    ).textContent = "0";


    document.getElementById(
        "processingApplications"
    ).textContent = "0";


    document.getElementById(
        "completedApplications"
    ).textContent = "0";

}


/* ================= LOGOUT ================= */

function logout() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (!confirmLogout) {
        return;
    }


    localStorage.removeItem("retailerName");
    localStorage.removeItem("retailerId");


    window.location.href =
        "login.html";

}