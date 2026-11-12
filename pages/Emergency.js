const locationInput = document.getElementById("locationInput");
const googleMap = document.getElementById("googleMap");
const confirmBtn = document.getElementById("confirmBtn");
const gpsBtn = document.getElementById("gpsBtn");
const searchBtn = document.getElementById("searchBtn");
const mapStatus = document.getElementById("mapStatus");
const formStatus = document.getElementById("formStatus");
const selectedBox = document.getElementById("selectedBox");
const selectedText = document.getElementById("selectedText");
const confirmedAddress = document.getElementById("confirmedAddress");
const openMapsBtn = document.getElementById("openMapsBtn");

let selectedLocation = "";
let confirmedLocation = "";
let selectedCoordinates = null;

/* DISPLAY LOCATION */

function showLocation(address) {

    const query = address.trim();

    if (!query) {
        mapStatus.textContent = "Please enter an address first.";
        return;
    }

    selectedLocation = query;
    confirmedLocation = "";
    selectedCoordinates = null;
    confirmedAddress.value = "";

    confirmBtn.disabled = false;
    confirmBtn.innerHTML =
        '<i class="fa-solid fa-circle-check"></i> Confirm My Location';

    confirmBtn.style.background = "";

    openMapsBtn.style.display = "inline-flex";

    googleMap.src =
        "https://maps.google.com/maps?q=" +
        encodeURIComponent(query) +
        "&t=&z=15&ie=UTF8&iwloc=&output=embed";

    selectedBox.classList.add("show");
    selectedText.textContent = query;

    mapStatus.textContent =
        "Please check the location on the map and confirm it.";

    mapStatus.style.color = "";

    formStatus.textContent = "";
}

/* SEARCH */

searchBtn.addEventListener("click", function() {
    showLocation(locationInput.value);
});

locationInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        showLocation(locationInput.value);
    }
});

/* RESET CONFIRMATION */

locationInput.addEventListener("input", function() {
    confirmedLocation = "";
    selectedCoordinates = null;
    confirmedAddress.value = "";
    confirmBtn.disabled = true;
    confirmBtn.innerHTML =
        '<i class="fa-solid fa-circle-check"></i> Confirm My Location';
    confirmBtn.style.background = "";
    mapStatus.textContent = "Search again to update the map.";
});

/* GPS */

gpsBtn.addEventListener("click", function() {

    if (!navigator.geolocation) {
        mapStatus.textContent =
            "Geolocation is not supported by your browser.";
        return;
    }

    gpsBtn.disabled = true;
    gpsBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Finding location...';

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            selectedCoordinates = {lat, lon};

            const coordinates = lat + "," + lon;

            selectedLocation = coordinates;
            confirmedLocation = "";
            confirmedAddress.value = "";

            locationInput.value = coordinates;

            googleMap.src =
                "https://maps.google.com/maps?q=" +
                encodeURIComponent(coordinates) +
                "&t=&z=17&ie=UTF8&iwloc=&output=embed";

            selectedBox.classList.add("show");

            selectedText.textContent =
                "GPS Coordinates: " +
                lat.toFixed(6) + ", " + lon.toFixed(6);

            confirmBtn.disabled = false;
            confirmBtn.innerHTML =
                '<i class="fa-solid fa-circle-check"></i> Confirm My Location';

            confirmBtn.style.background = "";

            openMapsBtn.style.display = "inline-flex";

            mapStatus.textContent =
                "Your GPS position has been found. Please confirm it.";

            gpsBtn.disabled = false;
            gpsBtn.innerHTML =
                '<i class="fa-solid fa-location-crosshairs"></i> Use My Current Location';
        },

        function(error) {

            mapStatus.textContent =
                "Unable to get your location. Please allow location access or enter your address manually.";

            gpsBtn.disabled = false;
            gpsBtn.innerHTML =
                '<i class="fa-solid fa-location-crosshairs"></i> Use My Current Location';
        },

        {
            enableHighAccuracy:true,
            timeout:15000
        }
    );
});

/* CONFIRM LOCATION */

confirmBtn.addEventListener("click", function() {

    if (!selectedLocation) {
        mapStatus.textContent = "Please search for a location first.";
        return;
    }

    confirmedLocation = selectedLocation;
    confirmedAddress.value = selectedLocation;

    mapStatus.textContent =
        "Your location has been successfully confirmed.";

    mapStatus.style.color = "#159b69";

    confirmBtn.innerHTML =
        '<i class="fa-solid fa-check"></i> Location Confirmed';

    confirmBtn.style.background =
        "linear-gradient(135deg,#16a777,#28c995)";
});

/* OPEN GOOGLE MAPS */

openMapsBtn.addEventListener("click", function() {

    if (!selectedLocation) return;

    const url = selectedCoordinates
        ? "https://www.google.com/maps/search/?api=1&query=" +
          selectedCoordinates.lat + "," + selectedCoordinates.lon
        : "https://www.google.com/maps/search/?api=1&query=" +
          encodeURIComponent(selectedLocation);

    window.open(url, "_blank", "noopener,noreferrer");
});

/* FORM SUBMISSION */

document.getElementById("ambulanceForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const details = document.getElementById("details").value.trim();

    if (!name || !phone) {
        formStatus.textContent =
            "Please complete your name and phone number.";
        return;
    }

    if (!/^[+()\d\s-]{7,20}$/.test(phone)) {
        formStatus.textContent =
            "Please enter a valid phone number.";
        return;
    }

    if (!confirmedLocation) {
        formStatus.textContent =
            "Please confirm your location before submitting.";
        return;
    }

    const request = {
        name:name,
        phone:phone,
        details:details,
        location:confirmedLocation,
        coordinates:selectedCoordinates,
        submittedAt:new Date().toISOString()
    };

    console.log("Ambulance request:", request);

    formStatus.style.color = "#159b69";
    formStatus.textContent =
        "Demo request validated successfully! No ambulance has been dispatched.";

    console.log("Connect this form to your backend to process real requests.");
});

/* SCROLL REVEAL */

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }

    });

}, {threshold:0.12});

document.querySelectorAll(".reveal").forEach(element => {
    observer.observe(element);
});


  document.getElementById("currentYear").textContent = new Date().getFullYear();


  const backTop = document.getElementById("backTop");

  window.addEventListener("scroll", () => {
    backTop.classList.toggle("show", window.scrollY > 450);
  }, { passive: true });

  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
