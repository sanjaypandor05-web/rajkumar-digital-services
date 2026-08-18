/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   HOME PAGE JAVASCRIPT
===================================================== */


/* ================= TRACK BOX ================= */

function openTrackBox() {

    const box = document.getElementById("trackBox");

    if (box) {
        box.classList.remove("hidden");

        setTimeout(() => {

            const input =
                document.getElementById("trackApplicationId");

            if (input) {
                input.focus();
            }

        }, 100);
    }
}


/* ================= CLOSE TRACK BOX ================= */

function closeTrackBox() {

    const box = document.getElementById("trackBox");

    if (box) {
        box.classList.add("hidden");
    }

    const result =
        document.getElementById("trackResult");

    if (result) {
        result.innerHTML = "";
    }
}


/* ================= APPLICATION TRACK ================= */

function trackApplication() {

    const input =
        document.getElementById("trackApplicationId");

    const result =
        document.getElementById("trackResult");


    if (!input || !result) {
        return;
    }


    const applicationId =
        input.value.trim();


    /* Empty ID */

    if (applicationId === "") {

        result.innerHTML = `
            <div class="track-error">
                ⚠️ કૃપા કરીને Application ID નાખો.
            </div>
        `;

        return;
    }


    /* Temporary message */

    result.innerHTML = `
        <div class="track-loading">
            🔄 Application શોધી રહ્યા છીએ...
        </div>
    `;


    /*
       --------------------------------------------------
       IMPORTANT

       પછી અહીં Google Apps Script Web App URL
       નાખવામાં આવશે.

       Example:

       const GOOGLE_SCRIPT_URL =
       "YOUR_GOOGLE_APPS_SCRIPT_URL";

       ત્યારબાદ Google Sheetમાંથી
       Application Status આવશે.
       --------------------------------------------------
    */


    setTimeout(() => {

        result.innerHTML = `
            <div class="track-info">

                <h3>Application Track</h3>

                <p>
                    Application ID:
                    <strong>${escapeHtml(applicationId)}</strong>
                </p>

                <p>
                    ℹ️ Tracking system Google Sheet સાથે
                    connect થયા પછી અહીં તમારી
                    Applicationનું સાચું Status દેખાશે.
                </p>

            </div>
        `;

    }, 700);
}


/* ================= HTML SECURITY ================= */

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


/* ================= ENTER KEY ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const input =
            document.getElementById(
                "trackApplicationId"
            );


        if (input) {

            input.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {

                        trackApplication();

                    }

                }
            );

        }

    }
);


/* ================= PAGE READY ================= */

console.log(
    "RAJKUMAR RATIONCARD SERVICES loaded successfully."
);