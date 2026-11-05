const HOVERED_CLASS = "is-hovered";

function initDetailsTooltip() {
  const detailsInput = document.getElementById("details");
  const detailsField = detailsInput.closest(".details-field");

  detailsInput.onmouseleave = () => detailsField.classList.remove(HOVERED_CLASS);
}

initDetailsTooltip();
