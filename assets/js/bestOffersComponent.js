async function fetchBestOffer() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/best-offers-component/getBestOffer",
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
    console.error("Error fetching Best Offer data:", error);
    return null; // Return null in case of error
  }
}

function getCurrentHtmlFileName() {
  const path = document.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

function updateBestOffer(bestOfferData) {
  const baseUrl = "http://localhost:3000/BestOffer/";

  const offerContainer = document.querySelector("#best-offer");
  const currentFileName = getCurrentHtmlFileName();

  if (!offerContainer) {
    console.error("Best Offer container not found!");
    return;
  }

  const specificBestOffer = bestOfferData.filter(
    (offer) => offer.page === currentFileName
  );

  offerContainer.innerHTML = "";

  specificBestOffer.forEach((offer) => {
    const offerDiv = document.createElement("div");
    offerDiv.classList.add("container");

    // Section Title
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("section-title");
    if (offer.littleTitle.display === "1") {
      const spanLittleTitle = document.createElement("span");
      spanLittleTitle.textContent = offer.littleTitle.name;
      titleDiv.appendChild(spanLittleTitle);
    }
    if (offer.bigTitle.display === "1") {
      const h2BigTitle = document.createElement("h2");
      h2BigTitle.textContent = offer.bigTitle.name;
      titleDiv.appendChild(h2BigTitle);
    }

    // Row Container
    const divRow = document.createElement("div");
    divRow.classList.add("row");

    // Image Column
    if (offer.image.display === "1") {
      const imageCol = document.createElement("div");
      imageCol.classList.add("col-lg-5", "pr-0");
      const aboutImgDiv = document.createElement("div");
      aboutImgDiv.classList.add("choose-img", "choose-img-one");

      const image = document.createElement("img");
      image.src = offer.image.path.startsWith("http")
        ? offer.image.path
        : `${baseUrl}${offer.image.path}`;
      image.alt = "Best Offer Image";

      aboutImgDiv.appendChild(image);
      imageCol.appendChild(aboutImgDiv);
      divRow.appendChild(imageCol);
    }

    // Content Column
    const contentCol = document.createElement("div");
    contentCol.classList.add("col-lg-7", "pl-0");

    const aboutContentDiv = document.createElement("div");
    aboutContentDiv.classList.add("choose-tab-wrap");

    // SubTitle
    if (offer.subTitle.display === "1") {
      const h2SubTitle = document.createElement("h2");
      h2SubTitle.textContent = offer.subTitle.name;
      aboutContentDiv.appendChild(h2SubTitle);
    }

    // Little SubTitle
    if (offer.liltleSubTitle.display === "1") {
      const h4LittleSubTitle = document.createElement("h4");
      h4LittleSubTitle.textContent = offer.liltleSubTitle.name;
      h4LittleSubTitle.style.marginBottom = "20px";
      aboutContentDiv.appendChild(h4LittleSubTitle);
    }

    // Tabs
    const chooseTab = document.createElement("div");
    chooseTab.classList.add("tab", "quote-list-tab", "choose-tab");

    const ulTabs = document.createElement("ul");
    ulTabs.classList.add("tabs");

    const tabContentDiv = document.createElement("div");
    tabContentDiv.classList.add("tab_content");

    offer.tabs.forEach((tab, index) => {
      // Tab Navigation
      const liTab = document.createElement("li");
      const aTab = document.createElement("a");
      aTab.href = "#";
      aTab.textContent = tab.title;
      liTab.appendChild(aTab);
      ulTabs.appendChild(liTab);

      // Tab Content
      const tabsItem = document.createElement("div");
      tabsItem.classList.add("tabs_item");
      if (index === 0) tabsItem.classList.add("active"); // Mark first tab as active

      const pContent = document.createElement("p");
      pContent.textContent = tab.content;

      tabsItem.appendChild(pContent);

      if (tab.buttonDisplay === "1") {
        const button = document.createElement("a");
        button.classList.add("default-btn");
        button.href = tab.buttonLink;
        button.textContent = tab.buttonLabel || "Learn More";
        tabsItem.appendChild(button);
      }

      tabContentDiv.appendChild(tabsItem);
    });

    chooseTab.appendChild(ulTabs);
    chooseTab.appendChild(tabContentDiv);
    aboutContentDiv.appendChild(chooseTab);
    contentCol.appendChild(aboutContentDiv);
    divRow.appendChild(contentCol);
    offerDiv.appendChild(titleDiv);
    offerDiv.appendChild(divRow);
    offerContainer.appendChild(offerDiv);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const bestOfferData = await fetchBestOffer();

  if (bestOfferData && Array.isArray(bestOfferData)) {
    console.log("bestOfferData", bestOfferData);
    updateBestOffer(bestOfferData);
  } else {
    console.error("Invalid or empty Best Offer data received.");
  }
});
