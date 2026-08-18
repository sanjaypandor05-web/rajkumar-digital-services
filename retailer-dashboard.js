/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   RETAILER JAVASCRIPT
===================================================== */


/* =====================================================
   DEMO RETAILER LOGIN
   પછી Google Sheet / Code.gs સાથે connect કરીશું
===================================================== */

const DEMO_RETAILER_ID = "retailer";

const DEMO_RETAILER_PASSWORD = "1234";


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    setupRetailerLogin();

    setupServiceAmount();

    setupApplicationForm();

    checkRetailerSession();

});


/* =====================================================
   RETAILER LOGIN
===================================================== */

function setupRetailerLogin() {

    const loginForm =
        document.getElementById("retailerLoginForm");


    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const retailerId =
                document
                .getElementById("retailerId")
                .value
                .trim();


            const password =
                document
                .getElementById("retailerPassword")
                .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            /*
             * DEMO LOGIN
             *
             * ID:
             * retailer
             *
             * Password:
             * 1234
             *
             * પછી આને Google Sheet / Admin
             * created retailer system સાથે
             * replace કરીશું.
             */


            if (
                retailerId === DEMO_RETAILER_ID &&
                password === DEMO_RETAILER_PASSWORD
            ) {

                sessionStorage.setItem(
                    "retailerLoggedIn",
                    "true"
                );


                sessionStorage.setItem(
                    "retailerId",
                    retailerId
                );


                showDashboard(
                    retailerId
                );


            } else {

                message.style.display =
                    "block";

                message.style.marginTop =
                    "15px";

                message.style.padding =
                    "12px";

                message.style.borderRadius =
                    "10px";

                message.style.background =
                    "#ffebee";

                message.style.color =
                    "#c62828";

                message.innerHTML =
                    "❌ Retailer ID અથવા Password ખોટો છે.";

            }

        }
    );

}


/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard(retailerId) {

    const loginSection =
        document.getElementById(
            "loginSection"
        );


    const dashboard =
        document.getElementById(
            "dashboardSection"
        );


    if (loginSection) {

        loginSection.style.display =
            "none";

    }


    if (dashboard) {

        dashboard.style.display =
            "block";

    }


    const retailerName =
        document.getElementById(
            "loggedRetailerName"
        );


    if (retailerName) {

        retailerName.textContent =
            retailerId;

    }

}


/* =====================================================
   CHECK SESSION
===================================================== */

function checkRetailerSession() {

    const loggedIn =
        sessionStorage.getItem(
            "retailerLoggedIn"
        );


    const retailerId =
        sessionStorage.getItem(
            "retailerId"
        );


    if (
        loggedIn === "true" &&
        retailerId
    ) {

        showDashboard(
            retailerId
        );

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function retailerLogout() {

    sessionStorage.removeItem(
        "retailerLoggedIn"
    );

    sessionStorage.removeItem(
        "retailerId"
    );


    location.reload();

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
   UPDATE AMOUNT
===================================================== */

function updateServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );


    const amount =
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


    const selectedOption =
        select.options[
            select.selectedIndex
        ];


    let servicePrice = 0;


    if (
        selectedOption &&
        selectedOption.dataset.amount
    ) {

        servicePrice =
            Number(
                selectedOption.dataset.amount
            );

    }


    if (amount) {

        amount.textContent =
            servicePrice;

    }


    if (paymentAmount) {

        paymentAmount.textContent =
            servicePrice;

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
        function (event) {

            event.preventDefault();


            const service =
                document.getElementById(
                    "serviceSelect"
                );


            const message =
                document.getElementById(
                    "applicationMessage"
                );


            if (
                !service ||
                service.value === ""
            ) {

                showApplicationMessage(
                    message,
                    "⚠️ પહેલા Service પસંદ કરો.",
                    "error"
                );

                return;

            }


            const selectedOption =
                service.options[
                    service.selectedIndex
                ];


            const amount =
                Number(
                    selectedOption.dataset.amount
                );


            if (amount <= 0) {

                showApplicationMessage(
                    message,
                    "⚠️ Service amount મળ્યો નથી.",
                    "error"
                );

                return;

            }


            /*
             * IMPORTANT
             *
             * અહીંથી આગળ actual data
             * Google Apps Scriptમાં જશે.
             *
             * હાલ demo modeમાં
             * Application ID બનાવવામાં આવે છે.
             */


            const applicationId =
                generateApplicationId();


            const formData =
                collectApplicationData(
                    applicationId,
                    amount
                );


            console.log(
                "Application Data:",
                formData
            );


            showApplicationMessage(
                message,
                "✅ Application તૈયાર છે. Application ID: " +
                applicationId +
                "<br><br>" +
                "હવે Google Sheet + Drive + Payment system connect કરવામાં આવશે.",
                "success"
            );


            /*
             * Form reset હાલમાં બંધ રાખ્યું છે,
             * જેથી user data ગુમ ન થાય.
             */

        }
    );

}


/* =====================================================
   COLLECT FORM DATA
===================================================== */

function collectApplicationData(
    applicationId,
    amount
) {

    const form =
        document.getElementById(
            "applicationForm"
        );


    const formData =
        new FormData(form);


    const data = {

        applicationId:
            applicationId,

        retailerId:
            sessionStorage.getItem(
                "retailerId"
            ) || "",

        service:
            document.getElementById(
                "serviceSelect"
            ).value,

        amount:
            amount,

        aadhaarName:
            formData.get(
                "aadhaarName"
            ),

        englishName:
            formData.get(
                "englishName"
            ),

        gujaratiName:
            formData.get(
                "gujaratiName"
            ),

        rationCardNo:
            formData.get(
                "rationCardNo"
            ),

        gender:
            formData.get(
                "gender"
            ),

        village:
            formData.get(
                "village"
            ),

        taluka:
            formData.get(
                "taluka"
            ),

        district:
            formData.get(
                "district"
            ),

        pincode:
            formData.get(
                "pincode"
            ),

        mobile:
            formData.get(
                "mobile"
            ),

        email:
            formData.get(
                "email"
            ),

        birthDate:
            formData.get(
                "birthDate"
            ),

        birthYear:
            formData.get(
                "birthYear"
            ),

        rationcardStatus:
            formData.get(
                "rationcardStatus"
            ),

        utrNumber:
            formData.get(
                "utrNumber"
            )

    };


    return data;

}


/* =====================================================
   APPLICATION ID
===================================================== */

function generateApplicationId() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            10000 +
            Math.random() * 90000
        );


    return (
        "RKS-" +
        year +
        month +
        day +
        "-" +
        random
    );

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

    } else {

        element.style.background =
            "#ffebee";

        element.style.color =
            "#c62828";

        element.style.border =
            "1px solid #ffcdd2";

    }

}