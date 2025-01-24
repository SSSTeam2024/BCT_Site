async function fetchVehicleGuide() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/vehicle-guide-component/getVehicleGuides",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Vehicle Guide data:", error.message);
    return null;
  }
}

function getCurrentHtmlFileName() {
  const path = document.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

function updateVehiclesGuide(vehicleGuideData) {
  const currentFileName = getCurrentHtmlFileName();

  const specificVehicleGuide = vehicleGuideData.filter(
    (vehicleGuide) =>
      vehicleGuide.page.toLowerCase() === currentFileName.toLowerCase()
  );

  console.log("currentFileName", currentFileName);
  console.log("specificVehicleGuide", specificVehicleGuide);
  if (specificVehicleGuide.length === 0) {
    console.warn("No Vehicle Guide data available for this page.");
    return;
  }

  const vehicleGuideContainer = document.querySelector("#vehicles_guide");
  if (!vehicleGuideContainer) {
    console.error("Vehicle Guide container not found!");
    return;
  }

  const baseUrl = "http://localhost:3000/VehicleGuide/";

  // Clear existing content
  vehicleGuideContainer.innerHTML = "";

  specificVehicleGuide.forEach((vehicleGuide) => {
    const container = document.createElement("div");
    container.classList.add("container");

    const paragraph = document.createElement("p");
    paragraph.textContent = vehicleGuide.paragraph;
    container.appendChild(paragraph);

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    const leftCol = document.createElement("div");
    leftCol.classList.add("col-lg-4");

    const serviceSidebar = document.createElement("div");
    serviceSidebar.classList.add("service-sidebar-area");

    const rightCol = document.createElement("div");
    rightCol.classList.add("col-lg-8");

    const serviceSideWrap = document.createElement("div");
    serviceSideWrap.classList.add("service-details-wrap");

    vehicleGuide.vehicleType.forEach((type, index) => {
      // Left Sidebar - Titles
      const serviceList = document.createElement("div");
      serviceList.classList.add("service-list", "service-card");

      const serviceTitle = document.createElement("h3");
      serviceTitle.classList.add("service-details-title");
      serviceTitle.textContent = type.title;

      serviceList.appendChild(serviceTitle);
      serviceSidebar.appendChild(serviceList);

      serviceTitle.addEventListener("click", () => {
        serviceSideWrap.innerHTML = "";
        // Right Content - Details
        const detailsWrap = document.createElement("ul");

        const detailsWrapList = document.createElement("li");
        const iconList = document.createElement("i");
        iconList.classList.add("bx", "bxs-radio-circle-marked");
        detailsWrapList.appendChild(iconList);
        detailsWrapList.append(` ${type.content}`);
        detailsWrap.appendChild(detailsWrapList);

        const imageDiv = document.createElement("div");
        imageDiv.classList.add("service-img");

        if (type.image) {
          const imageElement = document.createElement("img");
          imageElement.src = `${baseUrl}${type.image}`;
          imageElement.alt = `${type.title} Image`;
          imageDiv.appendChild(imageElement);
        }

        serviceSideWrap.appendChild(detailsWrap);
        serviceSideWrap.appendChild(imageDiv);
      });
    });
    leftCol.appendChild(serviceSidebar);
    rightCol.appendChild(serviceSideWrap);

    rowDiv.appendChild(leftCol);
    rowDiv.appendChild(rightCol);

    container.appendChild(rowDiv);
    vehicleGuideContainer.appendChild(container);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const vehiclesGuideData = await fetchVehicleGuide();
  if (vehiclesGuideData && Array.isArray(vehiclesGuideData)) {
    updateVehiclesGuide(vehiclesGuideData);
  } else {
    console.error("Invalid or empty Vehicle Guide data received.");
  }
});
