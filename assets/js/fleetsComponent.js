async function fetchFleets() {
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
    console.error("Error fetching Fleets data:", error);
    return null;
  }
}

function getCurrentHtmlFileName() {
  const path = document.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

function updateFleets(fleetsData) {
  const baseUrl = "http://57.128.184.217:3000/fleetFiles/";

  const currentFileName = getCurrentHtmlFileName();

  const specificFleets = fleetsData.filter(
    (fleet) => fleet.page === currentFileName
  );

  if (specificFleets.length === 0) {
    console.warn("No Fleets data available for this page.");
    return;
  }

  const fleetContainer = document.querySelector("#fleet_component");
  if (!fleetContainer) {
    console.error("Fleet container not found!");
    return;
  }

  // Clear existing content
  fleetContainer.innerHTML = "";

  specificFleets.forEach((fleet) => {
    const container = document.createElement("div");
    container.classList.add("container");

    const row = document.createElement("div");
    row.classList.add("row");

    fleet.grids.forEach((grid) => {
      const tabCol = document.createElement("div");
      tabCol.classList.add("col-lg-4", "col-md-6");

      const singleTab = document.createElement("div");
      singleTab.classList.add("single-blog");

      const link = document.createElement("a");
      link.setAttribute("href", "news-details.html");

      const image = document.createElement("img");

      const imagePath = grid.image.startsWith("http")
        ? grid.image
        : `${baseUrl}${grid.image}`;

      image.src = imagePath;

      link.appendChild(image);

      const blogContent = document.createElement("div");
      blogContent.classList.add("blog-content");

      const title = document.createElement("h3");
      const titleLink = document.createElement("a");
      titleLink.setAttribute("href", "news-details.html");
      titleLink.textContent = grid.title;
      title.appendChild(titleLink);

      titleLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("newsData", JSON.stringify(grid));
        window.location.href = "news-details.html";
      });

      const paragraph = document.createElement("p");
      paragraph.textContent = grid.details;

      const readMore = document.createElement("a");
      readMore.setAttribute("href", "news-details.html");
      readMore.classList.add("read-more");
      readMore.textContent = "Read More";
      const iconReadMore = document.createElement("i");
      iconReadMore.classList.add("bx", "bx-right-arrow-alt");
      readMore.appendChild(iconReadMore);

      blogContent.appendChild(title);
      blogContent.appendChild(paragraph);
      blogContent.appendChild(readMore);
      singleTab.appendChild(link);
      singleTab.appendChild(blogContent);
      tabCol.appendChild(singleTab);
      row.appendChild(tabCol);
    });

    container.appendChild(row);
    fleetContainer.appendChild(container);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const fleetsData = await fetchFleets();
  if (fleetsData && Array.isArray(fleetsData)) {
    console.log("fleetsData", fleetsData);
    updateFleets(fleetsData);
  } else {
    console.error("Invalid or empty Fleets data received.");
  }
});
