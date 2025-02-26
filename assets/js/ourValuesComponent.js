async function fetchOurValue() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/our-value-component/getOurValue",
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

// Function to attach event listeners to the dynamically generated tabs
function attachTabListeners() {
  const tabBtns = document.querySelectorAll(".tab__btn");
  const tabs = document.querySelectorAll(".tab");

  // Add click event listeners to all tab buttons
  tabBtns.forEach((tabBtn, i) => {
    tabBtn.addEventListener("click", () => {
      // Remove 'active' class from all buttons and tabs
      tabBtns.forEach((btn) => btn.classList.remove("active"));
      tabs.forEach((tab) => tab.classList.remove("active"));

      // Add 'active' class to the clicked button and its corresponding tab
      tabBtn.classList.add("active");
      tabs[i].classList.add("active");
    });
  });
}

function getCurrentHtmlFileName() {
  const path = document.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

function updateOurValues(ourValuesData) {
  const baseUrl = "http://57.128.184.217:3000/ourValue/";
  const currentFileName = getCurrentHtmlFileName();
  const ourValueContainer = document.querySelector("#our-values");
  if (!ourValueContainer) {
    console.error("Our Values container not found!");
    return;
  }

  const specificOurValues = ourValuesData.filter(
    (aboutUs) => aboutUs.page === currentFileName
  );

  ourValueContainer.innerHTML = "";

  const container = document.createElement("div");
  container.classList.add("container");

  specificOurValues.forEach((ouValues) => {
    if (ouValues.display === "0") {
      container.innerHTML = "";
    } else {
      const imagePath = ouValues.image.path.startsWith("http")
        ? ouValues.image.path
        : `${baseUrl}${ouValues.image.path}`;
      const titleSection = document.createElement("div");
      titleSection.classList.add("section-title");

      // Little Title
      if (ouValues.littleTitle.display === "1") {
        const span = document.createElement("span");
        span.textContent = ouValues.littleTitle.name;
        titleSection.appendChild(span);
      }

      // Big Title
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
          return; // Skip this tab if display is not "1"
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
  });
  ourValueContainer.appendChild(container);
  attachTabListeners();
}

document.addEventListener("DOMContentLoaded", async () => {
  const ourValuesData = await fetchOurValue();
  if (ourValuesData && Array.isArray(ourValuesData)) {
    updateOurValues(ourValuesData);
  } else {
    console.error("Invalid or empty Our Values data received.");
  }
});
