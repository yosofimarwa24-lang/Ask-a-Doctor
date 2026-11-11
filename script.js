    const navLinks = document.querySelectorAll('.nav-link');

 navLinks.forEach(link => {

        link.addEventListener('click', function() {

            navLinks.forEach(item => {
                item.classList.remove('active');
            });

            this.classList.add('active');

        });

    });


    // Smooth scrolling

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener('click', function(e) {

            const target = document.querySelector(
                this.getAttribute('href')
            );

            if (target) {
                e.preventDefault();

                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }

        });

    });

const consultationMethods = [
    {
        icon:"fa-solid fa-comments",
        title:"Live Chat",
        description:"Talk to a doctor through secure messaging and get answers to your health questions.",
        detail:"Quick & convenient"
    },
    {
        icon:"fa-solid fa-phone-volume",
        title:"Voice Consultation",
        description:"Speak directly with a medical professional from wherever you feel comfortable.",
        detail:"Personal conversation"
    },
    {
        icon:"fa-solid fa-video",
        title:"Video Consultation",
        description:"Connect face-to-face with your doctor through an online video appointment.",
        detail:"Face-to-face care"
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
    {name:"Dr. James Wilson",specialty:"General Medicine"},
    {name:"Dr. Sarah Miller",specialty:"General Medicine"},
    {name:"Dr. Emily Carter",specialty:"Cardiology"},
    {name:"Dr. David Brown",specialty:"Dermatology"},
    {name:"Dr. Olivia Smith",specialty:"Pediatrics"},
    {name:"Dr. Daniel White",specialty:"Neurology"}
];

/* DOM ELEMENTS */

const methodsGrid=document.getElementById("methodsGrid");
const specialtySelect=document.getElementById("specialty");
const doctorSelect=document.getElementById("doctor");
const bookingForm=document.getElementById("bookingForm");
const formMessage=document.getElementById("formMessage");
const dateInput=document.getElementById("date");

/* HTML ESCAPE */

function escapeHTML(value){
    return String(value).replace(/[&<>"']/g,character=>{
        const entities={
            "&":"&amp;",
            "<":"&lt;",
            ">":"&gt;",
            '"':"&quot;",
            "'":"&#039;"
        };
        return entities[character];
    });
}

/* SCROLL REVEAL */

let revealObserver;

function observeRevealElements(){
    if(!("IntersectionObserver" in window)){
        document.querySelectorAll(".reveal").forEach(element=>{
            element.classList.add("visible");
        });
        return;
    }

    if(!revealObserver){
        revealObserver=new IntersectionObserver((entries,observer)=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },{threshold:.12});
    }

    document.querySelectorAll(".reveal:not(.visible)").forEach(element=>{
        /* fallback: anything already inside the viewport is revealed immediately,
           without waiting for the observer's async callback */
        const rect=element.getBoundingClientRect();
        if(rect.top<window.innerHeight&&rect.bottom>0){
            element.classList.add("visible");
            return;
        }
        revealObserver.observe(element);
    });
}

/* RENDER METHODS */

function renderMethods(){
    methodsGrid.innerHTML=consultationMethods.map(method=>`
        <article class="method-card reveal">
            <div class="method-icon">
                <i class="${method.icon}"></i>
            </div>
            <h3>${method.title}</h3>
            <p>${method.description}</p>
            <div class="method-meta">
                <span>${method.detail}</span>
                <i class="fa-solid fa-arrow-right"></i>
            </div>
        </article>
    `).join("");

    observeRevealElements();
}

/* RENDER SPECIALTIES */

function renderSpecialties(){
    specialties.forEach(specialty=>{
        const option=document.createElement("option");
        option.value=specialty;
        option.textContent=specialty;
        specialtySelect.appendChild(option);
    });
}

/* SPECIALTY CHANGE */

specialtySelect.addEventListener("change",function(){
    const selectedSpecialty=this.value;

    doctorSelect.innerHTML="";

    if(!selectedSpecialty){
        doctorSelect.disabled=true;
        doctorSelect.innerHTML='<option value="">Choose a specialty first</option>';
        return;
    }

    const filteredDoctors=doctors.filter(doctor=>
        doctor.specialty===selectedSpecialty
    );

    doctorSelect.disabled=filteredDoctors.length===0;

    doctorSelect.innerHTML=filteredDoctors.length
        ? '<option value="">Choose a doctor</option>'
        : '<option value="">No doctors available</option>';

    filteredDoctors.forEach(doctor=>{
        const option=document.createElement("option");
        option.value=doctor.name;
        option.textContent=doctor.name;
        doctorSelect.appendChild(option);
    });
});

/* DATE VALIDATION */

function setMinimumDate(){
    const today=new Date();
    const localDate=new Date(
        today.getTime()-today.getTimezoneOffset()*60000
    ).toISOString().split("T")[0];

    dateInput.min=localDate;
}

dateInput.addEventListener("change",function(){
    if(!this.value){
        this.setCustomValidity("");
        return;
    }

    const selectedDate=new Date(this.value+"T00:00:00");
    const today=new Date();
    today.setHours(0,0,0,0);

    this.setCustomValidity(
        selectedDate<today
        ?"Please select today or a future date."
        :""
    );
});

/* FORM VALIDATION */

bookingForm.addEventListener("submit",function(event){
    event.preventDefault();

    formMessage.className="form-message";
    formMessage.textContent="";

    if(!bookingForm.checkValidity()){
        bookingForm.reportValidity();
        formMessage.textContent="Please complete all required fields correctly.";
        formMessage.classList.add("error");
        return;
    }

    const fullName=document.getElementById("fullName").value.trim();
    const email=document.getElementById("email").value.trim();
    const specialty=specialtySelect.value;
    const doctor=doctorSelect.value;
    const date=dateInput.value;
    const time=document.getElementById("time").value;

    if(!fullName||!email||!specialty||!doctor||!date||!time){
        formMessage.textContent="Please fill in all required information.";
        formMessage.classList.add("error");
        return;
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        formMessage.textContent="Please enter a valid email address.";
        formMessage.classList.add("error");
        return;
    }

    const selectedDoctor=doctors.find(item=>
        item.name===doctor&&item.specialty===specialty
    );

    if(!selectedDoctor){
        formMessage.textContent="Please select a valid doctor.";
        formMessage.classList.add("error");
        return;
    }

    formMessage.innerHTML=`
        <strong>Appointment request prepared!</strong><br>
        Thank you, ${escapeHTML(fullName)}.
        Your selected doctor is ${escapeHTML(doctor)}.
        Requested date: ${escapeHTML(date)} at ${escapeHTML(time)}.
        <br><small>This is a front-end demonstration. No appointment has been sent or confirmed.</small>
    `;

    formMessage.className="form-message success";
});

/* COUNTER ANIMATION */

function animateCounter(counter){
    const target=Number(counter.dataset.target);
    const suffix=counter.dataset.suffix||"";
    const format=counter.dataset.format||"";
    const duration=1800;
    const startTime=performance.now();

    function updateCounter(currentTime){
        const progress=Math.min((currentTime-startTime)/duration,1);
        const easedProgress=1-Math.pow(1-progress,3);
        const currentValue=Math.floor(target*easedProgress);

        if(format==="hours"&&progress===1){
            counter.textContent="24/7";
        }else{
            counter.textContent=currentValue+suffix;
        }

        if(progress<1){
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

if("IntersectionObserver" in window){
    const counterObserver=new IntersectionObserver((entries,observer)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    },{threshold:.5});

    document.querySelectorAll(".counter-number").forEach(counter=>{
        counterObserver.observe(counter);
    });
}else{
    document.querySelectorAll(".counter-number").forEach(counter=>{
        animateCounter(counter);
    });
}

/* STAGGERED CARDS */

function setupCardAnimations(){
    document.querySelectorAll(".methods-grid > *, .process-grid > *")
    .forEach((card,index)=>{
        card.classList.add("reveal");
        card.style.transitionDelay=`${index%4*120}ms`;
    });

    observeRevealElements();
}

/* HERO PARALLAX */

const heroVisual=document.getElementById("heroVisual");
let scrollTicking=false;

window.addEventListener("scroll",()=>{
    if(scrollTicking)return;

    scrollTicking=true;

    requestAnimationFrame(()=>{
        if(heroVisual&&window.innerWidth>700){
            const movement=Math.min(window.scrollY*.10,55);

            if(window.scrollY<750){
                heroVisual.style.translate=`0 ${movement}px`;
            }else{
                heroVisual.style.translate="0 0";
            }
        }

        scrollTicking=false;
    });
},{passive:true});

/* INITIALIZE */

renderMethods();
renderSpecialties();
setMinimumDate();
setupCardAnimations();
observeRevealElements();



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