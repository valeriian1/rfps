const OPEN_CLASS = "is-open";

function normalizeText(text) {
  return text.trim().toLocaleLowerCase(LOCALE);
}

function initTopicSearch() {
  const searchInput = document.getElementById("topic-search-input");
  const topicCards = [...document.querySelectorAll(".topic-card")];

  searchInput.addEventListener("input", () => {
    const query = normalizeText(searchInput.value);

    topicCards.forEach(card => {
      card.hidden = !normalizeText(card.querySelector("h2").textContent).includes(query);
    });
  });
}

function initAccordion() {
  const accordionItems = [...document.querySelectorAll(".accordion-item")];

  accordionItems.forEach(item => {
    item.querySelector(".accordion-trigger").addEventListener("click", () => {
      const willOpen = !item.classList.contains(OPEN_CLASS);
      accordionItems.forEach(otherItem => otherItem.classList.toggle(OPEN_CLASS, otherItem === item && willOpen));
    });
  });
}

initTopicSearch();
initAccordion();
