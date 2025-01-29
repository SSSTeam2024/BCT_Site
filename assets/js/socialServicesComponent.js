async function fetchSocialServices() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/social-services-component/getSocialServices",
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

function updateSocialServices(socialServicesData) {
  const socialServicesContainer = document.querySelector("#whatOffer");
  const currentFileName = getCurrentHtmlFileName();

  if (!socialServicesContainer) {
    console.error("Social Services container not found!");
    return;
  }

  const specificSocialServices = socialServicesData.filter(
    (social) => social.pageLink === currentFileName
  );
  socialServicesContainer.innerHTML = ""; // Clear the container

  //   // Check if there are missions for the current page
  if (!specificSocialServices.length) {
    console.warn(
      `No Social Services found for the current page: ${currentFileName}`
    );
    return;
  }

  const socialContainer = document.createElement("div");
  socialContainer.classList.add("container");

  const socialRow = document.createElement("div");
  socialRow.classList.add("row");
  specificSocialServices.map((social) => {
    const colContainer = document.createElement("div");
    colContainer.classList.add("col-lg-3", "col-sm-6", "p-0");
    const singleOffre = document.createElement("div");
    singleOffre.classList.add("single-offer");
    const icon = document.createElement("i");
    icon.classList.add("icon", social.icon);
    const cardTitle = document.createElement("h3");
    cardTitle.textContent = social.su;

    if (mission.littleTitle.display === "1") {
      const littleTitle = document.createElement("span");
      littleTitle.textContent = mission.littleTitle.name;
      sectionTitle.appendChild(littleTitle);
    }

    if (mission.bigTitle.display === "1") {
      const bigTitle = document.createElement("h2");
      bigTitle.textContent = mission.bigTitle.name;
      sectionTitle.appendChild(bigTitle);
    }

    const content = document.createElement("p");
    content.classList.add("mb-0");
    content.textContent = mission.content;
    sectionTitle.appendChild(content);

    // Append sectionTitle to the mission container
    missionContainer.appendChild(sectionTitle);
  });

  // Append the mission container to the main container
  ourMissionContainer.appendChild(missionContainer);
}

document.addEventListener("DOMContentLoaded", async () => {
  const socialServicesData = await fetchSocialServices();

  if (Array.isArray(socialServicesData) && socialServicesData.length > 0) {
    updateSocialServices(socialServicesData);
  } else {
    console.error("Invalid or empty Our Missions data received.");
  }
});
