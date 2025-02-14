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

function getCurrentHtmlFileName() {
  const path = document.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

async function updateSections() {
  const currentFileName = getCurrentHtmlFileName();

  const [aboutUsData, ourValuesData, ourMissionsData] = await Promise.all([
    fetchAboutUs(),
    fetchOurValue(),
    fetchOurMissions(),
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

  const allSections = [
    ...filteredAboutUs,
    ...filteredOurValues,
    ...specificMissions,
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

    // Append sectionTitle to the mission container
    missionContainer.appendChild(sectionTitle);
  }

  // Append the mission container to the main container
  container.appendChild(missionContainer);
}

document.addEventListener("DOMContentLoaded", updateSections);
