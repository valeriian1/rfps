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
      const willOpen = !item.classList.contains("is-open");
      accordionItems.forEach(otherItem => otherItem.classList.toggle("is-open", otherItem === item && willOpen));
    });
  });
}

initTopicSearch();
initAccordion();
