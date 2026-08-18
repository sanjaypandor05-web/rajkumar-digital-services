/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   RETAILER.JS
   FINAL VERSION
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzVyarGuWcFfauDBpPmD4d6xUak9MmINfcUGAbz1JrxA6s-n3nQOBUQszQxFQKsz25Iow/exec";


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    setupRetailerLogin();

    setupServiceAmount();

    setupApplicationForm();

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
        async function (event) {

            event.preventDefault();


            const retailerInput =
                document.getElementById("retailerId");

            const passwordInput =
                document.getElementById(
                    "retailerPassword"
                );

            const button =
                loginForm.querySelector(
                    "button[type='submit']"
                );


            const username =
                retailerInput
                    ? retailerInput.value.trim()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (!username || !password) {

                showLoginMessage(
                    "⚠️ Retailer ID અને Password દાખલ કરો.",
                    "error"
                );

                return;
            }


            if (button) {

                button.disabled = true;

                button.textContent =
                    "LOGIN...";

            }


            showLoginMessage(
                "🔄 Login ચેક થઈ રહ્યું છે...",
                "loading"
            );


            try {

                const response =
                    await fetch(
                        SCRIPT_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "text/plain;charset=utf-8"
                            },

                            body:
                                JSON.stringify({

                                    action:
                                        "retailerLogin",

                                    username:
                                        username,

                                    password:
                                        password

                                }),

                            redirect:
                                "follow"

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "HTTP Error " +
                        response.status
                    );

                }


                const responseText =
                    await response.text();


                console.log(
                    "RETAILER SERVER RESPONSE:",
                    responseText
                );


                let result;


                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                } catch (jsonError) {

                    console.error(
                        "JSON ERROR:",
                        jsonError
                    );

                    throw new Error(
                        "Invalid server response."
                    );

                }


                /* =====================================
                   LOGIN SUCCESS
                ===================================== */

                if (
                    result &&
                    result.success === true
                ) {


                    const retailerId =
                        String(
                            result.retailerId ||
                            username
                        ).trim();


                    const retailerName =
                        String(
                            result.retailerName ||
                            ""
                        ).trim();


                    const retailerMobile =
                        String(
                            result.mobile ||
                            result.retailerMobile ||
                            ""
                        ).trim();


                    const retailerUsername =
                        String(
                            result.username ||
                            username
                        ).trim();


                    /* =================================
                       SESSION STORAGE
                    ================================= */

                    sessionStorage.setItem(
                        "retailerLoggedIn",
                        "true"
                    );

                    sessionStorage.setItem(
                        "retailerId",
                        retailerId
                    );

                    sessionStorage.setItem(
                        "retailerName",
                        retailerName
                    );

                    sessionStorage.setItem(
                        "retailerMobile",
                        retailerMobile
                    );

                    sessionStorage.setItem(
                        "retailerUsername",
                        retailerUsername
                    );


                    /* =================================
                       LOCAL STORAGE
                    ================================= */

                    localStorage.setItem(
                        "rajkumarRole",
                        "retailer"
                    );

                    localStorage.setItem(
                        "rajkumarRetailerId",
                        retailerId
                    );

                    localStorage.setItem(
                        "rajkumarRetailerName",
                        retailerName
                    );

                    localStorage.setItem(
                        "rajkumarRetailerMobile",
                        retailerMobile
                    );

                    localStorage.setItem(
                        "rajkumarRetailerUsername",
                        retailerUsername
                    );


                    /* =================================
                       COMPATIBILITY KEYS
                    ================================= */

                    localStorage.setItem(
                        "retailerId",
                        retailerId
                    );

                    localStorage.setItem(
                        "retailerName",
                        retailerName
                    );

                    localStorage.setItem(
                        "retailerMobile",
                        retailerMobile
                    );

                    localStorage.setItem(
                        "retailerUsername",
                        retailerUsername
                    );


                    showLoginMessage(
                        "✅ Login Successful. Dashboard ખૂલી રહ્યું છે...",
                        "success"
                    );


                    setTimeout(
                        function () {

                            window.location.replace(
                                "retailer-dashboard.html"
                            );

                        },
                        500
                    );


                    return;

                }


                /* =====================================
                   LOGIN FAILED
                ===================================== */

                showLoginMessage(

                    result &&
                    result.message

                        ? "❌ " +
                          result.message

                        : "❌ Invalid Retailer ID અથવા Password.",

                    "error"

                );

            }


            catch (error) {

                console.error(
                    "RETAILER LOGIN ERROR:",
                    error
                );


                showLoginMessage(
                    "❌ Server connection failed. Apps Script deployment check કરો.",
                    "error"
                );

            }


            finally {

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "LOGIN";

                }

            }

        }
    );

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


    element.textContent =
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


    const option =
        select.options[
            select.selectedIndex
        ];


    let price = 0;


    if (
        option &&
        option.dataset &&
        option.dataset.amount
    ) {

        price =
            Number(
                option.dataset.amount
            );

    }


    if (amount) {

        amount.textContent =
            price;

    }


    if (paymentAmount) {

        paymentAmount.textContent =
            price;

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
                !service.value
            ) {

                showApplicationMessage(
                    message,
                    "⚠️ પહેલા Service પસંદ કરો.",
                    "error"
                );

                return;

            }


            const option =
                service.options[
                    service.selectedIndex
                ];


            const amount =
                Number(
                    option.dataset.amount ||
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


            const data =
                await collectApplicationData(
                    applicationId,
                    amount
                );


            showApplicationMessage(
                message,
                "🔄 Application submit થઈ રહી છે...",
                "loading"
            );


            try {

                const response =
                    await fetch(
                        SCRIPT_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "text/plain;charset=utf-8"
                            },

                            body:
                                JSON.stringify(data)

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "HTTP " +
                        response.status
                    );

                }


                const result =
                    await response.json();


                if (
                    result &&
                    result.success === true
                ) {

                    showApplicationMessage(
                        message,
                        "✅ Application Submitted Successfully. Application ID: " +
                        result.applicationId,
                        "success"
                    );


                    form.reset();

                    updateServiceAmount();

                    return;

                }


                showApplicationMessage(
                    message,
                    "❌ " +
                    (
                        result.message ||
                        "Application submit failed."
                    ),
                    "error"
                );

            }


            catch (error) {

                console.error(
                    "APPLICATION ERROR:",
                    error
                );


                showApplicationMessage(
                    message,
                    "❌ Server connection failed.",
                    "error"
                );

            }

        }
    );

}


/* =====================================================
   COLLECT APPLICATION DATA
===================================================== */

async function collectApplicationData(
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

        action:
            "submitApplication",

        applicationId:
            applicationId,


        retailerId:
            sessionStorage.getItem(
                "retailerId"
            ) ||
            localStorage.getItem(
                "rajkumarRetailerId"
            ) ||
            "",


        retailerMobile:
            sessionStorage.getItem(
                "retailerMobile"
            ) ||
            localStorage.getItem(
                "rajkumarRetailerMobile"
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
            Math.random() *
            90000
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


    element.textContent =
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
   LOGOUT
===================================================== */

function retailerLogout() {

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

    sessionStorage.removeItem(
        "retailerUsername"
    );


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


    window.location.replace(
        "retailer.html"
    );

}
