async function fetchInThePress() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/in-the-press-component/getAllInThePresss",
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

function updateInThePress(onTheRoadData) {
  const baseUrl = "http://localhost:3000/inThePressFiles/";

  const currentFileName = getCurrentHtmlFileName();

  const specificOnTheRoad = onTheRoadData.filter(
    (onTheRoad) => onTheRoad.page === currentFileName
  );

  if (specificOnTheRoad.length === 0) {
    console.warn("No On The Road data available for this page.");
    return;
  }

  const onTheRoadContainer = document.querySelector("#inThePress_component");
  if (!onTheRoadContainer) {
    console.error("On The Road container not found!");
    return;
  }

  // Clear existing content
  onTheRoadContainer.innerHTML = "";

  const container = document.createElement("div");
  container.classList.add("container");
  const sectionTitle = document.createElement("div");
  sectionTitle.classList.add("section-title");

  specificOnTheRoad.forEach((fleet) => {
    const title = document.createElement("h2");
    title.textContent = fleet.title;
    const paragraph = document.createElement("p");
    paragraph.textContent = fleet.paragraph;

    sectionTitle.appendChild(title);
    sectionTitle.appendChild(paragraph);
    const rowTab = document.createElement("div");
    rowTab.classList.add("row");
    fleet.news.forEach((grid) => {
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
    container.appendChild(sectionTitle);
    container.appendChild(rowTab);
  });

  onTheRoadContainer.appendChild(container);
}

document.addEventListener("DOMContentLoaded", async () => {
  const onTheRoadData = await fetchInThePress();
  if (onTheRoadData && Array.isArray(onTheRoadData)) {
    // console.log("onTheRoadData", onTheRoadData);
    updateInThePress(onTheRoadData);
  } else {
    console.error("Invalid or empty On The Road data received.");
  }
});
