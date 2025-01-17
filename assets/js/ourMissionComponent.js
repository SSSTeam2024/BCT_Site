async function fetchOurMissions() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/our-mission-component/getOurMissions",
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

function updateOurMissions(ourMissionsData) {
  const ourMissionContainer = document.querySelector("#ourMission");
  const currentFileName = getCurrentHtmlFileName();

  if (!ourMissionContainer) {
    console.error("Our Missions container not found!");
    return;
  }

  // Ensure the data structure is as expected
  const missions = ourMissionsData?.missions || [];
  if (!missions.length) {
    console.warn("No missions data available.");
    return;
  }

  const specificMissions = missions.filter(
    (mission) => mission.page === currentFileName
  );

  ourMissionContainer.innerHTML = ""; // Clear the container

  // Check if there are missions for the current page
  if (!specificMissions.length) {
    console.warn(`No missions found for the current page: ${currentFileName}`);
    return;
  }

  const missionContainer = document.createElement("div");
  missionContainer.classList.add("container");

  specificMissions.map((mission) => {
    const sectionTitle = document.createElement("div");
    sectionTitle.classList.add("section-title");

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
  const ourMissionsData = await fetchOurMissions();

  if (Array.isArray(ourMissionsData) && ourMissionsData.length > 0) {
    const firstElement = ourMissionsData[0];

    if (firstElement.missions) {
      updateOurMissions(firstElement);
    } else {
      console.error("Missions property not found in the data.");
    }
  } else {
    console.error("Invalid or empty Our Missions data received.");
  }
});
