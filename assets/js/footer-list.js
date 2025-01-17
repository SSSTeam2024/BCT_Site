async function fetchFooterList() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/footer-list/getFooterLists",
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

function updateFooter(footerData) {
  const footerContainer = document.querySelector(".footer-top-area .row");

  // Clear the existing footer content
  footerContainer.innerHTML = "";

  // Sort the footer sections by 'order' before rendering them
  footerData
    .sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10))
    .forEach((footer) => {
      if (footer.display === "0") {
        return; // Skip items that should not be displayed
      }

      const colDiv = document.createElement("div");
      colDiv.classList.add("col-lg-3", "col-md-6");

      const widgetDiv = document.createElement("div");
      widgetDiv.classList.add("single-widget");

      const h3 = document.createElement("h3");
      h3.textContent = footer.name;
      widgetDiv.appendChild(h3);

      const ul = document.createElement("ul");

      // Sort footer items by their 'order' field and render them
      footer.items
        .sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10))
        .forEach((item) => {
          // Check if the item should be displayed
          if (item.display === "0") {
            return; // Skip items that should not be displayed
          }

          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = item.link;
          a.textContent = item.name;
          li.appendChild(a);
          ul.appendChild(li);
        });

      widgetDiv.appendChild(ul);
      colDiv.appendChild(widgetDiv);

      footerContainer.appendChild(colDiv);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  const footerData = await fetchFooterList();
  if (footerData) {
    updateFooter(footerData);
  }
});
