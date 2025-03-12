function attachTabListeners() {
  const tabBtns = document.querySelectorAll(".tab__btn");
  const tabs = document.querySelectorAll(".tab");

  tabBtns.forEach((tabBtn, i) => {
    tabBtn.addEventListener("click", () => {
      tabBtns.forEach((btn) => btn.classList.remove("active"));
      tabs.forEach((tab) => tab.classList.remove("active"));

      tabBtn.classList.add("active");
      tabs[i].classList.add("active");
    });
  });
}

async function fetchAboutUs() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/about-us-component/getAboutUsComponents"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    return [];
  }
}

async function fetchOurValue() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/our-value-component/getOurValue"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Our Values data:", error);
    return [];
  }
}

async function fetchOffreServices() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/offre-service-component/getOfferService"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Our Values data:", error);
    return [];
  }
}

async function fetchOurMissions() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/our-mission-component/getOurMissions",
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

async function fetchVehicleGuide() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/vehicle-guide-component/getVehicleGuides",
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    return null;
  }
}

async function fetchInThePress() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/in-the-press-component/getAllInThePresss",
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

async function fetchBlock1() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/services-block1-component/getBlock1",
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

async function fetchFleet() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/fleets-component/get-all-fleets",
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

async function fetchOnTheRoad() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/on-the-road-component/getOnTheRoads",
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

async function fetchTermsConditions() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/terms-condition/getTermsCondition",
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

function getCurrentHtmlFileName() {
  const path = document.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

async function updateSections() {
  const currentFileName = getCurrentHtmlFileName();

  const [
    aboutUsData,
    ourValuesData,
    ourMissionsData,
    offreServicesData,
    vehicleGuideData,
    vehicleClasseData,
    inThePressData,
    block1Data,
    fleetsData,
    onTheRoadData,
    termsConditionsData,
  ] = await Promise.all([
    fetchAboutUs(),
    fetchOurValue(),
    fetchOurMissions(),
    fetchOffreServices(),
    fetchVehicleGuide(),
    fetchVehiclesClass(),
    fetchInThePress(),
    fetchBlock1(),
    fetchFleet(),
    fetchOnTheRoad(),
    fetchTermsConditions(),
  ]);

  if (!Array.isArray(aboutUsData) || !Array.isArray(ourValuesData)) {
    console.error("Invalid data received.");
    return;
  }

  const filteredAboutUs = aboutUsData.filter(
    (aboutUs) => aboutUs.page === currentFileName
  );
  const filteredOurValues = ourValuesData.filter(
    (ourValue) => ourValue.page === currentFileName
  );
  const specificMissions = ourMissionsData.flatMap((missionCollection) =>
    missionCollection.missions.filter(
      (mission) => mission.page === currentFileName
    )
  );
  const specificOffreServices = offreServicesData.filter(
    (services) => services.associatedPage === currentFileName
  );

  const specificVehicleGuide = vehicleGuideData.filter(
    (vehicleGuide) =>
      vehicleGuide.page.toLowerCase() === currentFileName.toLowerCase()
  );

  const specificVehicleClass = vehicleClasseData.filter(
    (vehicleClass) =>
      vehicleClass.page.toLowerCase() === currentFileName.toLowerCase()
  );

  const specificInThePress = inThePressData.filter(
    (onTheRoad) => onTheRoad.page === currentFileName
  );

  const specificBlock1 = block1Data.filter(
    (block1) => block1.page === currentFileName
  );

  const specificFleets = fleetsData.filter(
    (fleet) => fleet.page === currentFileName
  );

  const specificOnTheRoad = onTheRoadData.filter(
    (onTheRoad) => onTheRoad.page === currentFileName
  );

  const specificTermsCondition = termsConditionsData.filter(
    (terms) => terms.page === currentFileName
  );

  const allSections = [
    ...filteredAboutUs,
    ...filteredOurValues,
    ...specificMissions,
    ...specificOffreServices,
    ...specificVehicleGuide,
    ...specificVehicleClass,
    ...specificInThePress,
    ...specificBlock1,
    ...specificFleets,
    ...specificOnTheRoad,
    ...specificTermsCondition,
  ].sort((a, b) => a.order - b.order);

  const contentContainer = document.querySelector("#content-container");

  if (!contentContainer) {
    console.error("Main content container not found!");
    return;
  }

  contentContainer.innerHTML = "";
  allSections.forEach((section) => {
    const sectionContainer = document.createElement("section");

    if (section.typeComponent === "aboutUs") {
      sectionContainer.classList.add("about-area", "ptb-100");
      renderAboutUsSection(section, sectionContainer);
    }
    if (section.typeComponent === "ourValues") {
      renderOurValuesSection(section, sectionContainer);
    }
    if (section.typeComponent === "ourMissions") {
      renderOurMissions(section, sectionContainer);
    }
    if (section.typeComponent === "offerService") {
      sectionContainer.setAttribute("id", "offreServices");
      renderOfferService(section, sectionContainer);
    }
    if (section.typeComponent === "vehicleGuide") {
      sectionContainer.setAttribute("id", "vehicles_guide");
      renderVehicleGuide(section, sectionContainer);
    }
    if (section.typeComponent === "vehicleClasse") {
      sectionContainer.setAttribute("id", "vehicles_class");
      sectionContainer.classList.add("global-location-area", "pt-100", "pb-70");
      renderVehicleClasse(section, sectionContainer);
    }
    if (section.typeComponent === "inThePress") {
      sectionContainer.setAttribute("id", "inThePress_component");
      renderInThePress(section, sectionContainer);
    }
    if (section.typeComponent === "block1") {
      sectionContainer.setAttribute("id", "block1");
      sectionContainer.classList.add("began-area");
      renderBlock1(section, sectionContainer);
    }
    if (section.typeComponent === "fleetComponent") {
      sectionContainer.setAttribute("id", "fleet_component");
      sectionContainer.classList.add("team-area", "pt-100", "pb-70");
      renderFleet(section, sectionContainer);
    }
    if (section.typeComponent === "onTheRoadComponent") {
      sectionContainer.setAttribute("id", "onTheRoad_component");
      sectionContainer.classList.add("project-area-six", "ptb-100");
      renderOnTheRoad(section, sectionContainer);
    }
    if (section.typeComponent === "termsCondition") {
      sectionContainer.setAttribute("id", "terms_condition");
      sectionContainer.classList.add("privacy-policy", "pb-70");
      renderTermsCondition(section, sectionContainer);
    }
    contentContainer.appendChild(sectionContainer);
  });

  attachTabListeners();
}

function renderAboutUsSection(about, container) {
  if (about.display === "0") {
    container.innerHTML = "";
    return;
  }

  const baseUrl = "http://57.128.184.217:3000/aboutUs/";
  const imagePath = about.image.path.startsWith("http")
    ? about.image.path
    : `${baseUrl}${about.image.path}`;
  const mainContainer = document.createElement("div");
  mainContainer.classList.add("container");
  const mainRow = document.createElement("div");
  mainRow.classList.add("row", "align-items-center");
  const imageCol = document.createElement("div");
  if (about.image.display === "1") {
    imageCol.classList.add("col-lg-6");

    const aboutImgDiv = document.createElement("div");
    aboutImgDiv.classList.add("about-img");

    const image = document.createElement("img");
    image.src = imagePath;
    image.alt = "About Us Image";
    aboutImgDiv.appendChild(image);

    const quoteDiv = document.createElement("div");
    quoteDiv.classList.add("about-quatre");
    const icon = document.createElement("i");
    icon.classList.add("bx", "bxs-quote-alt-left", "bx-tada");
    quoteDiv.appendChild(icon);
    aboutImgDiv.appendChild(quoteDiv);

    imageCol.appendChild(aboutImgDiv);
  }

  const contentCol = document.createElement("div");
  contentCol.classList.add("col-lg-6");

  const aboutContentDiv = document.createElement("div");
  aboutContentDiv.classList.add("about-content", "ml-30");

  if (about.littleTitle.display === "1") {
    const span = document.createElement("span");
    span.textContent = about.littleTitle.name || "Welcome!";
    aboutContentDiv.appendChild(span);
  }

  if (about.bigTitle.display === "1") {
    const heading = document.createElement("h2");
    heading.textContent = about.bigTitle.name || "We are ...";
    aboutContentDiv.appendChild(heading);
  }

  if (about.paragraph.display === "1") {
    const paragraph = document.createElement("p");
    paragraph.classList.add("mb-0");
    paragraph.textContent = about.paragraph.content || "With years ...";
    aboutContentDiv.appendChild(paragraph);
  }

  if (about.button && about.button.display === "1") {
    const button = document.createElement("a");
    button.classList.add("default-btn");
    button.href = about.button.link || "#";
    button.textContent = about.button.label || "Learn More";
    aboutContentDiv.appendChild(button);
  }

  contentCol.appendChild(aboutContentDiv);

  mainRow.appendChild(imageCol);
  mainRow.appendChild(contentCol);
  mainContainer.appendChild(mainRow);
  container.appendChild(mainContainer);
}

function renderOurValuesSection(ouValues, container) {
  if (ouValues.display === "0") {
    container.innerHTML = "";
    return;
  }

  const baseUrl = "http://57.128.184.217:3000/ourValue/";
  const imagePath = ouValues.image.path.startsWith("http")
    ? ouValues.image.path
    : `${baseUrl}${ouValues.image.path}`;

  const titleSection = document.createElement("div");
  titleSection.classList.add("section-title");

  if (ouValues.littleTitle.display === "1") {
    const span = document.createElement("span");
    span.textContent = ouValues.littleTitle.name;
    titleSection.appendChild(span);
  }

  if (ouValues.bigTitle.display === "1") {
    const h2 = document.createElement("h2");
    h2.textContent = ouValues.bigTitle.name;
    titleSection.appendChild(h2);
  }

  container.appendChild(titleSection);

  const tabBar = document.createElement("div");
  const tabContent = document.createElement("div");
  tabBar.classList.add("tab__bar");
  tabContent.classList.add("tab__content");
  const tabNavigation = document.createElement("div");
  tabNavigation.classList.add("tab__navigation");
  const tabMenu = document.createElement("ul");
  tabMenu.classList.add("tab__menu");

  ouValues.tabs.forEach((tab, index) => {
    if (tab.display !== "1") {
      return;
    }

    const tabBtn = document.createElement("li");
    tabBtn.className = `tab__btn ${index === 0 ? "active" : ""}`;
    tabBtn.textContent = tab.title;
    tabMenu.appendChild(tabBtn);

    const tabDiv = document.createElement("div");
    tabDiv.className = `tab ${index === 0 ? "active" : ""}`;
    tabDiv.innerHTML = `
      <div class="row">
        <div class="left-column">
          <div class="img-card">
            <img src="${imagePath || ""}" alt="${tab.image?.display || ""}" />
          </div>
        </div>
        <div class="right-column">
          <div class="info">
            <h2 class="city">${tab.bigTitle || ""}</h2>
            <div class="description">
              <p>${tab.content || ""}</p>
            </div>
            ${
              tab.buttonDisplay === "1"
                ? `<a href="${tab.buttonLink || "#"}" class="default-btn">${
                    tab.buttonLabel || "Learn More"
                  }</a>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
    tabContent.appendChild(tabDiv);
  });

  tabNavigation.appendChild(tabMenu);
  tabBar.appendChild(tabNavigation);
  container.appendChild(tabBar);
  container.appendChild(tabContent);
}

function renderOurMissions(ourMissions, container) {
  const missionContainer = document.createElement("div");
  missionContainer.classList.add("container");
  if (ourMissions.display === "0") {
    missionContainer.innerHTML = "";
  } else {
    const sectionTitle = document.createElement("div");
    sectionTitle.classList.add("section-title");

    if (ourMissions.littleTitle.display === "1") {
      const littleTitle = document.createElement("span");
      littleTitle.textContent = ourMissions.littleTitle.name;
      sectionTitle.appendChild(littleTitle);
    }

    if (ourMissions.bigTitle.display === "1") {
      const bigTitle = document.createElement("h2");
      bigTitle.textContent = ourMissions.bigTitle.name;
      sectionTitle.appendChild(bigTitle);
    }

    const content = document.createElement("p");
    content.classList.add("mb-0");
    content.textContent = ourMissions.content;
    sectionTitle.appendChild(content);
    missionContainer.appendChild(sectionTitle);
  }

  container.appendChild(missionContainer);
}

function renderOfferService(offerService, container) {
  const baseUrl = "http://57.128.184.217:3000/offerService/";
  const offreContainer = document.createElement("div");
  offreContainer.classList.add("container");

  const sectionTitle = document.createElement("div");
  sectionTitle.classList.add("section-title");
  const rowSection = document.createElement("div");
  rowSection.classList.add("row");

  if (offerService.display === "0") {
    offreContainer.innerHTML = "";
  } else {
    if (offerService.littleTitle.display === "1") {
      const littleTitle = document.createElement("span");
      littleTitle.textContent = offerService.littleTitle.name;
      sectionTitle.appendChild(littleTitle);
    }
    if (offerService.bigTitle.display === "1") {
      const bigTitle = document.createElement("h2");
      bigTitle.textContent = offerService.bigTitle.name;
      sectionTitle.appendChild(bigTitle);
    }
    offerService.cards.map((card, index) => {
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
  }

  offreContainer.appendChild(sectionTitle);
  offreContainer.appendChild(rowSection);
  container.appendChild(offreContainer);
}

function renderVehicleGuide(vehicleGuide, container) {
  const baseUrl = "http://57.128.184.217:3000/VehicleGuide/";
  const vehicleGuideContainerDiv = document.createElement("div");
  vehicleGuideContainerDiv.classList.add("container");
  if (vehicleGuide.display === "0") {
    vehicleGuideContainerDiv.innerHTML = "";
  } else {
    const paragraph = document.createElement("p");
    paragraph.textContent = vehicleGuide.paragraph;
    vehicleGuideContainerDiv.appendChild(paragraph);

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

    vehicleGuideContainerDiv.appendChild(rowDiv);
    // vehicleGuideContainer.appendChild(vehicleGuideContainerDiv);
    container.appendChild(vehicleGuideContainerDiv);
  }
}

function renderVehicleClasse(vehicleClass, container) {
  if (vehicleClass.display === "0") {
    container.innerHTML = "";
  } else {
    const vehicleClassContainer = document.createElement("div");
    vehicleClassContainer.classList.add("container");

    const divTitle = document.createElement("div");
    divTitle.classList.add("section-title");

    const title = document.createElement("h2");
    title.textContent = vehicleClass.bigTitle;
    divTitle.appendChild(title);
    vehicleClassContainer.appendChild(divTitle);

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    const paragraph = document.createElement("p");
    paragraph.textContent = vehicleClass.paragraph;
    rowDiv.appendChild(paragraph);
    vehicleClassContainer.appendChild(rowDiv);

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
      vehicleClassContainer.appendChild(rowDiv);
    });

    container.appendChild(vehicleClassContainer);
  }
}

function renderInThePress(inThePress, container) {
  if (inThePress.display === "0") {
    container.innerHTML === "";
  } else {
    const baseUrl = "http://57.128.184.217:3000/inThePressFiles/";
    const containerInThePress = document.createElement("div");
    containerInThePress.classList.add("container");
    const sectionTitle = document.createElement("div");
    sectionTitle.classList.add("section-title");

    const title = document.createElement("h2");
    title.textContent = inThePress.title;
    const paragraph = document.createElement("p");
    paragraph.textContent = inThePress.paragraph;

    sectionTitle.appendChild(title);
    sectionTitle.appendChild(paragraph);
    const rowTab = document.createElement("div");
    rowTab.classList.add("row");
    inThePress.news.forEach((grid) => {
      const tabCol = document.createElement("div");
      tabCol.classList.add("col-lg-6", "col-md-6");

      const singleTab = document.createElement("div");
      singleTab.classList.add("single-blog");

      const link = document.createElement("a");
      link.setAttribute("href", "news-details-1.html");

      const image = document.createElement("img");

      const imagePath = grid.image.startsWith("http")
        ? grid.image
        : `${baseUrl}${grid.image}`;

      image.src = imagePath;

      link.appendChild(image);

      const blogContent = document.createElement("div");
      blogContent.classList.add("blog-content");
      const list = document.createElement("ul");
      const listDetails = document.createElement("li");
      listDetails.textContent = grid.date;
      const listBy = document.createElement("li");
      listBy.textContent = grid.by;
      list.appendChild(listBy);
      list.appendChild(listDetails);
      const title = document.createElement("h3");
      const titleLink = document.createElement("a");
      titleLink.setAttribute("href", "news-details-1.html");
      titleLink.textContent = grid.title;

      titleLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("gridData", JSON.stringify(grid));
        window.location.href = "news-details-1.html";
      });
      title.appendChild(titleLink);
      const paragraph = document.createElement("p");
      paragraph.textContent = grid.content;
      blogContent.appendChild(list);
      blogContent.appendChild(title);
      blogContent.appendChild(paragraph);
      singleTab.appendChild(link);
      singleTab.appendChild(blogContent);

      tabCol.appendChild(singleTab);
      rowTab.appendChild(tabCol);
    });
    containerInThePress.appendChild(sectionTitle);
    containerInThePress.appendChild(rowTab);

    container.appendChild(containerInThePress);
  }
}

function renderBlock1(block1, container) {
  if (!block1 || block1.display === "0") {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";

  const block1Container = document.createElement("div");
  block1Container.classList.add("container");

  if (block1.littleTitle?.display === "1" || block1.bigTitle?.display === "1") {
    const titleSection = document.createElement("div");
    titleSection.classList.add("section-title");

    if (block1.littleTitle?.display === "1") {
      const span = document.createElement("span");
      span.textContent = block1.littleTitle.name;
      titleSection.appendChild(span);
    }

    if (block1.bigTitle?.display === "1") {
      const h2 = document.createElement("h2");
      h2.textContent = block1.bigTitle.name;
      titleSection.appendChild(h2);
    }

    block1Container.appendChild(titleSection);
  }

  const tabBar = document.createElement("div");
  tabBar.classList.add("began-top-wrap");

  const tabContent = document.createElement("div");
  tabContent.classList.add("row");

  const bigCol = document.createElement("div");
  bigCol.classList.add("col-lg-8");

  const subTitleWrap = document.createElement("div");
  subTitleWrap.classList.add("began-wrap");

  if (block1.subTitle?.name) {
    const subTitle = document.createElement("h2");
    subTitle.textContent = block1.subTitle.name;
    subTitleWrap.appendChild(subTitle);
  }

  const rowTab = document.createElement("div");
  rowTab.classList.add("row");

  const fragment = document.createDocumentFragment();

  block1.tabs?.forEach((tab) => {
    const tabCol = document.createElement("div");
    tabCol.classList.add("col-lg-4", "col-sm-6", "p-0");

    const singleTab = document.createElement("div");
    singleTab.classList.add("single-began");

    const icon = document.createElement("i");
    tab.icon.split(" ").forEach((cls) => icon.classList.add(cls));

    const tabTitle = document.createElement("h3");
    tabTitle.textContent = tab.title;

    singleTab.appendChild(icon);
    singleTab.appendChild(tabTitle);
    tabCol.appendChild(singleTab);
    fragment.appendChild(tabCol);
  });

  rowTab.appendChild(fragment);
  subTitleWrap.appendChild(rowTab);

  bigCol.appendChild(subTitleWrap);
  tabContent.appendChild(bigCol);
  tabBar.appendChild(tabContent);
  block1Container.appendChild(tabBar);

  container.appendChild(block1Container);
}

function renderFleet(fleet, container) {
  if (!fleet || fleet.display === "0") {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";

  const fleetContainer = document.createElement("div");
  fleetContainer.classList.add("container");
  const sectionTitle = document.createElement("div");
  sectionTitle.classList.add("section-title");

  const titleSpan = document.createElement("span");
  titleSpan.textContent = "Premium Fleet Selection";
  const titleH2 = document.createElement("h2");
  titleH2.textContent = "The Perfect Vehicle for Every Journey";
  const titleP = document.createElement("p");
  titleP.textContent =
    "From sleek cars to spacious minibuses and premium coaches, our diverse fleet is designed to meet your travel needs. Whether it's a solo trip or a group adventure, we have the right vehicle for you.";
  sectionTitle.appendChild(titleSpan);
  sectionTitle.appendChild(titleH2);
  sectionTitle.appendChild(titleP);

  const baseUrl = "http://57.128.184.217:3000/fleetFiles/";
  const row = document.createElement("div");
  row.classList.add("row");

  fleet.grids.forEach((grid) => {
    const tabCol = document.createElement("div");
    tabCol.classList.add("col-lg-3", "col-sm-6");
    const singleTab = document.createElement("div");
    singleTab.classList.add("single-team");
    const image = document.createElement("img");
    const imagePath = grid.image.startsWith("http")
      ? grid.image
      : `${baseUrl}${grid.image}`;
    image.src = imagePath;
    const blogContent = document.createElement("div");
    blogContent.classList.add("team-content");
    const title = document.createElement("h3");
    title.textContent = grid.title;
    blogContent.appendChild(title);
    singleTab.appendChild(image);
    singleTab.appendChild(blogContent);
    tabCol.appendChild(singleTab);
    row.appendChild(tabCol);
  });

  fleetContainer.appendChild(sectionTitle);
  fleetContainer.appendChild(row);
  container.appendChild(fleetContainer);
}

function renderOnTheRoad(onTheRoad, container) {
  if (!onTheRoad || onTheRoad.display === "0") {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";

  const onTheRoadContainer = document.createElement("div");
  onTheRoadContainer.classList.add("container");

  const sectionTitle = document.createElement("div");
  sectionTitle.classList.add("section-title");

  const h2Title = document.createElement("h2");
  h2Title.textContent =
    "Take a look at a few photos of our drivers on the road.";
  const pTitle = document.createElement("p");
  pTitle.textContent =
    "They take great pride in what they do and always provide the very best service to our clients, having many years of experience in all things coach hire, minibus hire and chauffeured car hire we guarantee our drivers will get you to your destination on time, hassle free and of course in true Coach Hire Network style. We have vehicles of all sizes on offer to provide you with only the best service, picking you up from your location and with the help of our professional drivers, transporting you directly to your destination.";

  sectionTitle.appendChild(h2Title);
  sectionTitle.appendChild(pTitle);

  const projectWrap = document.createElement("div");
  projectWrap.classList.add("project-wraps");

  const projectRow = document.createElement("div");
  projectRow.classList.add("row");

  const projectCol = document.createElement("div");
  projectCol.classList.add("col-12");

  const rowCol = document.createElement("div");
  rowCol.classList.add("row");
  onTheRoad.grids.map((grid, index) => {
    const colRowCol = document.createElement("div");
    colRowCol.classList.add("col-lg-4", "col-md-6");

    const singleProject = document.createElement("div");
    singleProject.classList.add("single-project");

    const projectImage = document.createElement("div");
    projectImage.classList.add("project-image");

    // Set the background image dynamically
    projectImage.style.backgroundImage = `url(http://57.128.184.217:3000/onTheRoadFiles/${grid.image})`;
    projectImage.style.backgroundSize = "cover";
    projectImage.style.backgroundPosition = "center";

    const priceWrap = document.createElement("div");
    priceWrap.classList.add("price-wrap");

    projectImage.appendChild(priceWrap);
    singleProject.appendChild(projectImage);

    colRowCol.appendChild(singleProject);

    rowCol.appendChild(colRowCol);
  });
  projectCol.appendChild(rowCol);
  projectRow.appendChild(projectCol);
  projectWrap.appendChild(projectRow);
  onTheRoadContainer.appendChild(sectionTitle);
  onTheRoadContainer.appendChild(projectWrap);
  container.appendChild(onTheRoadContainer);
}

function renderTermsCondition(term, container) {
  if (!term || term.display === "0") {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";

  const termsContainer = document.createElement("div");
  termsContainer.classList.add("container");
  const singlePrivacy = document.createElement("div");
  singlePrivacy.classList.add("single-privacy");

  if (term.bigTitle.display === "1") {
    const title = document.createElement("h3");
    title.classList.add("mt-2");
    title.textContent = term.bigTitle.content;

    singlePrivacy.appendChild(title);
  }

  if (term.paragraph.display === "1") {
    const paragraphContent = document.createElement("p");
    paragraphContent.textContent = term.paragraph.content;

    singlePrivacy.appendChild(paragraphContent);
  }

  termsContainer.appendChild(singlePrivacy);
  container.appendChild(termsContainer);
}

document.addEventListener("DOMContentLoaded", updateSections);
