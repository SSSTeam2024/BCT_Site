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
    console.error("Error fetching Block1 data:", error);
    return null;
  }
}

function getCurrentHtmlFileName() {
  const path = document.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

function updateBlock1(block1Data) {
  const baseUrl = "http://57.128.184.217:3000/Block1/";

  const currentFileName = getCurrentHtmlFileName();

  const specificBlock1 = block1Data.filter(
    (block1) => block1.page === currentFileName
  );

  if (specificBlock1.length === 0) {
    console.warn("No Block1 data available for this page.");
    return;
  }

  console.log("Specific Block1 data:", specificBlock1);

  const block1Container = document.querySelector("#block1");
  if (!block1Container) {
    console.error("Block1 container not found!");
    return;
  }

  // Clear existing content
  block1Container.innerHTML = "";

  specificBlock1.forEach((block1) => {
    const container = document.createElement("div");
    container.classList.add("container");

    // Section Title
    const titleSection = document.createElement("div");
    titleSection.classList.add("section-title");

    // Little Title
    if (block1.littleTitle.display === "1") {
      const span = document.createElement("span");
      span.textContent = block1.littleTitle.name;
      titleSection.appendChild(span);
    }

    // Big Title
    if (block1.bigTitle.display === "1") {
      const h2 = document.createElement("h2");
      h2.textContent = block1.bigTitle.name;
      titleSection.appendChild(h2);
    }

    container.appendChild(titleSection);

    // Subtitle
    // if (block1.subTitle.display === "1") {
    const subTitleWrap = document.createElement("div");
    subTitleWrap.classList.add("began-wrap");
    const subTitle = document.createElement("h2");
    subTitle.textContent = block1.subTitle.name;
    subTitleWrap.appendChild(subTitle);
    //   container.appendChild(subTitleWrap);
    // }

    // Tabs Content
    const tabBar = document.createElement("div");
    tabBar.classList.add("began-top-wrap");

    const tabContent = document.createElement("div");
    tabContent.classList.add("row");
    tabContent.appendChild(subTitleWrap);
    block1.tabs.forEach((tab) => {
      const tabCol = document.createElement("div");
      tabCol.classList.add("col-lg-4", "col-sm-6", "p-0");

      const singleTab = document.createElement("div");
      singleTab.classList.add("single-began");

      const icon = document.createElement("i");
      icon.classList.add(tab.icon);

      const tabTitle = document.createElement("h3");
      tabTitle.textContent = tab.title;

      singleTab.appendChild(icon);
      singleTab.appendChild(tabTitle);
      tabCol.appendChild(singleTab);
      tabContent.appendChild(tabCol);
    });

    tabBar.appendChild(tabContent);
    container.appendChild(tabBar);

    block1Container.appendChild(container);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const block1Data = await fetchBlock1();
  if (block1Data && Array.isArray(block1Data)) {
    updateBlock1(block1Data);
  } else {
    console.error("Invalid or empty Block1 data received.");
  }
});
