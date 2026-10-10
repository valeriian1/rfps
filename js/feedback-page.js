function initDetailsTooltip() {
  const detailsInput = document.getElementById("details");
  const detailsField = detailsInput.closest(".details-field");

  const setHovered = isHovered => detailsField.classList.toggle("is-hovered", isHovered);

  detailsInput.addEventListener("mouseenter", () => setHovered(true));
  detailsInput.addEventListener("mouseleave", () => setHovered(false));
}

initDetailsTooltip();
