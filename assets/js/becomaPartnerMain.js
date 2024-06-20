let autocomplete;
let selectedLocations = [];
let selectedVehicles = [
  {
    type: "",
    qty: "",
  },
];
let coordinates = {
  lat: "",
  lng: "",
};
function initMapPartner() {
  const map = new google.maps.Map(document.getElementById("mapPartner"), {
    mapTypeControl: false,
    center: { lat: 52.4974437, lng: -2.0284357 },
    zoom: 10,
  });

  new AutocompleteDirectionsHandler(map);
  // Initialize the autocomplete object
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    {
      componentRestrictions: { country: "uk" },
    }
  );

  // Add event listener for place changed event
  autocomplete.addListener("place_changed", function () {
    // Get the selected place from the autocomplete object
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      console.error("No details available for input: " + place.name);
      return;
    }
    coordinates = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    localStorage.setItem("coor", JSON.stringify(coordinates));
    addSelectedOption(
      place.name,
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );
    addSelectedLocation(
      place.name,
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );

    // Clear the input field
    document.getElementById("autocomplete").value = "";
  });

  // Add event listener for click event on selected options
  document
    .getElementById("selectedOptions")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("selected-option")) {
        // Remove the clicked selected option
        removeSelectedOption(event.target.textContent);
      }
    });

  // Function to add a selected option to the selected options div
  function addSelectedOption(optionText) {
    const selectedOptionsDiv = document.getElementById("selectedOptions");
    const selectedOptionDiv = document.createElement("div");
    selectedOptionDiv.classList.add("selected-option");
    selectedOptionDiv.textContent = optionText;
    selectedOptionsDiv.appendChild(selectedOptionDiv);
  }

  // Function to remove a selected option from the selected options div and the selectedLocations array
  function removeSelectedOption(placeName) {
    selectedLocations = selectedLocations.filter(
      (location) => location.placeName !== placeName
    );
    document.querySelectorAll(".selected-option").forEach((option) => {
      if (option.textContent === placeName) {
        option.remove();
      }
    });
  }

  // Function to add a selected location to the selectedLocations array
  function addSelectedLocation(placeName, lat, lng) {
    selectedLocations.push({
      placeName: placeName,
      coordinates: JSON.parse(localStorage.getItem("coor")),
    });
    // localStorage.setItem("locations",  JSON.parse(selectedLocations))
    // console.log(selectedLocations)
  }
}

// Link to open Terms and Conditions in a new tab
document
  .getElementById("termsLink")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    window.open("terms-conditions.html", "_blank"); // Open the page in a new tab
  });

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

    const originInput = document.getElementById("depotAddress");
    const originAutocomplete = new google.maps.places.Autocomplete(
      originInput,
      {
        fields: ["place_id", "geometry", "formatted_address", "name"],
        componentRestrictions: { country: "uk" },
      }
    );

    this.setupPlaceChangedListener(originAutocomplete, "ORIG");
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

window.initMap = initMapPartner;

$("#vehicleTypeAffiliate").on("change", function (event) {
  const selectedOptions = $(this).find("option:selected");
  const selectedValues = [];

  selectedOptions.each(function () {
    const type = $(this).text();
    const qty = ""; // Initialize qty to empty string
    selectedValues.push({ type, qty });
  });

  updateSelectedValues(selectedValues);
});

function updateSelectedValues(selectedValues) {
  const selectedValuesContainer = $("#selectedVehicleTypes");
  selectedValuesContainer.empty();

  selectedValues.forEach(function (value) {
    const selectedValueElement = $("<div class='selected-value'></div>")
      .text(value.type)
      .click(function () {
        $(this).remove();
        const index = selectedValues.findIndex(
          (item) => item.type === value.type
        );
        selectedValues.splice(index, 1);
        localStorage.setItem("vta", JSON.stringify(selectedValues));
        $("#vehicleTypeAffiliate option")
          .filter(function () {
            return $(this).text() === value.type;
          })
          .prop("selected", false);
      });

    selectedValuesContainer.append(selectedValueElement);
  });
  selectedVehicles = selectedValues;
  console.log(selectedVehicles);
}

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result;
      const [, base64Data] = base64String.split(","); // Extract only the Base64 data
      const extension = file.name.split(".").pop() || ""; // Get the file extension
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

document
  .getElementById("IdFileBase64String")
  .addEventListener("change", async function (event) {
    const file = event.target.files[0];
    const fileContainer = document.getElementById("fileContainer");

    if (file && fileContainer) {
      try {
        const { base64Data, extension } = await convertToBase64(file);
        const newFile = base64Data + "." + extension;
        localStorage.setItem("file", newFile);
        localStorage.setItem("64", base64Data);
        localStorage.setItem("extension", extension);

        // // Create a blob from the base64 data
        // const byteCharacters = atob(base64Data);
        // const byteNumbers = new Array(byteCharacters.length);
        // for (let i = 0; i < byteCharacters.length; i++) {
        //   byteNumbers[i] = byteCharacters.charCodeAt(i);
        // }
        // const byteArray = new Uint8Array(byteNumbers);
        // const blob = new Blob([byteArray], { type: "application/" + extension });

        // // Create a blob URL for the blob
        // const blobUrl = URL.createObjectURL(blob);

        // // Create a link element to display the file name
        // const openLink = document.createElement("a");
        //   openLink.href = blobUrl;
        //   openLink.textContent = "Open File";
        //   openLink.target = "_blank"; // Open link in a new tab
        //   fileContainer.innerHTML = ''; // Clear previous content
        //   fileContainer.appendChild(openLink);
      } catch (error) {
        console.error(error);
      }
    }
  });

// Add an event listener to #region
$("#region").on("change", function (event) {
  // Get all selected options
  const selectedOptions = $(this).find("option:selected");

  // Extract values from selected options and store them in an array
  const selectedValues = [];
  selectedOptions.each(function () {
    selectedValues.push($(this).val());
  });

  // Store the array of selected values in localStorage
  localStorage.setItem("selectedRegions", JSON.stringify(selectedValues));
});

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}
const currentDate = getDate();

// Vehicle Type
const getVTA = async () => {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/vehicleType/getAllVehiclesTypes"
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

const displayOptionA = async () => {
  $("#vehicleTypeAffiliate").empty();
  const options = await getVTA();
  // Assuming filtered is an array of objects with properties base_change and type
  const filtered = options.filter(
    (item) =>
      item.type !== "Multiple Executive Vehicles" &&
      item.type !== "Multiple Luxury Vehicles" &&
      item.type !== "Multiple Standard Vehicles"
  );
  for (const option of filtered) {
    const newOption = document.createElement("option");
    newOption.value = option.type;
    newOption.text = option.type;
    $("#vehicleTypeAffiliate").append(newOption);
  }
};
displayOptionA();
async function submitBecomePartnerForm(event) {
  event.preventDefault();
  let email_affiliate = "";
  let name_affiliate = "";
  let licenceNumber = "";
  let phone_affiliate = "";
  let notes_affiliate = "";
  let address_affiliate = "";
  let website = "";
  let vehicleType = "";
  let coverageArea = "";
  let day = "";
  // vehicleType = JSON.parse(localStorage.getItem("vta"));
  name_affiliate = event.target["nameAffiliate"].value;
  licenceNumber = event.target["licenceNumber"].value;
  phone_affiliate = event.target["phoneAffiliate"].value;
  email_affiliate = event.target["emailAffiliate"].value;
  notes_affiliate = event.target["notes"].value;
  address_affiliate = event.target["address"].value;
  website = event.target["website"].value;
  day = $("#id_creation_date").val();

  let object = {
    name: name_affiliate,
    phone: phone_affiliate,
    email: email_affiliate,
    notes: notes_affiliate,
    address: address_affiliate,
    statusAffiliate: "Pending",
    enquiryDate: currentDate,
    number_file: licenceNumber,
    vehicles: selectedVehicles,
    id_creation_date: day,
    id_file: localStorage.getItem("file"), // Add file data to the object
    IdFileBase64String: localStorage.getItem("64"),
    IdFileExtension: localStorage.getItem("extension"),
    coverageArea: selectedLocations.map((location) => ({
      placeName: location.placeName,
      coordinates: {
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      },
    })),
    website: website,
  };
  let body = JSON.stringify(object);
  if (object.name.trim() === "") {
    var name = document.getElementById("divenameAffiliate");
    var paragraphName = document.createElement("p");
    paragraphName.setAttribute("id", "pnameAffiliate");
    paragraphName.textContent = "Please enter your name";
    name.appendChild(paragraphName);
    setTimeout(() => {
      name.removeChild(paragraphName);
    }, 2000);
  }

  if (object.number_file.trim() === "") {
    var licenceNumberDiv = document.getElementById("divlicenceNumber");
    var paragraphLicenceNumber = document.createElement("p");
    paragraphLicenceNumber.setAttribute("id", "pnameAffiliate");
    paragraphLicenceNumber.textContent = "Please enter your licence number";
    licenceNumberDiv.appendChild(paragraphLicenceNumber);
    setTimeout(() => {
      licenceNumberDiv.removeChild(paragraphLicenceNumber);
    }, 2000);
  }

  if (object.id_creation_date === "") {
    var dateDiv = document.getElementById("errorid_creation_date");
    var paragraphDateDiv = document.createElement("p");
    paragraphDateDiv.setAttribute("id", "pDateDiv");
    paragraphDateDiv.textContent = "Please select a date ";
    dateDiv.appendChild(paragraphDateDiv);
    setTimeout(() => {
      dateDiv.removeChild(paragraphDateDiv);
    }, 2000);
  }

  if (object.email.trim() === "") {
    var email = document.getElementById("divemailAffiliate");
    var paragraphEmail = document.createElement("p");
    paragraphEmail.setAttribute("id", "paraghraphEmailAffiliate");
    paragraphEmail.textContent = "Please enter your email";
    email.appendChild(paragraphEmail);
    setTimeout(() => {
      email.removeChild(paragraphEmail);
    }, 2000);
  }
  if (object.phone.trim() === "") {
    var element = document.getElementById("divphoneAffiliate");
    var paragraph = document.createElement("p");
    paragraph.setAttribute("id", "paraghraphPhoneAffiliate");
    paragraph.textContent = "Please enter your number";
    element.appendChild(paragraph);
    setTimeout(() => {
      element.removeChild(paragraph);
    }, 2000);
  }

  if (object.address.trim() === "") {
    var address = document.getElementById("errorAddress");
    var paragraphAddress = document.createElement("p");
    paragraphAddress.setAttribute("id", "addressAffiliate");
    paragraphAddress.textContent = "Please enter your address";
    address.appendChild(paragraphAddress);
    setTimeout(() => {
      address.removeChild(paragraphAddress);
    }, 2000);
  }

  if (object.coverageArea === null) {
    var depot_address = document.getElementById("errorSelectedOptions");
    var paragrapDepotAddress = document.createElement("p");
    paragrapDepotAddress.setAttribute("id", "pDepotAddress");
    paragrapDepotAddress.textContent = "Please enter your Area of Coverage";
    depot_address.appendChild(paragrapDepotAddress);
    setTimeout(() => {
      depot_address.removeChild(paragrapDepotAddress);
    }, 2000);
  }

  if (object.vehicles === null) {
    var vehicleElement = document.getElementById("errorVehicleType");
    var paragraphVehicle = document.createElement("p");
    paragraphVehicle.setAttribute("id", "pvehicleTypeAffiliate");
    paragraphVehicle.textContent = "Please select your Vehicle Type";
    vehicleElement.appendChild(paragraphVehicle);
    setTimeout(() => {
      vehicleElement.removeChild(paragraphVehicle);
    }, 2000);
  }

  if (!document.getElementById("termsCheckbox").checked) {
    var terms_Conditions = document.getElementById("errorTerms&Conditions");
    var paragraphTerms_Conditions = document.createElement("p");
    paragraphTerms_Conditions.setAttribute("id", "pvehicleTypeAffiliate");
    paragraphTerms_Conditions.textContent =
      "Please agree to the Terms and Conditions";
    terms_Conditions.appendChild(paragraphTerms_Conditions);
    setTimeout(() => {
      terms_Conditions.removeChild(paragraphTerms_Conditions);
    }, 3000);
  }

  if (
    object.coverageArea !== null &&
    object.vehicles !== null &&
    object.name.trim() !== "" &&
    object.email.trim() !== "" &&
    object.phone.trim() !== "" &&
    object.address.trim() !== "" &&
    document.getElementById("termsCheckbox").checked
  ) {
    var btn = document.getElementById("send_becomepartner_form");
    btn.setAttribute("data-target", "#alertModalAffiliate");
    $("#alertModalAffiliate").modal("show");
    const response = await fetch(
      "http://57.128.184.217:3000/api/affiliate/register",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: body,
      }
    ).then(() => localStorage.clear());
  }
}

function olLoadPage() {
  location.reload();
}
