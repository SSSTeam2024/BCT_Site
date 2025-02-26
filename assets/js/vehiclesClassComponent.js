async function fetchVehiclesClass() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/vehicles-class-component/getVehiclesClass",
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

function updateVehiclesClass(vehicleClassData) {
  const currentFileName = getCurrentHtmlFileName();

  const specificVehicleClass = vehicleClassData.filter(
    (vehicleClass) =>
      vehicleClass.page.toLowerCase() === currentFileName.toLowerCase()
  );

  if (specificVehicleClass.length === 0) {
    console.warn("No Vehicle Class data available for this page.");
    return;
  }

  const vehicleClassContainer = document.querySelector("#vehicles_class");
  if (!vehicleClassContainer) {
    console.error("Vehicle Class container not found!");
    return;
  }

  // Clear existing content
  vehicleClassContainer.innerHTML = "";

  specificVehicleClass.forEach((vehicleClass) => {
    const container = document.createElement("div");
    container.classList.add("container");

    const divTitle = document.createElement("div");
    divTitle.classList.add("section-title");

    const title = document.createElement("h2");
    title.textContent = vehicleClass.bigTitle;
    divTitle.appendChild(title);
    container.appendChild(divTitle);

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    const paragraph = document.createElement("p");
    paragraph.textContent = vehicleClass.paragraph;

    rowDiv.appendChild(paragraph);
    container.appendChild(rowDiv);

    vehicleClass.vehicleTypes.forEach((type, index) => {
      const colList = document.createElement("div");
      colList.classList.add("col-lg-3", "col-sm-6");

      const serviceLocation = document.createElement("div");
      serviceLocation.classList.add("single-location");

      const link = document.createElement("a");
      link.setAttribute("href", type.link);

      const icon = document.createElement("i");
      type.icon.split(" ").forEach((cls) => icon.classList.add(cls));

      const span = document.createElement("span");
      span.textContent = type.title;

      link.appendChild(icon);
      link.appendChild(span);
      serviceLocation.appendChild(link);
      colList.appendChild(serviceLocation);
      rowDiv.appendChild(colList);
      // serviceTitle.addEventListener("click", () => {
      //   serviceSideWrap.innerHTML = "";
      //   // Right Content - Details
      //   const detailsWrap = document.createElement("ul");

      //   const detailsWrapList = document.createElement("li");
      //   const iconList = document.createElement("i");
      //   iconList.classList.add("bx", "bxs-radio-circle-marked");
      //   detailsWrapList.appendChild(iconList);
      //   detailsWrapList.append(` ${type.content}`);
      //   detailsWrap.appendChild(detailsWrapList);

      //   const imageDiv = document.createElement("div");
      //   imageDiv.classList.add("service-img");

      //   if (type.image) {
      //     const imageElement = document.createElement("img");
      //     imageElement.src = `${baseUrl}${type.image}`;
      //     imageElement.alt = `${type.title} Image`;
      //     imageDiv.appendChild(imageElement);
      //   }

      //   serviceSideWrap.appendChild(detailsWrap);
      //   serviceSideWrap.appendChild(imageDiv);
      // });
    });

    vehicleClassContainer.appendChild(container);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const vehiclesClassData = await fetchVehiclesClass();
  if (vehiclesClassData && Array.isArray(vehiclesClassData)) {
    updateVehiclesClass(vehiclesClassData);
  } else {
    console.error("Invalid or empty Vehicles Class data received.");
  }
});
