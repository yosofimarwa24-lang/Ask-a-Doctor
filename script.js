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