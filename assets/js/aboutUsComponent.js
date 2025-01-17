async function fetchAboutUs() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/about-us-component/getAboutUsComponents",
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
    return null; // Return null in case of error
  }
}

function getCurrentHtmlFileName() {
  const path = document.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

function updateAboutUs(aboutUsData) {
  const baseUrl = "http://localhost:3000/aboutUs/";

  const aboutContainer = document.querySelector(".about-area .row");
  const currentFileName = getCurrentHtmlFileName();

  if (!aboutContainer) {
    console.error("About Us container not found!");
    return;
  }

  const specificAboutUs = aboutUsData.filter(
    (aboutUs) => aboutUs.page === currentFileName
  );

  aboutContainer.innerHTML = "";

  specificAboutUs.forEach((about) => {
    const imagePath = about.image.path.startsWith("http")
      ? about.image.path
      : `${baseUrl}${about.image.path}`;

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
    } else [(imageCol.innerHTML = "")];

    // Right Column (Content)
    const contentCol = document.createElement("div");
    contentCol.classList.add("col-lg-6");

    const aboutContentDiv = document.createElement("div");
    aboutContentDiv.classList.add("about-content", "ml-30");

    // Little Title
    if (about.littleTitle.display === "1") {
      const span = document.createElement("span");
      span.textContent = about.littleTitle.name || "Welcome!";
      aboutContentDiv.appendChild(span);
    }

    // Big Title
    if (about.bigTitle.display === "1") {
      const heading = document.createElement("h2");
      heading.textContent = about.bigTitle.name || "We are ...";
      aboutContentDiv.appendChild(heading);
    }

    // Paragraph
    if (about.paragraph.display === "1") {
      const paragraph = document.createElement("p");
      paragraph.classList.add("mb-0");
      paragraph.textContent = about.paragraph.content || "With years ...";
      aboutContentDiv.appendChild(paragraph);
    }

    // About Button
    if (about.button && about.button.display === "1") {
      const button = document.createElement("a");
      button.classList.add("default-btn");
      button.href = about.button.link || "#";
      button.textContent = about.button.label || "Learn More";
      aboutContentDiv.appendChild(button);
    }

    contentCol.appendChild(aboutContentDiv);
    aboutContainer.appendChild(imageCol);
    aboutContainer.appendChild(contentCol);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const aboutUsData = await fetchAboutUs();

  if (aboutUsData && Array.isArray(aboutUsData)) {
    updateAboutUs(aboutUsData);
  } else {
    console.error("Invalid or empty About Us data received.");
  }
});
