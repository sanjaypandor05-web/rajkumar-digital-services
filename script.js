/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   HOME PAGE JAVASCRIPT
===================================================== */

"use strict";


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    initializeHomePage();

});


/* =====================================================
   INITIALIZE
===================================================== */

function initializeHomePage() {

    setupSmoothScroll();

    setupCardAnimation();

    setupPhoneLinks();

    console.log(
        "RAJKUMAR RATIONCARD SERVICES Home loaded successfully."
    );

}


/* =====================================================
   SMOOTH SCROLL
===================================================== */

function setupSmoothScroll() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    links.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });

}


/* =====================================================
   CARD ANIMATION
===================================================== */

function setupCardAnimation() {

    const cards =
        document.querySelectorAll(
            ".quick-card, .service-box, .contact-card"
        );

    if (!cards.length) {
        return;
    }


    if (
        !("IntersectionObserver" in window)
    ) {

        cards.forEach(function (card) {
            card.classList.add("show-card");
        });

        return;

    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "show-card"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    cards.forEach(function (card) {

        card.classList.add(
            "animate-card"
        );

        observer.observe(card);

    });

}


/* =====================================================
   PHONE LINKS
===================================================== */

function setupPhoneLinks() {

    const phoneLinks =
        document.querySelectorAll(
            'a[href="tel:9429193125"]'
        );

    phoneLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                console.log(
                    "Calling Rajkumar Rationcard Services."
                );

            }
        );

    });

}


/* =====================================================
   SECURITY HELPER
===================================================== */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
