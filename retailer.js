/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   RETAILER DASHBOARD JAVASCRIPT
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbw1mKC92_EjWJS_x2o8LMqiL9sssMbFh089IhMujZLd6_9VuujoVckjoMS8fbajVn-uQQ/exec";


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkRetailerSession();

        setupServiceAmount();

        setupApplicationForm();

        loadRetailerInformation();

    }
);


/* =====================================================
   CHECK RETAILER SESSION
===================================================== */

function checkRetailerSession() {

    const role =
        localStorage.getItem(
            "rajkumarRole"
        );


    const retailerId =
        localStorage.getItem(
            "rajkumarRetailerId"
        );


    /*
     * Retailer login વગર dashboard open
     * થાય નહીં.
     */

    if (
        role !== "retailer" ||
        !retailerId
    ) {

        window.location.href =
            "login.html";

        return false;

    }


    return true;

}


/* =====================================================
   LOAD RETAILER INFORMATION
===================================================== */

function loadRetailerInformation() {

    const retailerId =
        localStorage.getItem(
            "rajkumarRetailerId"
        ) || "";


    const retailerName =
        localStorage.getItem(
            "rajkumarRetailerName"
        ) || "Retailer";


    const retailerMobile =
        localStorage.getItem(
            "rajkumarRetailerMobile"
        ) || "";


    const retailerUsername =
        localStorage.getItem(
            "rajkumarRetailerUsername"
        ) || "";


    const nameElement =
        document.getElementById(
            "loggedRetailerName"
        );


    const idElement =
        document.getElementById(
            "loggedRetailerId"
        );


    const nameDisplay =
        document.getElementById(
            "retailerNameDisplay"
        );


    const idDisplay =
        document.getElementById(
            "retailerIdDisplay"
        );


    const mobileDisplay =
        document.getElementById(
            "retailerMobileDisplay"
        );


    const usernameDisplay =
        document.getElementById(
            "retailerUsernameDisplay"
        );


    if (nameElement) {

        nameElement.textContent =
            retailerName;

    }


    if (idElement) {

        idElement.textContent =
            retailerId;

    }


    if (nameDisplay) {

        nameDisplay.value =
            retailerName;

    }


    if (idDisplay) {

        idDisplay.value =
            retailerId;

    }


    if (mobileDisplay) {

        mobileDisplay.value =
            retailerMobile;

    }


    if (usernameDisplay) {

        usernameDisplay.value =
            retailerUsername;

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function retailerLogout() {

    localStorage.removeItem(
        "rajkumarRole"
    );

    localStorage.removeItem(
        "rajkumarRetailerId"
    );

    localStorage.removeItem(
        "rajkumarRetailerName"
    );

    localStorage.removeItem(
        "rajkumarRetailerMobile"
    );

    localStorage.removeItem(
        "rajkumarRetailerUsername"
    );


    /* Compatibility keys */

    localStorage.removeItem(
        "retailerId"
    );

    localStorage.removeItem(
        "retailerName"
    );

    localStorage.removeItem(
        "retailerMobile"
    );

    localStorage.removeItem(
        "retailerUsername"
    );


    window.location.href =
        "login.html";

}


/* =====================================================
   SERVICE AMOUNT
===================================================== */

function setupServiceAmount() {

    const serviceSelect =
        document.getElementById(
            "serviceSelect"
        );


    if (!serviceSelect) {

        return;

    }


    serviceSelect.addEventListener(
        "change",
        updateServiceAmount
    );


    updateServiceAmount();

}


/* =====================================================
   UPDATE SERVICE AMOUNT
===================================================== */

function updateServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );


    const amountElement =
        document.getElementById(
            "serviceAmount"
        );


    const paymentAmount =
        document.getElementById(
            "paymentAmount"
        );


    if (!select) {

        return;

    }


    const option =
        select.options[
            select.selectedIndex
        ];


    let amount = 0;


    if (
        option &&
        option.dataset.amount
    ) {

        amount =
            Number(
                option.dataset.amount
            ) || 0;

    }


    if (amountElement) {

        amountElement.textContent =
            amount;

    }


    if (paymentAmount) {

        paymentAmount.textContent =
            amount;

    }

}


/* =====================================================
   APPLICATION FORM
===================================================== */

function setupApplicationForm() {

    const form =
        document.getElementById(
            "applicationForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        submitApplication
    );

}


/* =====================================================
   SUBMIT APPLICATION
===================================================== */

async function submitApplication(event) {

    event.preventDefault();


    if (!checkRetailerSession()) {

        return;

    }


    const form =
        document.getElementById(
            "applicationForm"
        );


    const serviceSelect =
        document.getElementById(
            "serviceSelect"
        );


    const message =
        document.getElementById(
            "applicationMessage"
        );


    if (
        !serviceSelect ||
        !serviceSelect.value
    ) {

        showApplicationMessage(
            message,
            "⚠️ પહેલા Service પસંદ કરો.",
            "error"
        );

        return;

    }


    const selectedOption =
        serviceSelect.options[
            serviceSelect.selectedIndex
        ];


    const amount =
        Number(
            selectedOption.dataset.amount
        ) || 0;


    if (amount <= 0) {

        showApplicationMessage(
            message,
            "⚠️ Service amount મળ્યો નથી.",
            "error"
        );

        return;

    }


    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
            "SUBMITTING...";

    }


    showApplicationMessage(
        message,
        "⏳ Application submit થઈ રહી છે...",
        "loading"
    );


    try {

        const formData =
            new FormData(form);


        const data = {

            action:
                "submitApplication",


            retailerId:
                localStorage.getItem(
                    "rajkumarRetailerId"
                ) || "",


            retailerMobile:
                localStorage.getItem(
                    "rajkumarRetailerMobile"
                ) || "",


            service:
                serviceSelect.value,


            aadhaarName:
                formData.get(
                    "aadhaarName"
                ) || "",


            englishName:
                formData.get(
                    "englishName"
                ) || "",


            gujaratiName:
                formData.get(
                    "gujaratiName"
                ) || "",


            rationCardNo:
                formData.get(
                    "rationCardNo"
                ) || "",


            gender:
                formData.get(
                    "gender"
                ) || "",


            village:
                formData.get(
                    "village"
                ) || "",


            taluka:
                formData.get(
                    "taluka"
                ) || "",


            district:
                formData.get(
                    "district"
                ) || "",


            pincode:
                formData.get(
                    "pincode"
                ) || "",


            mobile:
                formData.get(
                    "mobile"
                ) || "",


            email:
                formData.get(
                    "email"
                ) || "",


            birthDate:
                formData.get(
                    "birthDate"
                ) || "",


            birthYear:
                formData.get(
                    "birthYear"
                ) || "",


            rationcardStatus:
                formData.get(
                    "rationcardStatus"
                ) || "",


            utrNumber:
                formData.get(
                    "utrNumber"
                ) || ""

        };


        const response =
            await fetch(
                SCRIPT_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(
                            data
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP Error " +
                response.status
            );

        }


        const result =
            await response.json();


        console.log(
            "APPLICATION RESULT:",
            result
        );


        if (
            result &&
            result.success === true
        ) {

            showApplicationMessage(
                message,

                "✅ Application successfully submitted." +
                "<br><br>" +

                "<strong>Application ID:</strong> " +
                result.applicationId +
                "<br><br>" +

                "<strong>Service:</strong> " +
                (result.service || "") +
                "<br>" +

                "<strong>Amount:</strong> ₹" +
                (result.amount || amount),

                "success"
            );


            form.reset();

            updateServiceAmount();


        } else {

            showApplicationMessage(
                message,

                "❌ " +
                (
                    result &&
                    result.message
                        ? result.message
                        : "Application submit failed."
                ),

                "error"
            );

        }


    } catch (error) {

        console.error(
            "APPLICATION ERROR:",
            error
        );


        showApplicationMessage(
            message,

            "❌ Server connection failed. Please try again.",

            "error"
        );

    }


    finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "📝 Submit Application";

        }

    }

}


/* =====================================================
   APPLICATION MESSAGE
===================================================== */

function showApplicationMessage(
    element,
    message,
    type
) {

    if (!element) {

        return;

    }


    element.style.display =
        "block";


    element.innerHTML =
        message;


    if (type === "success") {

        element.style.background =
            "#e8f5e9";

        element.style.color =
            "#2e7d32";

        element.style.border =
            "1px solid #c8e6c9";

    }

    else if (type === "loading") {

        element.style.background =
            "#e3f2fd";

        element.style.color =
            "#1565c0";

        element.style.border =
            "1px solid #bbdefb";

    }

    else {

        element.style.background =
            "#ffebee";

        element.style.color =
            "#c62828";

        element.style.border =
            "1px solid #ffcdd2";

    }

}
