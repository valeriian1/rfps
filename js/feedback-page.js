const HOVERED_CLASS = "is-hovered";

function initDetailsTooltip() {
  const detailsInput = document.getElementById("details");
  const detailsField = detailsInput.closest(".details-field");

  const setHovered = isHovered => detailsField.classList.toggle(HOVERED_CLASS, isHovered);

  detailsInput.addEventListener("mouseenter", () => setHovered(true));
  detailsInput.addEventListener("mouseleave", () => setHovered(false));
}

initDetailsTooltip();
