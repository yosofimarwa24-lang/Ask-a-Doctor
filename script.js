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

