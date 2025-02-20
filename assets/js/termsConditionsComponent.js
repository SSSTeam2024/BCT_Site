async function fetchTermsCondition() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/terms-condition/getTermsCondition",
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
    console.error("Error fetching Terms Conditions data:", error);
    return null;
  }
}

function getCurrentHtmlFileName() {
  const path = document.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

function updateTermsCondition(termsConditionsData) {
  const termsConditionSection = document.querySelector("#terms_condition");
  const currentFileName = getCurrentHtmlFileName();

  if (!termsConditionSection) {
    console.error("Terms Condition container not found!");
    return;
  }

  const specificTermsCondition = termsConditionsData.filter(
    (terms) => terms.page === currentFileName
  );

  if (specificTermsCondition.length !== 0) {
    termsConditionSection.innerHTML = "";
  }

  specificTermsCondition.forEach((term) => {
    if (term.display === "0") {
      termsConditionSection.innerHTML = "";
    } else {
      termsConditionSection.classList.add("privacy-policy", "ptb-100");
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
      termsConditionSection.appendChild(termsContainer);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const termsConditionsData = await fetchTermsCondition();
  console.log("terms", termsConditionsData);
  if (termsConditionsData && Array.isArray(termsConditionsData)) {
    updateTermsCondition(termsConditionsData);
  } else {
    console.error("Invalid or empty Terms Condition data received.");
  }
});
