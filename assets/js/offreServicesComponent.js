async function fetchOffreServices() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/offre-service-component/getOfferService",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    return null;
  }
}

function updateOffreServices(offreServicesData) {
  const baseUrl = "http://localhost:3000/offerService/";

  const offreServicesContainer = document.querySelector("#offreServices");

  if (!offreServicesContainer) {
    console.error("Our Values container not found!");
    return;
  }

  offreServicesContainer.innerHTML = "";

  const offreContainer = document.createElement("div");
  offreContainer.classList.add("container");

  const sectionTitle = document.createElement("div");
  sectionTitle.classList.add("section-title");
  const rowSection = document.createElement("div");
  rowSection.classList.add("row");

  offreServicesData.map((offre) => {
    if (offre.littleTitle.display === "1") {
      const littleTitle = document.createElement("span");
      littleTitle.textContent = offre.littleTitle.name;
      sectionTitle.appendChild(littleTitle);
    }
    if (offre.bigTitle.display === "1") {
      const bigTitle = document.createElement("h2");
      bigTitle.textContent = offre.bigTitle.name;
      sectionTitle.appendChild(bigTitle);
    }
    offre.cards.map((card, index) => {
      const imagePath = card.image.startsWith("http")
        ? card.image
        : `${baseUrl}${card.image}`;
      console.log("image", card.image);
      if (card.display === "1") {
        const singleService = document.createElement("div");
        singleService.classList.add("single-service");
        const uniqueClass = `single-service`;
        singleService.classList.add(uniqueClass);

        const style = document.createElement("style");
        style.textContent = `
  .${uniqueClass}::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${imagePath});
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -1;
  }
`;
        const colSection = document.createElement("div");
        colSection.classList.add("col-lg-4", "col-sm-6");

        const styleCol = document.createElement("style");
        styleCol.textContent = `
    .col-lg-4:nth-child(${index + 1}) .single-service::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url(${imagePath});
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
      z-index: -1;
    }
  `;
        document.head.appendChild(style);
        document.head.appendChild(styleCol);

        const serviceContentWrap = document.createElement("div");
        serviceContentWrap.classList.add("service-content-wrap");
        const iconService = document.createElement("i");
        card.icon.split(" ").forEach((className) => {
          iconService.classList.add("icon", className);
        });
        const cardTitle = document.createElement("h3");
        cardTitle.textContent = card.title;
        const cardContent = document.createElement("p");
        cardContent.textContent = card.content;
        serviceContentWrap.appendChild(iconService);
        serviceContentWrap.appendChild(cardTitle);
        serviceContentWrap.appendChild(cardContent);
        singleService.appendChild(serviceContentWrap);
        colSection.appendChild(singleService);
        rowSection.appendChild(colSection);
      }
    });
  });
  offreContainer.appendChild(sectionTitle);
  offreContainer.appendChild(rowSection);
  offreServicesContainer.appendChild(offreContainer);
}

document.addEventListener("DOMContentLoaded", async () => {
  const offreServicesData = await fetchOffreServices();
  if (offreServicesData && Array.isArray(offreServicesData)) {
    updateOffreServices(offreServicesData);
  } else {
    console.error("Invalid or empty Offre Services data received.");
  }
});
