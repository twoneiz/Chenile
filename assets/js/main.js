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

    // Nav active state
    const navLinks = document.querySelectorAll(".main-nav a");
    if (navLinks.length) {
        const currentPage = (location.pathname.split("/").pop() || "index.html").toLowerCase();
        const currentHash = (location.hash || "").toLowerCase();

        const clearActiveAll = () => navLinks.forEach(l => l.classList.remove("active"));

        // Base active state (initial load)
        navLinks.forEach(link => link.classList.remove("active"));
        const initialSamePage = Array.from(navLinks).find(link => {
            const href = link.getAttribute("href") || "";
            const [pagePart, hashPart] = href.split("#");
            const targetPage = (pagePart || "").replace("./", "").toLowerCase() || "index.html";
            const targetHash = hashPart ? "#" + hashPart.toLowerCase() : "";
            const pageMatches = targetPage === currentPage;
            const hashMatches = targetHash && currentHash === targetHash;
            return pageMatches && (hashMatches || (!hashPart && !currentHash));
        });
        if (initialSamePage) initialSamePage.classList.add("active");

        // Scroll-based active state for same-page section links
        const sectionLinks = Array.from(navLinks).filter(link => {
            const href = link.getAttribute("href") || "";
            const [pagePart, hashPart] = href.split("#");
            const targetPage = (pagePart || "").replace("./", "").toLowerCase() || "index.html";
            return targetPage === currentPage && hashPart;
        });

        if (sectionLinks.length) {
            const sectionMap = sectionLinks.map(link => {
                const id = link.getAttribute("href").split("#")[1];
                const section = document.getElementById(id);
                return section ? { link, section } : null;
            }).filter(Boolean);

            const headerEl = document.querySelector(".site-header");
            const getHeaderOffset = () => (headerEl ? headerEl.offsetHeight : 0);

            let ticking = false;
            const updateActiveOnScroll = () => {
                const offset = getHeaderOffset() + 10;
                const targetLine = offset + window.innerHeight * 0.3;
                let best = null;
                sectionMap.forEach(item => {
                    const rect = item.section.getBoundingClientRect();
                    const center = rect.top + rect.height / 2;
                    const dist = Math.abs(center - targetLine);
                    if (best === null || dist < best.dist) {
                        best = { ...item, dist };
                    }
                });
                if (best) {
                    clearActiveAll();
                    best.link.classList.add("active");
                }
                ticking = false;
            };

            const onScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateActiveOnScroll);
                    ticking = true;
                }
            };

            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", onScroll);
            updateActiveOnScroll();
        }
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
