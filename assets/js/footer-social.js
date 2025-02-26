const iconClassMapping = {
  googlePlus: "bx bxl-google", // Map googlePlus to bxl-google
  x: "bx bxl-twitter",
  facebook: "bx bxl-facebook",
  tiktok: "bx bxl-tiktok",
  youtube: "bx bxl-youtube",
  default: "bx bxl-globe", // Fallback for unknown keys
};

async function fetchFooterSocial() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/footer-social/getFooterSocials",
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching footers:", error);
  }
}

function updateSocialFooter(footerData) {
  const footerContainer = document.querySelector(".footer-bottom-area .row");

  // Clear existing footer content
  footerContainer.innerHTML = "";

  footerData.forEach((footer) => {
    // Terms and Privacy Section
    const termsCol = document.createElement("div");
    termsCol.classList.add("col-lg-5");

    const termsWidget = document.createElement("div");
    termsWidget.classList.add("single-widget-bottom");

    const termsUl = document.createElement("ul");

    // Terms and Conditions
    if (footer.termsAndConditions.display === "1") {
      const termsLi = document.createElement("li");
      const termsA = document.createElement("a");
      termsA.href = footer.termsAndConditions.link;
      termsA.textContent = footer.termsAndConditions.name;
      termsLi.appendChild(termsA);
      termsUl.appendChild(termsLi);
    }

    // Privacy Policy
    if (footer.privacyPolicy.display === "1") {
      const privacyLi = document.createElement("li");
      const privacyA = document.createElement("a");
      privacyA.href = footer.privacyPolicy.link;
      privacyA.textContent = footer.privacyPolicy.name;
      privacyLi.appendChild(privacyA);
      termsUl.appendChild(privacyLi);
    }

    termsWidget.appendChild(termsUl);
    termsCol.appendChild(termsWidget);

    // Social Links Section
    const socialCol = document.createElement("div");
    socialCol.classList.add("col-lg-3");

    const socialWidget = document.createElement("div");
    socialWidget.classList.add("single-widget-bottom");

    const socialUl = document.createElement("ul");
    socialUl.classList.add("social-link");

    for (const [key, linkData] of Object.entries(footer.socialLinks)) {
      if (linkData.display === "1") {
        const socialLi = document.createElement("li");
        const socialA = document.createElement("a");
        socialA.href = `https://${linkData.link}`;
        const iconClass = iconClassMapping[key] || iconClassMapping.default;

        const icon = document.createElement("i");
        icon.className = iconClass;
        socialA.appendChild(icon);

        socialLi.appendChild(socialA);
        socialUl.appendChild(socialLi);
      }
    }

    socialWidget.appendChild(socialUl);
    socialCol.appendChild(socialWidget);

    const copyrightCol = document.createElement("div");
    copyrightCol.classList.add("col-lg-4");

    const copyrightWidget = document.createElement("div");
    copyrightWidget.classList.add("single-widget-bottom");

    const copyrightP = document.createElement("p");
    copyrightP.innerHTML = `
      <i class="bx bx-copyright"></i> ${new Date().getFullYear()} ${
      footer.siteName
    }. Designed By
      <a href="https://sss.com.tn/" target="_blank">3S</a>
    `;

    copyrightWidget.appendChild(copyrightP);
    copyrightCol.appendChild(copyrightWidget);

    // Append all sections to the footer container
    footerContainer.appendChild(termsCol);
    footerContainer.appendChild(copyrightCol);
    footerContainer.appendChild(socialCol);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const footerData = await fetchFooterSocial();
  if (footerData) {
    updateSocialFooter(footerData);
  }
});
