document.addEventListener("DOMContentLoaded", async () => {
  const navContainer = document.querySelector(".navbar-nav"); // Main nav container

  try {
    // Fetch menu data from your backend
    const response = await fetch(
      "http://57.128.184.217:3000/api/menu/getMenus"
    ); // Replace with your API endpoint
    if (!response.ok) throw new Error("Failed to fetch menu data");

    const menuData = await response.json();

    // Clear the existing menu
    navContainer.innerHTML = "";

    // Render menu
    menuData.map((menuData) =>
      menuData.items
        .filter((item) => item.display) // Only render items marked for display
        .sort((a, b) => a.order - b.order) // Sort items by the `order` property
        .forEach((item) => {
          // Create main nav item
          const navItem = document.createElement("li");
          navItem.className = "nav-item";

          const navLink = document.createElement("a");
          navLink.href = item.link;
          navLink.className = `nav-link ${
            item.subItems.length ? "dropdown-toggle" : ""
          }`;
          navLink.textContent = item.label;

          // Check for sub-items
          if (item.subItems.length > 0) {
            const dropdownMenu = document.createElement("ul");
            dropdownMenu.className = "dropdown-menu";

            item.subItems
              .filter((subItem) => subItem.display) // Filter sub-items for display
              .sort((a, b) => a.order - b.order) // Sort sub-items by the `order` property
              .forEach((subItem) => {
                const subNavItem = document.createElement("li");
                subNavItem.className = "nav-item";

                const subNavLink = document.createElement("a");
                subNavLink.href = subItem.link;
                subNavLink.className = "nav-link";
                subNavLink.textContent = subItem.label;

                subNavItem.appendChild(subNavLink);
                dropdownMenu.appendChild(subNavItem);
              });

            navItem.appendChild(dropdownMenu);
          }

          navItem.appendChild(navLink);
          navContainer.appendChild(navItem);
        })
    );
  } catch (error) {
    console.error("Error rendering menu:", error);
  }
});
