// Update footer year
document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Mobile nav toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            mainNav.classList.toggle("open");
        });

        // Close menu when clicking a link (mobile)
        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
            });
        });
    }

    // Intersection Observer for scroll animations
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all if IntersectionObserver not supported
        animatedElements.forEach(el => el.classList.add("in-view"));
    }

    // Hero slider (no parallax)
    const slider = document.querySelector(".hero-slider");
    const dots = slider ? Array.from(document.querySelectorAll(".hero-dots .dot")) : [];
    if (slider) {
        const slides = Array.from(slider.querySelectorAll(".hero-slide"));
        let current = 0;
        let timer;

        const setSlide = index => {
            current = index;
            slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
            dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
        };

        const nextSlide = () => setSlide((current + 1) % slides.length);

        const start = () => {
            timer = window.setInterval(nextSlide, 5200);
        };

        const stop = () => timer && window.clearInterval(timer);

        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                stop();
                setSlide(i);
                start();
            });
        });

        setSlide(0);
        start();
    }

    // Demo: prevent default submit on contact form (front-end only)
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();
            alert("Thank you! This is a demo form only. Please also contact us via WhatsApp or Instagram.");
        });
    }
});
