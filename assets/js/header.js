async function fetchHeader() {
  try {
    const response = await fetch(
      "http://57.128.184.217:3000/api/header/getHeaders",
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
    console.error("Error fetching headers:", error);
  }
}

function updateHeader(data) {
  const baseUrl = "http://57.128.184.217:3000/header/";
  data.map((data) => {
    const logoPath = data.logo.startsWith("http")
      ? data.logo
      : `${baseUrl}${data.logo}`;

    //! Logo
    const logoLink = document.querySelector("#logo-of-site a");
    const logoImage = logoLink.querySelector("img");
    logoLink.setAttribute("href", data.logo_link);
    logoImage.setAttribute("src", logoPath);

    //! Logo Mobile
    const logoMobileLink = document.querySelector("#mobile-log-of-site a");
    const logoMobileImage = logoLink.querySelector("img");
    logoMobileLink.setAttribute("href", data.logo_link);
    logoMobileImage.setAttribute("src", logoPath);

    //! Phone
    const phoneLink = document.querySelector("a[href^='tel:']");
    const phoneIcon = phoneLink.querySelector("span");
    const phoneItem = phoneLink.closest("li"); // Select the parent <li> element

    if (data.phone_display === "1") {
      phoneItem.style.display = "";
      phoneLink.setAttribute("href", `tel:${data.phone_value}`);
      phoneIcon.textContent = data.phone_label;
      phoneLink.innerHTML = `<i class='bx bxs-phone-call'></i> <span>${data.phone_label}</span> ${data.phone_value}`;
    } else {
      phoneItem.style.display = "none";
    }

    //! Email
    const emailLink = document.querySelector("a[href^='mailto:']");
    const emailIcon = emailLink.querySelector("span");
    const emailItem = emailLink.closest("li");
    if (data.email_display === "1") {
      emailItem.style.display = "";
      emailLink.setAttribute("href", `mailto:${data.email_value}`);
      emailIcon.textContent = data.email;
      emailLink.innerHTML = `<i class='bx bx-envelope'></i> <span>${data.email_label}</span> ${data.email_value}`;
    } else {
      emailItem.style.display = "none";
    }

    //! Address
    const addressLink = document.querySelector("#base-address");
    const addressIcon = addressLink.querySelector("span");
    const addressItem = addressLink.closest("li");
    if (data.address_display === "1") {
      addressItem.style.display = "";
      addressIcon.textContent = data.address_value;
      addressLink.innerHTML = `<i class='bx bx-map'></i> <span>${data.address_label}</span> ${data.address_value}`;
    } else {
      addressItem.style.display = "none";
    }

    //! Button
    const buttonLink = document.querySelector("#get-a-quote a");
    const buttonItem = buttonLink.closest("li");
    if (data.button_display === "1") {
      buttonItem.style.display = "";
      buttonLink.setAttribute("href", data.button_link);
      buttonLink.textContent = data.button_text;
    } else {
      buttonItem.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const headerData = await fetchHeader();
  if (headerData) {
    updateHeader(headerData);
  }
});
