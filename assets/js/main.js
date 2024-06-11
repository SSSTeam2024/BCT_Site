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
      { fields: ["place_id", "geometry", "formatted_address", "name"] }
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
  $("#datebtn").click(function () {
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
      "http://localhost:3000/api/vehicleType/getAllVehiclesTypes"
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

const displayOption = async (val) => {
  let value = Number(val);
  $("#vehicleType").empty();
  if (value === 1 || value === 2 || value === 3) {
    const options = await getVT();
    const option1 = [
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "29 Seat Standard Midi Coach",
      "29 Seat Luxury Midi Coach",
      "49 Seat Standard Coach",
      "49 Seat Executive Coach",
      "49 Seat Luxury Coach",
      "53 Seat Standard Coach",
      "53 Seat Executive Coach",
      "53 Seat Luxury Coach",
      "62 Seat Luxury Coach",
      "57 Seat Luxury Coach",
      "55 Seat Luxury Coach",
      "55 Seat Executive Coach",
      "57 Seat Executive Coach",
      "53 Seat Standard Coach",
      "29 Seat Executive Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "72 seater Standard",
      "Multiple Luxury Vehicles",
      "Multiple Executive Vehicles",
      "Multiple Standard Vehicles",
      "25 - 33 seat Luxury Midi Coach",
      "55 Seat Standard Coach",
      "36 Seat Luxury Team Coach",
      "62 Seat Standard Coach",
      "63 Seat Executive Coach",
      "62 Seat Executive Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value === 4 || value === 5 || value === 6) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "29 Seat Standard Midi Coach",
      "29 Seat Luxury Midi Coach",
      "49 Seat Standard Coach",
      "49 Seat Executive Coach",
      "49 Seat Luxury Coach",
      "53 Seat Standard Coach",
      "53 Seat Executive Coach",
      "53 Seat Luxury Coach",
      "62 Seat Luxury Coach",
      "57 Seat Luxury Coach",
      "55 Seat Luxury Coach",
      "55 Seat Executive Coach",
      "57 Seat Executive Coach",
      "53 Seat Standard Coach",
      "29 Seat Executive Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "72 seater Standard",
      "Multiple Luxury Vehicles",
      "Multiple Executive Vehicles",
      "Multiple Standard Vehicles",
      "25 - 33 seat Luxury Midi Coach",
      "55 Seat Standard Coach",
      "36 Seat Luxury Team Coach",
      "62 Seat Standard Coach",
      "63 Seat Executive Coach",
      "62 Seat Executive Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value === 7) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "29 Seat Standard Midi Coach",
      "29 Seat Luxury Midi Coach",
      "49 Seat Standard Coach",
      "49 Seat Executive Coach",
      "49 Seat Luxury Coach",
      "53 Seat Standard Coach",
      "53 Seat Executive Coach",
      "53 Seat Luxury Coach",
      "62 Seat Luxury Coach",
      "57 Seat Luxury Coach",
      "55 Seat Luxury Coach",
      "55 Seat Executive Coach",
      "57 Seat Executive Coach",
      "53 Seat Standard Coach",
      "29 Seat Executive Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "72 seater Standard",
      "Multiple Luxury Vehicles",
      "Multiple Executive Vehicles",
      "Multiple Standard Vehicles",
      "25 - 33 seat Luxury Midi Coach",
      "55 Seat Standard Coach",
      "36 Seat Luxury Team Coach",
      "62 Seat Standard Coach",
      "63 Seat Executive Coach",
      "62 Seat Executive Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value === 8) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "29 Seat Standard Midi Coach",
      "29 Seat Luxury Midi Coach",
      "49 Seat Standard Coach",
      "49 Seat Executive Coach",
      "49 Seat Luxury Coach",
      "53 Seat Standard Coach",
      "53 Seat Executive Coach",
      "53 Seat Luxury Coach",
      "62 Seat Luxury Coach",
      "57 Seat Luxury Coach",
      "55 Seat Luxury Coach",
      "55 Seat Executive Coach",
      "57 Seat Executive Coach",
      "53 Seat Standard Coach",
      "29 Seat Executive Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "72 seater Standard",
      "Multiple Luxury Vehicles",
      "Multiple Executive Vehicles",
      "Multiple Standard Vehicles",
      "25 - 33 seat Luxury Midi Coach",
      "55 Seat Standard Coach",
      "36 Seat Luxury Team Coach",
      "62 Seat Standard Coach",
      "63 Seat Executive Coach",
      "62 Seat Executive Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (
    value === 9 ||
    value === 10 ||
    value === 11 ||
    value === 12 ||
    value === 13 ||
    value === 14 ||
    value === 15 ||
    value === 16
  ) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "49 Seat Standard Coach",
      "49 Seat Executive Coach",
      "49 Seat Luxury Coach",
      "53 Seat Standard Coach",
      "53 Seat Executive Coach",
      "53 Seat Luxury Coach",
      "62 Seat Luxury Coach",
      "57 Seat Luxury Coach",
      "55 Seat Luxury Coach",
      "55 Seat Executive Coach",
      "57 Seat Executive Coach",
      "53 Seat Standard Coach",
      "29 Seat Executive Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "72 seater Standard",
      "Multiple Luxury Vehicles",
      "Multiple Executive Vehicles",
      "Multiple Standard Vehicles",
      "25 - 33 seat Luxury Midi Coach",
      "55 Seat Standard Coach",
      "36 Seat Luxury Team Coach",
      "62 Seat Standard Coach",
      "63 Seat Executive Coach",
      "62 Seat Executive Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (
    value === 17 ||
    value === 18 ||
    value === 19 ||
    value === 20 ||
    value === 21 ||
    value === 22 ||
    value === 23 ||
    value === 24
  ) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "Multiple Luxury Vehicles",
      "Multiple Executive Vehicles",
      "Multiple Standard Vehicles",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (
    value === 25 ||
    value === 26 ||
    value === 27 ||
    value === 28 ||
    value === 29
  ) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "Multiple Luxury Vehicles",
      "Multiple Executive Vehicles",
      "Multiple Standard Vehicles",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value === 30 || value === 31 || value === 32 || value === 33) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "Multiple Luxury Vehicles",
      "Multiple Executive Vehicles",
      "Multiple Standard Vehicles",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "29 Seat Standard Midi Coach",
      "29 Seat Executive Midi Coach",
      "29 Seat Luxury Midi Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value === 34 || value === 35 || value === 36) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "Multiple Luxury Vehicles",
      "Multiple Executive Vehicles",
      "Multiple Standard Vehicles",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "29 Seat Standard Midi Coach",
      "29 Seat Executive Midi Coach",
      "29 Seat Luxury Midi Coach",
      "25-33 Seat Luxury Midi Coach",
      "33 Seat Standard",
      "33 Seat Executive",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));

    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value >= 37 && value <= 49) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "Multiple Luxury Vehicles",
      "Multiple Executive Vehicles",
      "Multiple Standard Vehicles",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "29 Seat Standard Midi Coach",
      "29 Seat Executive Midi Coach",
      "29 Seat Luxury Midi Coach",
      "25 - 33 seat Luxury Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "36 Seat Luxury Team Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));

    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value >= 50 && value <= 53) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "29 Seat Standard Midi Coach",
      "29 Seat Executive Midi Coach",
      "29 Seat Luxury Midi Coach",
      "25 - 33 seat Luxury Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "36 Seat Luxury Team Coach",
      "49 Seat Standard Coach",
      "49 Seat Executive Coach",
      "49 Seat Luxury Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));

    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value >= 54 && value <= 55) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "29 Seat Standard Midi Coach",
      "29 Seat Executive Midi Coach",
      "29 Seat Luxury Midi Coach",
      "25 - 33 seat Luxury Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "36 Seat Luxury Team Coach",
      "49 Seat Standard Coach",
      "49 Seat Executive Coach",
      "49 Seat Luxury Coach",
      "53 Seat Executive Coach",
      "53 Seat Standard Coach",
      "53 Seat Luxury Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));

    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value >= 56 && value <= 57) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "29 Seat Standard Midi Coach",
      "29 Seat Executive Midi Coach",
      "29 Seat Luxury Midi Coach",
      "25 - 33 seat Luxury Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "36 Seat Luxury Team Coach",
      "49 Seat Standard Coach",
      "49 Seat Executive Coach",
      "49 Seat Luxury Coach",
      "53 Seat Executive Coach",
      "53 Seat Standard Coach",
      "53 Seat Luxury Coach",
      "55 Seat Luxury Coach",
      "55 Seat Executive Coach",
      "55 Seat Standard Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));

    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value >= "58" && value <= "62") {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "29 Seat Standard Midi Coach",
      "29 Seat Executive Midi Coach",
      "29 Seat Luxury Midi Coach",
      "25 - 33 seat Luxury Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "36 Seat Luxury Team Coach",
      "49 Seat Standard Coach",
      "49 Seat Executive Coach",
      "49 Seat Luxury Coach",
      "53 Seat Executive Coach",
      "53 Seat Standard Coach",
      "53 Seat Luxury Coach",
      "55 Seat Luxury Coach",
      "55 Seat Executive Coach",
      "55 Seat Standard Coach",
      "57 Seat Luxury Coach",
      "57 Seat Executive Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));

    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value === 63) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "29 Seat Standard Midi Coach",
      "29 Seat Executive Midi Coach",
      "29 Seat Luxury Midi Coach",
      "25 - 33 seat Luxury Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "36 Seat Luxury Team Coach",
      "49 Seat Standard Coach",
      "49 Seat Executive Coach",
      "49 Seat Luxury Coach",
      "53 Seat Executive Coach",
      "53 Seat Standard Coach",
      "53 Seat Luxury Coach",
      "55 Seat Luxury Coach",
      "55 Seat Executive Coach",
      "55 Seat Standard Coach",
      "57 Seat Luxury Coach",
      "57 Seat Executive Coach",
      "62 Seat Standard Coach",
      "62 Seat Luxury Coach",
      "62 Seat Executive Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));

    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value > 63 && value <= 72) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "29 Seat Standard Midi Coach",
      "29 Seat Executive Midi Coach",
      "29 Seat Luxury Midi Coach",
      "25 - 33 seat Luxury Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "36 Seat Luxury Team Coach",
      "49 Seat Standard Coach",
      "49 Seat Executive Coach",
      "49 Seat Luxury Coach",
      "53 Seat Executive Coach",
      "53 Seat Standard Coach",
      "53 Seat Luxury Coach",
      "55 Seat Luxury Coach",
      "55 Seat Executive Coach",
      "55 Seat Standard Coach",
      "57 Seat Luxury Coach",
      "57 Seat Executive Coach",
      "62 Seat Standard Coach",
      "62 Seat Luxury Coach",
      "62 Seat Executive Coach",
      "63 Seat Executive Coach",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));

    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
  if (value > 72) {
    const options = await getVT();
    const option1 = [
      "Standard Saloon Car",
      "Executive Saloon Car",
      "VIP Saloon Car",
      "Standard 6 Seat MPV",
      "Executive 6 Seat MPV",
      "VIP 6 Seat MPV",
      "Executive 7 Seat MPV",
      "Luxury 7 Seat MPV",
      "Standard 8 Seat MPV",
      "Executive 8 seat MPV",
      "10-16 Seat Standard Minibus",
      "10-16 Seat Executive Minibus",
      "14-16 Seat Luxury Minibus",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "17-24 Seat Standard Midi Coach",
      "17-24 Seat Executive Midi Coach",
      "17-24 Seat Luxury Midi Coach",
      "29 Seat Standard Midi Coach",
      "29 Seat Executive Midi Coach",
      "29 Seat Luxury Midi Coach",
      "25 - 33 seat Luxury Midi Coach",
      "33 seater standard",
      "33 seat executive",
      "36 Seat Luxury Team Coach",
      "49 Seat Standard Coach",
      "49 Seat Executive Coach",
      "49 Seat Luxury Coach",
      "53 Seat Executive Coach",
      "53 Seat Standard Coach",
      "53 Seat Luxury Coach",
      "55 Seat Luxury Coach",
      "55 Seat Executive Coach",
      "55 Seat Standard Coach",
      "57 Seat Luxury Coach",
      "57 Seat Executive Coach",
      "62 Seat Standard Coach",
      "62 Seat Luxury Coach",
      "62 Seat Executive Coach",
      "63 Seat Executive Coach",
      "72 seater Standard",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.type));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.type;
      newOption.text = option.type;
      $("#vehicleType").append(newOption);
    }
  }
};

// Add an event listener to #vehicleType
$("#vehicleType").on("change", function (event) {
  // Get the selected value
  const selectedValue = event.target.value;
  displayOptionLuggage(selectedValue);
  // Do whatever you need with the selected value
  localStorage.setItem("vt", selectedValue);
});
// Luggage Limit
const getLuggage = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/luggage/getAllLuggages"
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

const displayOptionLuggage = async (value) => {
  $("#luggage").empty();
  if (value === "VIP Saloon Car") {
    const options = await getLuggage();
    const option1 = [
      "Lap Luggage Only",
      "More than 2 x 22kg Check in Luggage each",
      "1 x 22kg Check in luggage and 1 x 10kg Hand Luggage per person",
      "1 x 10kg Hand Luggage and 1 set golf clubs each.",
      "1 x 10kg Hand luggage and 1 x small sports kit bag each",
      "1 Set of golf clubs each.",
      "1 x 20kg Check in luggage per person only",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter(
      (item) => !option1.includes(item.description)
    );
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }
  if (value === "10-16 Seat Standard Minibus") {
    const options = await getLuggage();
    const option1 = [
      "1 x 10kg Hand luggage per person only",
      "1 x 22kg Check in luggage and 1 x 10kg Hand Luggage per person",
      "1 x 10kg Hand Luggage and 1 set golf clubs each.",
      "1 x 10kg Hand luggage and 1 x small sports kit bag each",
      "1 Set of golf clubs each.",
      "1 x 20kg Check in luggage per person only",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter(
      (item) => !option1.includes(item.description)
    );
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }
  if (value === "17-24 Seat Standard Midi Coach") {
    const options = await getLuggage();
    const option1 = [
      "More than 2 x 22kg Check in Luggage each",
      "1 x 10kg Hand luggage per person only",
      "1 x 22kg Check in luggage and 1 x 10kg Hand Luggage per person",
      "1 x 10kg Hand Luggage and 1 set golf clubs each.",
      "1 x 10kg Hand luggage and 1 x small sports kit bag each",
      "1 Set of golf clubs each.",
      "1 x 20kg Check in luggage per person only",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter(
      (item) => !option1.includes(item.description)
    );
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }
  if (value === "Standard Saloon Car" || value === "Executive Saloon Car") {
    const options = await getLuggage();
    const option1 = [
      "More than 2 x 22kg Check in Luggage each",
      "1 x 22kg Check in luggage and 1 x 10kg Hand Luggage per person",
      "1 x 10kg Hand Luggage and 1 set golf clubs each.",
      "1 x 10kg Hand luggage and 1 x small sports kit bag each",
      "1 Set of golf clubs each.",
      "1 x 20kg Check in luggage per person only",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter(
      (item) => !option1.includes(item.description)
    );
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }
  if (value === "Standard 6 Seat MPV" || value === "Executive 6 Seat MPV") {
    const options = await getLuggage();
    const option1 = [
      "More than 2 x 22kg Check in Luggage each",
      "1 x 22kg Check in luggage and 1 x 10kg Hand Luggage per person",
      "1 x 10kg Hand Luggage and 1 set golf clubs each.",
      "1 x 10kg Hand luggage and 1 x small sports kit bag each",
      "1 Set of golf clubs each.",
      "1 x 20kg Check in luggage per person only",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter(
      (item) => !option1.includes(item.description)
    );
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }
  if (value === "29 Seat Standard Midi Coach") {
    const options = await getLuggage();
    const option1 = [
      "More than 2 x 22kg Check in Luggage each",
      "1 x 22kg Check in luggage and 1 x 10kg Hand Luggage per person",
      "1 x 10kg Hand Luggage and 1 set golf clubs each.",
      "1 x 10kg Hand luggage and 1 x small sports kit bag each",
      "1 Set of golf clubs each.",
      "1 x 20kg Check in luggage per person only",
    ];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter(
      (item) => !option1.includes(item.description)
    );
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }
  if (value === "29 Seat Luxury Midi Coach") {
    const options = await getLuggage();
    const option1 = ["3", "2", "3.50", "1.20"];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.size));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }

  if (value === "49 Seat Executive Coach" || value === "49 Seat Luxury Coach") {
    const options = await getLuggage();
    const option1 = ["3", "2", "3.50", "1.20"];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.size));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }

  if (
    value === "49 Seat Standard Coach" ||
    value === "17-24 Seat Luxury Midi Coach" ||
    value === "14-16 Seat Luxury Minibus"
  ) {
    const options = await getLuggage();
    const option1 = ["3.40", "2", "3.50", "1.20"];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.size));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }

  if (value === "53 Seat Standard Coach") {
    const options = await getLuggage();
    const option1 = ["3.40", "2", "3.50", "1.20", "3", "3.60", "4"];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.size));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }

  if (value === "53 Seat Executive Coach" || value === "53 Seat Luxury Coach") {
    const options = await getLuggage();
    const option1 = ["3.40", "2", "3.50", "1.20", "3.60", "4"];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.size));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }
  if (
    value === "17-24 Seat Standard Midi Coach" ||
    value === "17-24 Seat Executive Midi Coach"
  ) {
    const options = await getLuggage();
    const option1 = ["3", "3.50", "1.20", "3.40", "3.60", "4"];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.size));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }
  if (value === "VIP 6 Seat MPV") {
    const options = await getLuggage();
    const option1 = ["1.20", "2", "3.40", "3.50"];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.size));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }

  if (value === "62 Seat Luxury Coach") {
    const options = await getLuggage();
    const option1 = ["1.20", "2", "3.40", "3.50", "3.60", "4"];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.size));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }

  if (
    value === "57 Seat Luxury Coach" ||
    value === "57 Seat Luxury Coach" ||
    value === "55 Seat Executive Coach"
  ) {
    const options = await getLuggage();
    const option1 = ["1.20", "2", "3", "3.40", "3.50"];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.size));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }

  if (value === "Executive 7 Seat MPV" || value === "Executive 8 seat MPV") {
    const options = await getLuggage();
    const option1 = ["1.20", "3", "3.40", "3.50", "3.60", "4"];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.size));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }

  if (value === "Luxury 7 Seat MPV") {
    const options = await getLuggage();
    const option1 = ["1.20", "3.40", "3.50", "3.60", "4"];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.size));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }

  if (value === "Executive 6 Seat MPV") {
    const options = await getLuggage();
    const option1 = ["1.20", "2", "3.40", "3.50", "3.60", "4"];
    // Use filter to keep only the elements not present in option1
    const filtered = options.filter((item) => !option1.includes(item.size));
    // Assuming filtered is an array of objects with properties base_change and type
    for (const option of filtered) {
      const newOption = document.createElement("option");
      newOption.value = option.description;
      newOption.text = option.description;
      $("#luggage").append(newOption);
    }
  }
};

$("#luggage").on("change", function (event) {
  // Get the selected value
  const selectedLuggage = event.target.value;
  localStorage.setItem("lgg", selectedLuggage);
});

// Journey Type
const getJourneys = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/journey/getAllJourneys"
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
      "http://localhost:3000/api/source/getAllSources"
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
  $("#reviewbtn").click(function () {
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
  let email_visitor = "";
  let name_visitor = "";
  let phone_visitor = "";
  let startDate = "";
  const today = new Date();
  name_visitor = event.target["name"].value;
  phone_visitor = event.target["phone"].value;
  email_visitor = event.target["email"].value;
  startDate = localStorage.getItem("goDate");
  var hours = today.getHours();
  let minutes = today.getMinutes() + 1;
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  let date = /* "-- " +  */ hours + ":" + minutes + ampm;
  if (
    email_visitor === "" ||
    name_visitor === "" ||
    phone_visitor === "" ||
    localStorage.getItem("goDate") === date ||
    localStorage.getItem("pickupFullName") === null ||
    localStorage.getItem("destFullName") === null
  ) {
    var element = document.getElementById("menu1");
    element.classList.remove("active");
    var elementTab = document.getElementById("menu1Tab1");
    elementTab.classList.remove("active");
    var homeTab = document.getElementById("homeTab");
    homeTab.classList.add("active");
    homeTab.classList.remove("disabled-tab");
    var elementHome = document.getElementById("home");
    elementHome.classList.add("active");
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
  const response = await fetch("http://localhost:3000/api/visitor/newVisitor", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
  });

  response.json().then((data) => {
    localStorage.setItem("v_id", data._id);
    localStorage.setItem("email", data.email);
    localStorage.setItem("phone", data.phone);
    localStorage.setItem("name", data.name);
  });
}

async function verifyForm(event) {
  event.preventDefault();
  let pax = "";
  pax = localStorage.getItem("pax");
  let vehicleType = "";
  vehicleType = localStorage.getItem("vt");
  let luggage = "";
  luggage = localStorage.getItem("lgg");
  let journey = "";
  journey = localStorage.getItem("jrn");
  if (
    pax === null ||
    vehicleType === null ||
    journey === null ||
    luggage === null
  ) {
    var element = document.getElementById("menu2");
    element.classList.remove("active");
    var elementTab = document.getElementById("menu2Tab2");
    elementTab.classList.remove("active");
    var homeTab = document.getElementById("menu1Tab1");
    homeTab.classList.add("active");
    homeTab.classList.remove("disabled-tab");
    var elementHome = document.getElementById("menu1");
    elementHome.classList.add("active");
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
  let object = {
    pickup_time: localStorage.getItem("goTime"),
    date: localStorage.getItem("goDate"),
    dropoff_time: clean_dropoff_time,
    dropoff_date: clean_dropoff_date,
    return_time: localStorage.getItem("returnTime"),
    return_date: localStorage.getItem("returnDate"),
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

  const response = await fetch("http://localhost:3000/api/quote/newQuote", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
  });

  response
    .json()
    .then((data) => {
      localStorage.clear();
    })
    .then(() => {
      fetch("http://localhost:3000/api/visitor/updateStatus", {
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
