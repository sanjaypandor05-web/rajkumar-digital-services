/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   TRACK APPLICATION
===================================================== */


/*
 * Code.gs Deploy કર્યા પછી અહીં
 * Web App URL નાખવાનો રહેશે.
 */

const GOOGLE_SCRIPT_URL = "";


/* PAGE LOAD */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupTrackForm();

    }
);


/* FORM */

function setupTrackForm() {

    const form =
        document.getElementById(
            "trackForm"
        );


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const input =
                document.getElementById(
                    "applicationId"
                );


            const button =
                document.getElementById(
                    "trackButton"
                );


            const message =
                document.getElementById(
                    "trackMessage"
                );


            const applicationId =
                input.value
                    .trim()
                    .toUpperCase();


            if (
                !applicationId
            ) {

                showMessage(
                    message,
                    "⚠️ Application ID નાખો.",
                    false
                );

                return;

            }


            button.disabled =
                true;


            button.textContent =
                "⏳ Searching...";


            try {

                if (
                    !GOOGLE_SCRIPT_URL
                ) {

                    showMessage(
                        message,

                        "⚠️ Google Apps Script URL હજુ connect કરવાનું બાકી છે.",

                        false
                    );

                    return;

                }


                const result =
                    await trackApplication(
                        applicationId
                    );


                if (
                    result.success
                ) {

                    displayResult(
                        result
                    );

                    hideMessage(
                        message
                    );

                } else {

                    hideResult();

                    showMessage(
                        message,

                        "❌ " +
                        (
                            result.message ||
                            "Application મળ્યું નથી."
                        ),

                        false
                    );

                }


            } catch (error) {

                console.error(
                    error
                );


                hideResult();


                showMessage(
                    message,

                    "❌ Server સાથે connection થઈ શક્યું નથી.",

                    false
                );


            } finally {

                button.disabled =
                    false;

                button.textContent =
                    "🔎 Track Application";

            }

        }
    );

}


/* TRACK API */

async function trackApplication(
    applicationId
) {

    const response =
        await fetch(
            GOOGLE_SCRIPT_URL,
            {

                method: "POST",

                body:
                    JSON.stringify({

                        action:
                            "trackApplication",

                        applicationId:
                            applicationId

                    })

            }
        );


    return await response.json();

}


/* DISPLAY RESULT */

function displayResult(
    data
) {

    const section =
        document.getElementById(
            "resultSection"
        );


    section.style.display =
        "block";


    setText(
        "resultApplicationId",
        data.applicationId
    );


    setText(
        "resultApplicant",
        data.applicant || "-"
    );


    setText(
        "resultService",
        data.service || "-"
    );


    setText(
        "resultAmount",
        "₹" +
        Number(
            data.amount || 0
        )
    );


    setText(
        "resultMobile",
        data.mobile || "-"
    );


    setText(
        "resultDate",
        data.date || "-"
    );


    setText(
        "resultRetailer",
        data.retailerId || "-"
    );


    setText(
        "paymentStatus",
        data.paymentStatus || "Pending"
    );


    setText(
        "mainApplicationStatus",
        data.applicationStatus || "Pending"
    );


    setText(
        "resultUpdated",
        data.updatedAt || "-"
    );


    updateStatusBadge(
        data.applicationStatus
    );


    updateTimeline(
        data.paymentStatus,
        data.applicationStatus
    );


    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* TEXT */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* STATUS BADGE */

function updateStatusBadge(
    status
) {

    const badge =
        document.getElementById(
            "applicationStatusBadge"
        );


    if (!badge) return;


    const value =
        String(
            status || "Pending"
        );


    badge.textContent =
        value;


    badge.className =
        "status-badge";


    if (
        value.toLowerCase()
            .includes("complete")
    ) {

        badge.classList.add(
            "complete"
        );

    } else if (
        value.toLowerCase()
            .includes("process")
    ) {

        badge.classList.add(
            "processing"
        );

    } else {

        badge.classList.add(
            "pending"
        );

    }

}


/* TIMELINE */

function updateTimeline(
    paymentStatus,
    applicationStatus
) {

    clearTimeline();


    activate(
        "stepSubmitted"
    );


    const payment =
        String(
            paymentStatus || ""
        ).toLowerCase();


    const status =
        String(
            applicationStatus || ""
        ).toLowerCase();


    if (
        payment.includes("paid") ||
        payment.includes("verified") ||
        payment.includes("success")
    ) {

        activate(
            "stepPayment"
        );

    }


    if (
        status.includes("process") ||
        status.includes("approved") ||
        status.includes("complete")
    ) {

        activate(
            "stepProcessing"
        );

    }


    if (
        status.includes("complete") ||
        status.includes("completed") ||
        status.includes("done")
    ) {

        activate(
            "stepCompleted"
        );

    }

}


/* CLEAR */

function clearTimeline() {

    document
        .querySelectorAll(
            ".timeline-item"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "active"
                );

            }
        );

}


/* ACTIVATE */

function activate(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.classList.add(
            "active"
        );

    }

}


/* MESSAGE */

function showMessage(
    element,
    message,
    success
) {

    element.style.display =
        "block";

    element.innerHTML =
        message;


    if (success) {

        element.style.background =
            "#e8f5e9";

        element.style.color =
            "#2e7d32";

    } else {

        element.style.background =
            "#ffebee";

        element.style.color =
            "#c62828";

    }

}


/* HIDE MESSAGE */

function hideMessage(
    element
) {

    element.style.display =
        "none";

    element.innerHTML =
        "";

}


/* HIDE RESULT */

function hideResult() {

    const section =
        document.getElementById(
            "resultSection"
        );


    section.style.display =
        "none";

}