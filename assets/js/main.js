document.addEventListener("DOMContentLoaded", (event) => {
  const datePicker = document.getElementById("datePicker");
  const today = new Date().toISOString().split("T")[0];
  datePicker.setAttribute("min", today);
});

document.addEventListener("DOMContentLoaded", (event) => {
  const datePicker = document.getElementById("returnDatePicker");
  const today = new Date().toISOString().split("T")[0];
  datePicker.setAttribute("min", today);
});

const box = document.getElementById("box");

function handleRadioClick() {
  const selectedRadioButton = document.querySelector(
    'input[name="radio"]:checked'
  );

  if (selectedRadioButton) {
    const selectedValue = selectedRadioButton.value;
    // Display the selected value or do something with it
    switch (selectedValue) {
      case "show":
        localStorage.setItem("type", "Return");
        break;
      case "hide":
        localStorage.setItem("type", "One way");
        break;
      default:
        localStorage.setItem("type", "One way");
    }
  }

  if (document.getElementById("hide").checked) {
    box.style.display = "none";
  } else {
    box.style.display = "block";
  }
}

const radioButtons = document.querySelectorAll('input[name="radio"]');
radioButtons.forEach((radio) => {
  radio.addEventListener("click", handleRadioClick);
});

localStorage.setItem("type", "One way");

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    mapTypeControl: false,
    center: { lat: 52.4974437, lng: -2.0284357 },
    zoom: 10,
  });

  new AutocompleteDirectionsHandler(map);
}
class AutocompleteDirectionsHandler {
  map;
  originPlaceId;
  destinationPlaceId;
  travelMode;
  directionsService;
  directionsRenderer;
  pickup_address;
  dropdown_address;
  constructor(map) {
    this.map = map;
    this.originPlaceId = "";
    this.destinationPlaceId = "";
    this.pickup_address = {};
    this.dropdown_address = {};
    this.travelMode = google.maps.TravelMode.DRIVING;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);

    const originInput = document.getElementById("origin-input");
    const destinationInput = document.getElementById("destination-input");
    //   const modeSelector = document.getElementById("mode-selector");
    // Specify just the place data fields that you need.
    const originAutocomplete = new google.maps.places.Autocomplete(
      originInput,
      {
        fields: ["place_id", "geometry", "formatted_address", "name"],
        componentRestrictions: { country: "uk" },
      }
    );
    // Specify just the place data fields that you need.
    const destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput,
      {
        fields: ["place_id", "geometry", "formatted_address", "name"],
        componentRestrictions: { country: "uk" },
      }
    );
    this.setupPlaceChangedListener(originAutocomplete, "ORIG");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
  }

  setupPlaceChangedListener(autocomplete, mode) {
    autocomplete.bindTo("bounds", this.map);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.place_id) {
        window.alert("Please select an option from the dropdown list.");
        return;
      }

      if (mode === "ORIG") {
        this.originPlaceId = place.place_id;
        let lat = Object.values(place.geometry.location.toJSON())[0];
        let lon = Object.values(place.geometry.location.toJSON())[1];
        localStorage.setItem("lat", lat);
        localStorage.setItem("lon", lon);
        localStorage.setItem("pickupFullName", place.formatted_address);
      } else {
        this.destinationPlaceId = place.place_id;
        let lat_dest = Object.values(place.geometry.location.toJSON())[0];
        let lon_dest = Object.values(place.geometry.location.toJSON())[1];
        localStorage.setItem("lat_dest", lat_dest);
        localStorage.setItem("lon_dest", lon_dest);
        localStorage.setItem("destFullName", place.formatted_address);
      }

      this.route();
    });
  }
  route() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }

    const me = this;

    this.directionsService.route(
      {
        origin: { placeId: this.originPlaceId },
        destination: { placeId: this.destinationPlaceId },
        travelMode: this.travelMode,
      },
      (response, status) => {
        if (status === "OK") {
          localStorage.setItem(
            "distance",
            response.routes[0].legs[0].distance.value
          );
          localStorage.setItem(
            "duration",
            response.routes[0].legs[0].duration.text
          );
          localStorage.setItem(
            "durationValue",
            response.routes[0].legs[0].duration.value
          );
          me.directionsRenderer.setDirections(response);
          const paragraphDistance = document.getElementById("distanceForm");
          paragraphDistance.innerHTML =
            "Distance: " +
            (
              response.routes[0].legs[0].distance.value * 0.0006213711922
            ).toFixed(2) +
            " miles";
          const paragraphDuration = document.getElementById("durationForm");
          paragraphDuration.innerHTML =
            "Duration: " + response.routes[0].legs[0].duration.text;
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
}
window.initMap = initMap;

// Date & Time
$(document).ready(function () {
  $(".customButtons #nextBtn").click(function () {
    testClicked();
  });
});

function testClicked() {
  let day = $("#datePicker").val().slice(8, 10);
  let month = $("#datePicker").val().slice(5, 7);
  let year = $("#datePicker").val().slice(0, 4);
  let estimated_go = year + "-" + month + "-" + day;
  let time = $("#timePicker").val();
  let dayReturn = $("#returnDatePicker").val().slice(8, 10);
  let monthRetrun = $("#returnDatePicker").val().slice(5, 7);
  let yearReturn = $("#returnDatePicker").val().slice(0, 4);
  let estimated_return = yearReturn + "-" + monthRetrun + "-" + dayReturn;
  let timeReturn = $("#returnTimePicker").val();
  let estimated_time = time;
  let estimated_time_return = timeReturn;
  localStorage.setItem("goDate", estimated_go);
  localStorage.setItem("goTime", estimated_time);
  localStorage.setItem("returnDate", estimated_return);
  localStorage.setItem("returnTime", estimated_time_return);
}

// Passenger Number
function showCurrentValue(event) {
  const value = event.target.value;
  displayOption(value);
  localStorage.setItem("pax", value);
}
// Notes
function showCurrentValueTextArea(event) {
  const value = event.target.value;
  displayOption(value);
  localStorage.setItem("notes", value);
}

// Vehicle Type
const getVT = async () => {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/passengerLuggageLimit/getAllPassengerLuggageLimits"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

let passengerLuggageLimitOptions;
let max_pax;

const displayOption = async (val) => {
  let value = Number(val);
  max_pax = value;
  //$("#vehicleType").empty();
  var select = document.getElementById("vehicleType");
  select.innerHTML = "";
  passengerLuggageLimitOptions = await getVT();
  const option1 = passengerLuggageLimitOptions.filter(
    (item) => Number(item.max_passengers) >= value
  );

  // Assuming filtered is an array of objects with properties base_change and type
  const newEmptyOption = document.createElement("option");
  newEmptyOption.value = "";
  newEmptyOption.text = "Select Vehicle";

  select.add(newEmptyOption);

  for (const option of option1) {
    const newOption = document.createElement("option");
    newOption.value = option.vehicle_type.type;
    newOption.text = option.vehicle_type.type;
    select.add(newOption);
  }
};

// Add an event listener to #vehicleType
$("#vehicleType").on("change", function (event) {
  // Get the selected value
  //$("#luggage").empty();
  var select = document.getElementById("luggage");
  select.innerHTML = "";
  const selectedValue = event.target.value;
  // Do whatever you need with the selected value
  localStorage.setItem("vt", selectedValue);
  const optionLuggage = passengerLuggageLimitOptions.filter(
    (item) =>
      item.vehicle_type.type === selectedValue &&
      Number(item.max_passengers) >= max_pax
  );
  // Assuming filtered is an array of objects with properties base_change and type
  const newEmptyOption = document.createElement("option");
  newEmptyOption.value = "";
  newEmptyOption.text = "Select Luggage";
  select.add(newEmptyOption);

  for (const option of optionLuggage) {
    const newLuggage = document.createElement("option");
    newLuggage.value = option.max_luggage.description;
    newLuggage.text = option.max_luggage.description;
    select.add(newLuggage);
  }
});

$("#luggage").on("change", function (event) {
  // Get the selected value
  const selectedLuggage = event.target.value;
  localStorage.setItem("lgg", selectedLuggage);
});

// Journey Type
const getJourneys = async () => {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/journey/getAllJourneys"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const displayOptionJourneys = async () => {
  const options = await getJourneys();
  if (options) {
    for (const option of options) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#journeys").append(newOption);
    }
  } else {
    console.error("No valid data to display");
  }
};
displayOptionJourneys();
// Add an event listener to #vehicleType
$("#journeys").on("change", function (event) {
  // Get the selected value
  const selectedJourney = event.target.value;
  localStorage.setItem("jrn", selectedJourney);
});

// How did you hear about us!!
const getSource = async () => {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/source/getAllSources"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const displayOptionSource = async () => {
  const options = await getSource();
  if (options) {
    for (const option of options) {
      const newOption = document.createElement("option");
      newOption.value = option.name;
      newOption.text = option.name;
      $("#sources").append(newOption);
    }
  } else {
    console.error("No valid data to display");
  }
};

displayOptionSource();
// Add an event listener to #vehicleType
$("#sources").on("change", function (event) {
  // Get the selected value
  const selectedSource = event.target.value;
  localStorage.setItem("src", selectedSource);
});

$(document).ready(function () {
  $(".customButtons #nextBtn").click(function () {
    testtClicked();
  });
});

function testtClicked() {
  // email
  const paragraph = document.getElementById("email_visitor");
  paragraph.innerHTML = localStorage.getItem("email");

  // name
  const name_p = document.getElementById("name_visitor");
  name_p.innerHTML = localStorage.getItem("name");

  // phone
  const phone_p = document.getElementById("phone_visitor");
  phone_p.innerHTML = localStorage.getItem("phone");

  // go time
  const goDate = document.getElementById("go");
  goDate.innerHTML = localStorage.getItem("goDate");

  // return time
  const returnDate = document.getElementById("returnDate");
  returnDate.innerHTML = localStorage.getItem("returnDate");

  // pickup
  const pickup_adr = document.getElementById("pickup");
  pickup_adr.innerHTML = localStorage.getItem("pickupFullName");

  // dest
  const dest_adr = document.getElementById("dest");
  dest_adr.innerHTML = localStorage.getItem("destFullName");

  // pax
  const pax = document.getElementById("pax");
  pax.innerHTML = localStorage.getItem("pax");

  // dest
  const vt = document.getElementById("vt");
  vt.innerHTML = localStorage.getItem("vt");

  // pax
  const lgg = document.getElementById("lgg");
  lgg.innerHTML = localStorage.getItem("lgg");

  // dest
  const journey = document.getElementById("journey");
  journey.innerHTML = localStorage.getItem("jrn");

  // duration
  const duration = document.getElementById("duration");
  duration.innerHTML = localStorage.getItem("duration");

  // distance
  let distance_miles =
    Number(localStorage.getItem("distance")) * 0.0006213711922;
  const distance = document.getElementById("distance");
  distance.innerHTML = distance_miles.toFixed(2);
}

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}
const currentDate = getDate();

async function submitLoginForm(event) {
  event.preventDefault();
  let name_visitor = event.target["name"].value.trim();
  let phone_visitor = event.target["phone"].value.trim();
  let email_visitor = event.target["email"].value.trim();
  let startDate = localStorage.getItem("goDate");

  if (
    !name_visitor ||
    !phone_visitor ||
    !email_visitor ||
    !startDate ||
    !start_point.placeName ||
    !start_point.coordinates.lat ||
    !start_point.coordinates.lon ||
    !destination_point.placeName ||
    !destination_point.coordinates.lat ||
    !destination_point.coordinates.lon
  ) {
    // alert("Please fill in all required fields before submitting.");
    return;
  }

  let object = {
    name: name_visitor,
    phone: phone_visitor,
    email: email_visitor,
    estimated_start_time: localStorage.getItem("goDate"),
    estimated_return_start_time: localStorage.getItem("returnDate"),
    start_point: {
      placeName: localStorage.getItem("pickupFullName"),
      coordinates: {
        lat: localStorage.getItem("lat"),
        lon: localStorage.getItem("lon"),
      },
    },
    destination_point: {
      placeName: localStorage.getItem("destFullName"),
      coordinates: {
        lat: localStorage.getItem("lat_dest"),
        lon: localStorage.getItem("lon_dest"),
      },
    },
    status: "new",
    enquiryDate: currentDate,
  };
  let body = JSON.stringify(object);
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/visitor/newVisitor",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: body,
      }
    );

    const data = await response.json();
    localStorage.setItem("v_id", data._id);
    localStorage.setItem("email", data.email);
    localStorage.setItem("phone", data.phone);
    localStorage.setItem("name", data.name);
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("An error occurred while submitting. Please try again.");
  }
}

function convertToHHMM(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return {
    hours: hours,
    minutes: minutes,
  };
}

function addDurationToTime(time, hoursToAdd, minutesToAdd, givenDate) {
  const [hours, minutes] = time.split(":").map(Number);
  let totalMinutes = hours * 60 + minutes;
  totalMinutes += hoursToAdd * 60 + minutesToAdd;

  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;

  // Split the given date into year, month, and day
  const [year, month, day] = givenDate.split("-").map(Number);

  // Create a new Date object with the given date
  const currentDate = new Date(year, month - 1, day);

  // If adding time exceeds the current day
  if (totalMinutes >= 24 * 60) {
    // Increment the date by 1 day
    console.log("If condition");
    currentDate.setDate(currentDate.getDate() + 1);
  }
  let y = currentDate.getFullYear();
  let m = currentDate.getMonth() + 1;
  let d = currentDate.getDate().toLocaleString();

  return {
    date:
      String(y) +
      "-" +
      String(m).padStart(2, "0") +
      "-" +
      String(d).padStart(2, "0"),
    hours: newHours,
    minutes: newMinutes,
  };
}

async function submitQuoteForm(event) {
  event.preventDefault();
  let duration = convertToHHMM(Number(localStorage.getItem("durationValue")));
  let dropoffTime = addDurationToTime(
    localStorage.getItem("goTime"),
    duration.hours,
    duration.minutes,
    localStorage.getItem("goDate")
  );
  let clean_dropoff_date = dropoffTime.date;
  let clean_dropoff_time =
    String(dropoffTime.hours).padStart(2, "0") +
    ":" +
    String(dropoffTime.minutes).padStart(2, "0");

  let returnDropoffTime = addDurationToTime(
    localStorage.getItem("returnTime"),
    duration.hours,
    duration.minutes,
    localStorage.getItem("returnDate")
  );
  let clean_return_dropoff_date = returnDropoffTime.date;
  let clean_return_dropoff_time =
    String(returnDropoffTime.hours).padStart(2, "0") +
    ":" +
    String(returnDropoffTime.minutes).padStart(2, "0");

  let object = {
    pickup_time: localStorage.getItem("goTime"),
    date: localStorage.getItem("goDate"),
    dropoff_time: clean_dropoff_time,
    dropoff_date: clean_dropoff_date,
    return_time: localStorage.getItem("returnTime"),
    return_date: localStorage.getItem("returnDate"),
    return_dropoff_time: clean_return_dropoff_time,
    return_dropoff_date: clean_return_dropoff_date,
    id_visitor: localStorage.getItem("v_id"),
    passengers_number: localStorage.getItem("pax"),
    vehicle_type: localStorage.getItem("vt"),
    luggage_details: localStorage.getItem("lgg"),
    journey_type: localStorage.getItem("jrn"),
    start_point: {
      placeName: localStorage.getItem("pickupFullName"),
      coordinates: {
        lat: localStorage.getItem("lat"),
        lng: localStorage.getItem("lon"),
      },
    },
    destination_point: {
      placeName: localStorage.getItem("destFullName"),
      coordinates: {
        lat: localStorage.getItem("lat_dest"),
        lng: localStorage.getItem("lon_dest"),
      },
    },
    type: localStorage.getItem("type"),
    status: "Pending",
    progress: "New",
    enquiryDate: currentDate,
    distance: localStorage.getItem("distance"),
    duration: localStorage.getItem("duration"),
    category: "Private",
  };
  let body = JSON.stringify(object);
  let ObjectToUpdate = {
    visitor_id: localStorage.getItem("v_id"),
    status: "Pending",
  };

  const response = await fetch(
    "http://57.128.184.217:3000/api/quote/newQuote",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    }
  );

  response
    .json()
    .then((data) => {
      localStorage.clear();
    })
    .then(async () => {
      await fetch("http://localhost:3000/api/visitor/updateStatus", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ObjectToUpdate),
      });
    });
  setTimeout(() => {}, 2000);
}
function olLoadPage() {
  location.reload();
}

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("QuoteTab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == x.length - 1) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n);
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("QuoteTab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x,
    y,
    i,
    valid = true;
  x = document.getElementsByClassName("QuoteTab");
  y = x[currentTab].getElementsByTagName("input");
  let returnDate = document.getElementById("returnDatePicker");
  let returnTime = document.getElementById("returnTimePicker");
  let inputsArray = Array.from(y);
  let filteredInputs = inputsArray;
  if (currentTab === 0) {
    // Convert HTMLCollection to an array
    let type = localStorage.getItem("type");
    switch (type) {
      case "One way":
        filteredInputs = inputsArray.filter(
          (input) => input !== returnDate && input !== returnTime
        );
        break;
      case "Return":
        filteredInputs = inputsArray;
    }
  }

  if (currentTab === 1) {
    // Convert HTMLCollection to an array
    let journey = localStorage.getItem("jrn");
    if (journey === null) {
      valid = false;
    }
    let vehicleType = localStorage.getItem("vt");
    if (vehicleType === null) {
      valid = false;
    }
    let luggage = localStorage.getItem("lgg");
    if (luggage === null) {
      valid = false;
    }
  }

  // A loop that checks every input field in the current tab:
  for (i = 0; i < filteredInputs.length; i++) {
    // If a field is empty...
    if (filteredInputs[i].value == "") {
      // add an "invalid" class to the field:
      // filteredInputs[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }

  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }

  if (!valid) {
    alert("Please Fill in all the requested information!");
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i,
    x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}

window.onload = function clearStorage() {
  localStorage.clear();
  localStorage.setItem("type", "One way");
};
///////
// Javascript for tab navigation horizontal scroll buttons

// Select all the required elements
const tabMenu = document.querySelector(".tab__menu");
const tabs = document.querySelectorAll(".tab");
const tabBtns = document.querySelectorAll(".tab__btn");

// Function to handle tab navigation
const tab_Nav = function (tabBtnClick) {
  // Remove 'active' class from all buttons and tabs
  tabBtns.forEach((tabBtn) => {
    tabBtn.classList.remove("active");
  });

  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  // Add 'active' class to the clicked button and its corresponding tab
  tabBtns[tabBtnClick].classList.add("active");
  tabs[tabBtnClick].classList.add("active");
};

// Add click event listeners to all tab buttons
tabBtns.forEach((tabBtn, i) => {
  tabBtn.addEventListener("click", () => {
    tab_Nav(i);
  });
});
