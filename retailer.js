/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   RETAILER.JS - FINAL WORKING VERSION
   Retailer Login + Dashboard + Service Form
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT URL
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwP9G6sTkpxzZdaM5Sbn__xJM_LxDX4SOzB-Ah2XiT_MPa2CgBURjun7qjU78Ck5QvZHw/exec";


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


    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const retailerId =
            document.getElementById("retailerId")
                ?.value
                .trim();


        const password =
            document.getElementById("retailerPassword")
                ?.value || "";


        if (!retailerId || !password) {

            showLoginMessage(
                "⚠️ Retailer ID અને Password દાખલ કરો.",
                "error"
            );

            return;
        }


        const button =
            loginForm.querySelector(
                "button[type='submit']"
            );


        if (button) {

            button.disabled = true;

            button.textContent = "LOGIN...";

        }


        showLoginMessage(
            "🔄 Login ચેક થઈ રહ્યું છે...",
            "loading"
        );


        try {

            const response = await fetch(
                SCRIPT_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        action: "retailerLogin",

                        username: retailerId,

                        password: password

                    })
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
                "RETAILER LOGIN RESULT:",
                result
            );


            /* =========================================
               LOGIN SUCCESS
            ========================================= */

            if (
                result &&
                result.success === true
            ) {

                const id =
                    String(
                        result.retailerId ||
                        retailerId
                    ).trim();


                const name =
                    result.retailerName ||
                    "";


                const mobile =
                    result.mobile ||
                    "";


                const username =
                    result.username ||
                    retailerId;


                /* =====================================
                   LOCAL STORAGE
                ===================================== */

                localStorage.setItem(
                    "rajkumarRole",
                    "retailer"
                );


                localStorage.setItem(
                    "rajkumarRetailerId",
                    id
                );


                localStorage.setItem(
                    "rajkumarRetailerName",
                    name
                );


                localStorage.setItem(
                    "rajkumarRetailerMobile",
                    mobile
                );


                localStorage.setItem(
                    "rajkumarRetailerUsername",
                    username
                );


                /* =====================================
                   OLD COMPATIBILITY KEYS
                ===================================== */

                localStorage.setItem(
                    "retailerId",
                    id
                );


                localStorage.setItem(
                    "retailerName",
                    name
                );


                localStorage.setItem(
                    "retailerMobile",
                    mobile
                );


                localStorage.setItem(
                    "retailerUsername",
                    username
                );


                /* =====================================
                   SESSION STORAGE
                ===================================== */

                sessionStorage.setItem(
                    "retailerLoggedIn",
                    "true"
                );


                sessionStorage.setItem(
                    "retailerId",
                    id
                );


                sessionStorage.setItem(
                    "retailerName",
                    name
                );


                sessionStorage.setItem(
                    "retailerMobile",
                    mobile
                );


                /* =====================================
                   SHOW SUCCESS
                ===================================== */

                showLoginMessage(
                    "✅ Login Successful. Dashboard ખૂલી રહ્યું છે...",
                    "success"
                );


                /* =====================================
                   IMPORTANT
                   retailer-dashboard.html નથી.
                   Dashboard retailer.html માં જ છે.
                ===================================== */

                setTimeout(function () {

                    window.location.href =
                        "retailer.html";

                }, 500);


                return;

            }


            /* =========================================
               LOGIN FAILED
            ========================================= */

            showLoginMessage(

                result &&
                result.message

                    ? "❌ " +
                      result.message

                    : "❌ Retailer ID અથવા Password ખોટો છે.",

                "error"

            );


        }
        catch (error) {

            console.error(
                "RETAILER LOGIN ERROR:",
                error
            );


            showLoginMessage(

                "❌ Server connection failed. Apps Script URL અથવા deployment ચેક કરો.",

                "error"

            );

        }
        finally {

            if (button) {

                button.disabled = false;

                button.textContent = "LOGIN";

            }

        }

    });

}


/* =====================================================
   LOGIN MESSAGE
===================================================== */

function showLoginMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "loginMessage"
        );


    if (!element) {
        return;
    }


    element.style.display =
        "block";


    element.innerHTML =
        message;


    element.style.padding =
        "12px";


    element.style.marginTop =
        "15px";


    element.style.borderRadius =
        "10px";


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


/* =====================================================
   CHECK RETAILER SESSION
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
   SHOW DASHBOARD
===================================================== */

function showDashboard(
    retailerId
) {

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
            localStorage.getItem(
                "rajkumarRetailerName"
            ) ||
            sessionStorage.getItem(
                "retailerName"
            ) ||
            retailerId;

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function retailerLogout() {

    /* SESSION */

    sessionStorage.removeItem(
        "retailerLoggedIn"
    );

    sessionStorage.removeItem(
        "retailerId"
    );

    sessionStorage.removeItem(
        "retailerName"
    );

    sessionStorage.removeItem(
        "retailerMobile"
    );


    /* LOCAL STORAGE */

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


    /* OLD KEYS */

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


    /* GO BACK TO RETAILER LOGIN */

    window.location.href =
        "retailer.html";

}


/* =====================================================
   SERVICE AMOUNT SETUP
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


    let servicePrice =
        0;


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
        async function (event) {

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
                    selectedOption.dataset.amount ||
                    0
                );


            if (amount <= 0) {

                showApplicationMessage(

                    message,

                    "⚠️ Service amount મળ્યો નથી.",

                    "error"

                );

                return;

            }


            const applicationId =
                generateApplicationId();


            const formData =
                collectApplicationData(
                    applicationId,
                    amount
                );


            console.log(
                "APPLICATION DATA:",
                formData
            );


            showApplicationMessage(

                message,

                "✅ Application ID: " +
                applicationId,

                "success"

            );

        }
    );

}


/* =====================================================
   COLLECT APPLICATION DATA
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


    return {

        applicationId:
            applicationId,


        retailerId:
            localStorage.getItem(
                "rajkumarRetailerId"
            ) ||
            sessionStorage.getItem(
                "retailerId"
            ) ||
            "",


        retailerMobile:
            localStorage.getItem(
                "rajkumarRetailerMobile"
            ) ||
            sessionStorage.getItem(
                "retailerMobile"
            ) ||
            "",


        service:
            document.getElementById(
                "serviceSelect"
            ).value,


        amount:
            amount,


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
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


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


    element.style.padding =
        "12px";


    element.style.marginTop =
        "15px";


    element.style.borderRadius =
        "10px";


    if (type === "success") {

        element.style.background =
            "#e8f5e9";

        element.style.color =
            "#2e7d32";

        element.style.border =
            "1px solid #c8e6c9";

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


/* =====================================================
   END
===================================================== */
