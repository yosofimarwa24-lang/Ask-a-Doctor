
/* ==========================================
   ASK A DOCTOR — SECTION FIVE JAVASCRIPT
========================================== */

(() => {
  const root = document.querySelector("#ad-final");
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];

  /* 1. Current year */
  const year = $("#currentYear");
  if (year) year.textContent = new Date().getFullYear();


  /* 2. Scroll reveal */
  const revealElements = $$(".reveal, .reveal-left, .reveal-right");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold:0.12,
      rootMargin:"0px 0px -35px 0px"
    });

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${(index % 4) * 80}ms`;
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => element.classList.add("visible"));
  }


  /* 3. Animated statistics */
  const counters = $$(".counter");

  const animateCounter = (counter) => {
    if (counter.dataset.animated === "true") return;
    counter.dataset.animated = "true";

    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";
    const duration = 1600;
    const startTime = performance.now();

    const update = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(eased * target);

      counter.textContent = currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.65});

    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }


  /* 4. Patient review slider */
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
        restartAutoSlide();
      });

      dotsContainer.appendChild(dot);
    }
  };

  const updateSlider = () => {
    if (!reviewCards.length) return;

    visibleCards = getVisibleCards();
    currentReview = Math.min(currentReview, getMaxIndex());

    const cardWidth = reviewCards[0].getBoundingClientRect().width;
    const gap = 22;

    reviewTrack.style.transform =
      `translateX(-${currentReview * (cardWidth + gap)}px)`;

    [...dotsContainer.children].forEach((dot, index) => {
      dot.classList.toggle("active", index === currentReview);
    });
  };

  const moveSlider = (direction) => {
    const maxIndex = getMaxIndex();

    currentReview += direction;

    if (currentReview > maxIndex) currentReview = 0;
    if (currentReview < 0) currentReview = maxIndex;

    updateSlider();
  };

  const stopAutoSlide = () => {
    if (autoSlide) {
      clearInterval(autoSlide);
      autoSlide = null;
    }
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    if (document.hidden || reviewCards.length <= visibleCards) return;

    autoSlide = setInterval(() => moveSlider(1), 5500);
  };

  const restartAutoSlide = () => startAutoSlide();

  previousButton.addEventListener("click", () => {
    moveSlider(-1);
    restartAutoSlide();
  });

  nextButton.addEventListener("click", () => {
    moveSlider(1);
    restartAutoSlide();
  });

  reviewWindow.addEventListener("mouseenter", stopAutoSlide);
  reviewWindow.addEventListener("mouseleave", startAutoSlide);
  reviewWindow.addEventListener("focusin", stopAutoSlide);
  reviewWindow.addEventListener("focusout", startAutoSlide);

  createDots();
  updateSlider();
  startAutoSlide();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newVisibleCards = getVisibleCards();

      if (newVisibleCards !== visibleCards) {
        visibleCards = newVisibleCards;
        currentReview = 0;
        createDots();
      }

      updateSlider();
    }, 120);
  });


  /* 5. FAQ accordion */
  const faqItems = $$(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("open");
        otherItem.querySelector(".faq-question")
          .setAttribute("aria-expanded", "false");
      });

      if (!wasOpen) {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });


  /* 6. Newsletter validation */
  const newsletterForm = $("#newsletterForm");
  const emailInput = $("#newsletterEmail");
  const newsletterMessage = $("#newsletterMessage");

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newsletterMessage.textContent = "Please enter your email address.";
      emailInput.focus();
      return;
    }

    if (!emailPattern.test(email)) {
      newsletterMessage.textContent = "Please enter a valid email address.";
      emailInput.focus();
      return;
    }

    newsletterMessage.textContent =
      "Thank you! This demo form is ready to connect to a newsletter service.";

    newsletterForm.reset();
  });

  emailInput.addEventListener("input", () => {
    newsletterMessage.textContent = "";
  });


  /* 7. Back to top */
  const backTop = $("#backTop");

  const updateBackTop = () => {
    backTop.classList.toggle("show", window.scrollY > 450);
  };

  window.addEventListener("scroll", updateBackTop, {passive:true});
  updateBackTop();

  backTop.addEventListener("click", () => {
    window.scrollTo({top:0,behavior:"smooth"});
  });


  /* 8. Smooth scrolling */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        event.preventDefault();
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({behavior:"smooth",block:"start"});
      }
    });
  });


  /* 9. Mouse-following light */
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (finePointer) {
    root.addEventListener("pointermove", (event) => {
      const rect = root.getBoundingClientRect();
      root.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      root.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    });
  }


  /* 10. 3D tilt effect */
  const tiltCards = $$(".stat-card, .review-card");

  if (finePointer) {
    tiltCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 5;
        const rotateX = ((centerY - y) / centerY) * 5;

        card.style.setProperty("--tilt-x", `${rotateX}deg`);
        card.style.setProperty("--tilt-y", `${rotateY}deg`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }


  /* 11. Scroll progress bar */
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.setAttribute("aria-hidden", "true");
  root.appendChild(progressBar);

  let scrollTicking = false;

  const updatePremiumScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;

    requestAnimationFrame(() => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

      progressBar.style.width = `${progress}%`;
      scrollTicking = false;
    });
  };

  window.addEventListener("scroll", updatePremiumScroll, {passive:true});
  window.addEventListener("resize", updatePremiumScroll);
  updatePremiumScroll();


  /* 12. Floating decorative particles */
  const particleSections = [
    $(".trust-section"),
    $(".reviews-section"),
    $(".faq-section")
  ];

  particleSections.forEach((section) => {
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


  /* 13. Button ripple effect */
  const rippleButtons = $$(".review-arrow, .newsletter-form button, .back-top");

  if (!document.querySelector("#premiumRippleStyle")) {
    const rippleStyle = document.createElement("style");
    rippleStyle.id = "premiumRippleStyle";
    rippleStyle.textContent = `
      @keyframes premiumRipple {
        to {
          transform:scale(2.8);
          opacity:0;
        }
      }
    `;
    document.head.appendChild(rippleStyle);
  }

  rippleButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);

      ripple.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size}px;
        left:${event.clientX - rect.left - size / 2}px;
        top:${event.clientY - rect.top - size / 2}px;
        border-radius:50%;
        background:rgba(255,255,255,.35);
        transform:scale(0);
        animation:premiumRipple .6s ease-out;
        pointer-events:none;
      `;

      button.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });


  /* 14. Pause slider when tab is hidden */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoSlide();
    } else {
      startAutoSlide();
    }
    
    
  });

})();


