/* =========================================================
   ASK A DOCTOR — script.js
   1 Data · 2 Helpers · 3 Navigation · 4 Methods · 5 Booking form
   6 Counters · 7 Reveal · 8 Hero parallax · 9 Page bottom (#ad-final)
========================================================= */

/* ===================== 1. DATA ===================== */

const consultationMethods = [
    {
        icon: "fa-solid fa-comments",
        title: "Live Chat",
        description: "Talk to a doctor through secure messaging and get answers to your health questions.",
        detail: "Quick & convenient"
    },
    {
        icon: "fa-solid fa-phone-volume",
        title: "Voice Consultation",
        description: "Speak directly with a medical professional from wherever you feel comfortable.",
        detail: "Personal conversation"
    },
    {
        icon: "fa-solid fa-video",
        title: "Video Consultation",
        description: "Connect face-to-face with your doctor through an online video appointment.",
        detail: "Face-to-face care"
    }
];

const specialties = [
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Neurology"
];

const doctors = [
    { name: "Dr. James Wilson",  specialty: "General Medicine" },
    { name: "Dr. Sarah Miller",  specialty: "General Medicine" },
    { name: "Dr. Emily Carter",  specialty: "Cardiology" },
    { name: "Dr. David Brown",   specialty: "Dermatology" },
    { name: "Dr. Olivia Smith",  specialty: "Pediatrics" },
    { name: "Dr. Daniel White",  specialty: "Neurology" }
];

const state = {
    selectedMethod: null
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/* ===================== 2. HELPERS ===================== */

const $id = (id) => document.getElementById(id);

function escapeHTML(value) {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

/* one shared reveal observer for every .reveal / .reveal-left / .reveal-right */
let revealObserver = null;

function observeReveal(scope) {
    const elements = (scope || document).querySelectorAll(
        ".reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)"
    );

    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("visible"));
        return;
    }

    if (!revealObserver) {
        revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    }

    elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add("visible");
        } else {
            revealObserver.observe(element);
        }
    });
}

function animateCounter(counter) {
    if (counter.dataset.animated === "true") return;
    counter.dataset.animated = "true";

    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";
    const format = counter.dataset.format || "";
    const duration = 1700;
    const startTime = performance.now();

    function update(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);

        if (progress === 1) {
            counter.textContent = format === "hours" ? "24/7" : target + suffix;
            return;
        }

        counter.textContent = Math.floor(target * eased) + suffix;
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

function observeCounters(selector, threshold) {
    const counters = document.querySelectorAll(selector);

    if (!("IntersectionObserver" in window)) {
        counters.forEach(animateCounter);
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            obs.unobserve(entry.target);
        });
    }, { threshold });

    counters.forEach((counter) => observer.observe(counter));
}


/* ===================== 3. NAVIGATION & LINKS ===================== */

(function setupNavigation() {
    const navLinks = document.querySelectorAll('.hero .nav-link[href^="#"]');
    const collapseEl = $id("mainNavbar");
    const sectionIds = Array.from(navLinks).map((link) => link.getAttribute("href").slice(1));

    function setActive(id) {
        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
    }

    /* smooth scroll for every in-page link (one single handler) */
    document.addEventListener("click", (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;

        const hash = link.getAttribute("href");

        if (hash === "#") {
            event.preventDefault();
            return;
        }

        const target = document.querySelector(hash);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        if (link.classList.contains("nav-link")) setActive(hash.slice(1));

        /* close the mobile menu */
        if (collapseEl && collapseEl.classList.contains("show") && window.bootstrap) {
            bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
        }
    });

    /* highlight the section currently on screen */
    window.addEventListener("scroll", () => {
        let current = sectionIds[0];

        sectionIds.forEach((id) => {
            const element = $id(id);
            if (element && element.getBoundingClientRect().top <= window.innerHeight * 0.35) {
                current = id;
            }
        });

        setActive(current);
    }, { passive: true });

    /* "coming soon" links */
    const toast = document.createElement("div");
    toast.className = "toast-soon";
    toast.textContent = "This page is coming soon";
    document.body.appendChild(toast);

    document.querySelectorAll("[data-soon]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 2200);
        });
    });

    /* specialty chosen in React → scroll to doctors */
    document.addEventListener("specialtySelected", () => {
        const doctorsSection = $id("doctors");
        if (doctorsSection) doctorsSection.scrollIntoView({ behavior: "smooth" });
    });
})();


/* ===================== 4. CONSULTATION METHODS ===================== */

function renderMethods() {
    const grid = $id("methodsGrid");
    if (!grid) return;

    grid.innerHTML = consultationMethods.map((method, index) => `
        <article class="method-card" data-index="${index}" tabindex="0"
                 role="button" aria-pressed="false">
            <i class="${escapeHTML(method.icon)}"></i>
            <h3>${escapeHTML(method.title)}</h3>
            <p>${escapeHTML(method.description)}</p>
            <div class="method-meta">
                <span>${escapeHTML(method.detail)}</span>
                <span class="method-arrow"><i class="fa-solid fa-arrow-right"></i></span>
            </div>
        </article>
    `).join("");

    /* event delegation: one listener for all cards */
    function selectCard(card) {
        const index = Number(card.dataset.index);
        state.selectedMethod = state.selectedMethod === index ? null : index;

        grid.querySelectorAll(".method-card").forEach((item) => {
            const isActive = Number(item.dataset.index) === state.selectedMethod;
            item.classList.toggle("active", isActive);
            item.setAttribute("aria-pressed", String(isActive));
        });
    }

    grid.addEventListener("click", (event) => {
        const card = event.target.closest(".method-card");
        if (card) selectCard(card);
    });

    grid.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const card = event.target.closest(".method-card");
        if (!card) return;
        event.preventDefault();
        selectCard(card);
    });
}


/* ===================== 5. BOOKING FORM ===================== */

(function setupBookingForm() {
    const form = $id("bookingForm");
    if (!form) return;

    const fields = {
        fullName:  $id("fullName"),
        email:     $id("email"),
        specialty: $id("specialty"),
        doctor:    $id("doctor"),
        date:      $id("date"),
        time:      $id("time")
    };
    const formMessage = $id("formMessage");

    /* --- fill specialty select --- */
    specialties.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        fields.specialty.appendChild(option);
    });

    /* --- minimum date = today (local time) --- */
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString().split("T")[0];
    fields.date.min = localToday;

    /* --- doctors depend on specialty --- */
    fields.specialty.addEventListener("change", () => {
        const selected = fields.specialty.value;
        fields.doctor.innerHTML = "";

        if (!selected) {
            fields.doctor.disabled = true;
            fields.doctor.innerHTML = '<option value="">Choose a specialty first</option>';
            return;
        }

        const matching = doctors.filter((doctor) => doctor.specialty === selected);

        fields.doctor.disabled = matching.length === 0;
        fields.doctor.innerHTML = matching.length
            ? '<option value="">Choose a doctor</option>'
            : '<option value="">No doctors available</option>';

        for (const doctor of matching) {
            const option = document.createElement("option");
            option.value = doctor.name;
            option.textContent = doctor.name;
            fields.doctor.appendChild(option);
        }
    });

    /* --- validation rules: one function per field, returns an error text or "" --- */
    const rules = {
        fullName(value) {
            if (!value) return "Please enter your full name.";
            if (value.length < 2) return "Name must be at least 2 characters.";
            if (!/^[\p{L}\s'.-]+$/u.test(value)) return "Name can only contain letters.";
            return "";
        },
        email(value) {
            if (!value) return "Please enter your email address.";
            if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email address.";
            return "";
        },
        specialty(value) {
            return value ? "" : "Please choose a specialty.";
        },
        doctor(value) {
            return value ? "" : "Please choose a doctor.";
        },
        date(value) {
            if (!value) return "Please choose a date.";
            if (value < localToday) return "Please select today or a future date.";
            return "";
        },
        time(value) {
            return value ? "" : "Please choose a time.";
        }
    };

    function showError(name, message) {
        const group = fields[name].closest(".form-group");
        let note = group.querySelector(".field-error");

        group.classList.toggle("has-error", Boolean(message));
        fields[name].setAttribute("aria-invalid", message ? "true" : "false");

        if (message) {
            if (!note) {
                note = document.createElement("small");
                note.className = "field-error";
                note.setAttribute("role", "alert");
                group.appendChild(note);
            }
            note.textContent = message;
        } else if (note) {
            note.remove();
        }
    }

    function validateField(name) {
        const message = rules[name](fields[name].value.trim());
        showError(name, message);
        return message === "";
    }

    /* live validation: check on blur, re-check while typing once a field has an error */
    Object.keys(fields).forEach((name) => {
        const field = fields[name];
        field.addEventListener("blur", () => validateField(name));
        field.addEventListener("input", () => {
            if (field.closest(".form-group").classList.contains("has-error")) validateField(name);
        });
        field.addEventListener("change", () => {
            if (field.closest(".form-group").classList.contains("has-error")) validateField(name);
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        formMessage.className = "form-message";
        formMessage.textContent = "";

        let firstInvalid = null;

        for (const name of Object.keys(fields)) {
            if (!validateField(name) && !firstInvalid) firstInvalid = fields[name];
        }

        if (firstInvalid) {
            firstInvalid.focus();
            formMessage.textContent = "Please fix the highlighted fields.";
            formMessage.classList.add("error");
            return;
        }

        const chosenDoctor = doctors.find((item) =>
            item.name === fields.doctor.value && item.specialty === fields.specialty.value
        );

        if (!chosenDoctor) {
            showError("doctor", "Please select a valid doctor.");
            return;
        }

        formMessage.innerHTML = `
            <strong>Appointment request prepared!</strong><br>
            Thank you, ${escapeHTML(fields.fullName.value.trim())}.
            Your selected doctor is ${escapeHTML(chosenDoctor.name)}.
            Requested date: ${escapeHTML(fields.date.value)} at ${escapeHTML(fields.time.value)}.
            <br><small>This is a front-end demonstration. No appointment has been sent or confirmed.</small>
        `;
        formMessage.className = "form-message success";

        form.reset();
        fields.doctor.disabled = true;
        fields.doctor.innerHTML = '<option value="">Choose a specialty first</option>';
    });
})();


/* ===================== 6. HERO PARALLAX ===================== */

(function setupParallax() {
    const heroVisual = $id("heroVisual");
    if (!heroVisual) return;

    let ticking = false;

    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const movement = window.innerWidth > 700 && window.scrollY < 750
                ? Math.min(window.scrollY * 0.1, 55)
                : 0;

            heroVisual.style.translate = `0 ${movement}px`;
            ticking = false;
        });
    }, { passive: true });
})();


/* ===================== INITIALIZE ===================== */

renderMethods();
observeReveal(document);
observeCounters(".counter-number", 0.5);


/* ===================== 7. PAGE BOTTOM (#ad-final) ===================== */

(() => {
    const root = document.querySelector("#ad-final");
    if (!root) return;

    const $ = (selector) => root.querySelector(selector);
    const $$ = (selector) => [...root.querySelectorAll(selector)];

    /* current year */
    const year = $("#currentYear");
    if (year) year.textContent = new Date().getFullYear();

    /* counters */
    observeCounters("#ad-final .counter", 0.65);

    /* ---------- review slider ---------- */
    const reviewTrack = $("#reviewTrack");
    const reviewCards = $$(".review-card");
    const previousButton = $("#reviewPrev");
    const nextButton = $("#reviewNext");
    const dotsContainer = $("#reviewDots");
    const reviewWindow = $(".review-window");

    let currentReview = 0;
    let visibleCards = 3;
    let autoSlide = null;

    const getVisibleCards = () => {
        if (window.innerWidth <= 700) return 1;
        if (window.innerWidth <= 950) return 2;
        return 3;
    };

    const getMaxIndex = () => Math.max(0, reviewCards.length - visibleCards);

    const updateSlider = () => {
        if (!reviewCards.length) return;

        visibleCards = getVisibleCards();
        currentReview = Math.min(currentReview, getMaxIndex());

        const gap = parseFloat(getComputedStyle(reviewTrack).columnGap) || 22;
        const cardWidth = reviewCards[0].getBoundingClientRect().width;

        reviewTrack.style.transform = `translateX(-${currentReview * (cardWidth + gap)}px)`;

        [...dotsContainer.children].forEach((dot, index) => {
            dot.classList.toggle("active", index === currentReview);
        });
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlide);
        autoSlide = null;
    };

    const startAutoSlide = () => {
        stopAutoSlide();
        if (document.hidden || reviewCards.length <= visibleCards) return;
        autoSlide = setInterval(() => moveSlider(1), 5500);
    };

    const moveSlider = (direction) => {
        const maxIndex = getMaxIndex();
        currentReview += direction;
        if (currentReview > maxIndex) currentReview = 0;
        if (currentReview < 0) currentReview = maxIndex;
        updateSlider();
    };

    const createDots = () => {
        dotsContainer.innerHTML = "";

        for (let i = 0; i <= getMaxIndex(); i++) {
            const dot = document.createElement("button");
            dot.className = "review-dot";
            dot.type = "button";
            dot.setAttribute("aria-label", `Show review page ${i + 1}`);
            dot.addEventListener("click", () => {
                currentReview = i;
                updateSlider();
                startAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
    };

    previousButton.addEventListener("click", () => { moveSlider(-1); startAutoSlide(); });
    nextButton.addEventListener("click", () => { moveSlider(1); startAutoSlide(); });

    reviewWindow.addEventListener("mouseenter", stopAutoSlide);
    reviewWindow.addEventListener("mouseleave", startAutoSlide);
    reviewWindow.addEventListener("focusin", stopAutoSlide);
    reviewWindow.addEventListener("focusout", startAutoSlide);

    /* swipe on touch screens */
    let touchStartX = 0;
    reviewWindow.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    reviewWindow.addEventListener("touchend", (event) => {
        const distance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(distance) > 50) {
            moveSlider(distance < 0 ? 1 : -1);
            startAutoSlide();
        }
    }, { passive: true });

    visibleCards = getVisibleCards();
    createDots();
    updateSlider();
    startAutoSlide();

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newVisible = getVisibleCards();
            if (newVisible !== visibleCards) {
                visibleCards = newVisible;
                currentReview = 0;
                createDots();
            }
            updateSlider();
            startAutoSlide();
        }, 120);
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopAutoSlide(); else startAutoSlide();
    });

    /* ---------- FAQ accordion ---------- */
    const faqItems = $$(".faq-item");

    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {
            const wasOpen = item.classList.contains("open");

            faqItems.forEach((other) => {
                other.classList.remove("open");
                other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
            });

            if (!wasOpen) {
                item.classList.add("open");
                question.setAttribute("aria-expanded", "true");
            }
        });
    });

    /* ---------- newsletter validation ---------- */
    const newsletterForm = $("#newsletterForm");
    const emailInput = $("#newsletterEmail");
    const newsletterMessage = $("#newsletterMessage");

    function setNewsletterMessage(text, isError) {
        newsletterMessage.textContent = text;
        newsletterMessage.classList.toggle("error", isError);
        newsletterForm.classList.toggle("has-error", isError);
    }

    newsletterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = emailInput.value.trim();

        if (!email) {
            setNewsletterMessage("Please enter your email address.", true);
            emailInput.focus();
            return;
        }

        if (!EMAIL_PATTERN.test(email)) {
            setNewsletterMessage("Please enter a valid email address.", true);
            emailInput.focus();
            return;
        }

        setNewsletterMessage("Thank you! You are subscribed (demo).", false);
        newsletterForm.reset();
    });

    emailInput.addEventListener("input", () => setNewsletterMessage("", false));

    /* ---------- back to top ---------- */
    const backTop = $("#backTop");

    const updateBackTop = () => backTop.classList.toggle("show", window.scrollY > 450);
    window.addEventListener("scroll", updateBackTop, { passive: true });
    updateBackTop();

    backTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ---------- fine-pointer effects ---------- */
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (finePointer) {
        /* 3D tilt */
        $$(".stat-card, .review-card").forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                card.style.setProperty("--tilt-y", `${((x - rect.width / 2) / (rect.width / 2)) * 5}deg`);
                card.style.setProperty("--tilt-x", `${((rect.height / 2 - y) / (rect.height / 2)) * 5}deg`);
            });

            card.addEventListener("pointerleave", () => {
                card.style.setProperty("--tilt-x", "0deg");
                card.style.setProperty("--tilt-y", "0deg");
            });
        });
    }

    /* ---------- scroll progress bar ---------- */
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(progressBar);

    let progressTicking = false;

    function updateProgress() {
        if (progressTicking) return;
        progressTicking = true;

        requestAnimationFrame(() => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = scrollable > 0 ? `${(window.scrollY / scrollable) * 100}%` : "0%";
            progressTicking = false;
        });
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    /* ---------- floating particles ---------- */
    [$(".trust-section"), $(".faq-section")].forEach((section) => {
        if (!section) return;

        for (let i = 0; i < 9; i++) {
            const particle = document.createElement("span");
            particle.className = "floating-particle";
            particle.style.left = `${Math.random() * 95}%`;
            particle.style.top = `${Math.random() * 95}%`;
            particle.style.animationDelay = `${Math.random() * -8}s`;
            particle.style.animationDuration = `${6 + Math.random() * 6}s`;
            section.appendChild(particle);
        }
    });

    /* ---------- button ripple ---------- */
    $$(".review-arrow, .newsletter-form button, .back-top").forEach((button) => {
        button.addEventListener("click", (event) => {
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const ripple = document.createElement("span");

            ripple.className = "btn-ripple";
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

            button.appendChild(ripple);
            ripple.addEventListener("animationend", () => ripple.remove());
        });
    });
})();