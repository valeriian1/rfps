const OPEN_CLASS = "is-open";

function normalizeText(text) {
  return text.trim().toLocaleLowerCase(document.documentElement.lang);
}

function initTopicSearch() {
  const searchInput = document.getElementById("topic-search-input");
  const topicCards = Array.from(document.getElementsByClassName("topic-card"));
  const searchContainer = searchInput.closest(".topic-search");
  let status = null;

  function updateStatus(query) {
    if (!query) {
      if (status) searchContainer.removeChild(status);
      status = null;
      return;
    }

    const nextStatus = document.createElement("p");
    nextStatus.className = "search-status";
    const count = topicCards.filter(card => !card.hidden).length;
    nextStatus.textContent = `Знайдено тем: ${count}`;
    if (status) searchContainer.replaceChild(nextStatus, status);
    else searchContainer.appendChild(nextStatus);
    status = nextStatus;
  }

  searchInput.addEventListener("input", () => {
    const query = normalizeText(searchInput.value);

    topicCards.forEach(card => {
      card.hidden = !normalizeText(card.querySelector("h2").textContent).includes(query);
    });
    updateStatus(query);
  });
}

function initAccordion() {
  const accordionItems = [...document.querySelectorAll(".accordion-item")];

  function setExpanded(item, expanded) {
    item.classList.toggle(OPEN_CLASS, expanded);
    item.querySelector(".accordion-trigger").setAttribute("aria-expanded", String(expanded));
  }

  accordionItems.forEach(item => {
    setExpanded(item, false);
    item.querySelector(".accordion-trigger").addEventListener("click", () => {
      const willOpen = !item.classList.contains(OPEN_CLASS);
      accordionItems.forEach(otherItem => setExpanded(otherItem, otherItem === item && willOpen));
    });
  });
}

initTopicSearch();
initAccordion();
