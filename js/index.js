const GOAL_FOCUS_DELAY_MS = 30000;
const GOAL_VISIBLE_SHARE = 0.5;
const VISIBILITY_STEPS = 10;

const NIGHT_START_HOUR = 21;
const NIGHT_END_HOUR = 6;
const NIGHT_CLASS = "is-night";

function getVisibleShare(entry) {
  const visibleHeight = entry.intersectionRect.height;
  const maxVisibleHeight = Math.min(entry.boundingClientRect.height, entry.rootBounds.height);
  return visibleHeight / maxVisibleHeight;
}

function initGoldenRulesModal() {
  const goalSection = document.getElementById("goal");
  const rulesDialog = document.getElementById("rules-dialog");
  let isGoalVisible = false;
  let focusTimer = null;

  const observer = new IntersectionObserver(
    ([entry]) => {
      isGoalVisible = entry.isIntersecting && getVisibleShare(entry) >= GOAL_VISIBLE_SHARE;
      updateFocusTimer();
    },
    { threshold: Array.from({ length: VISIBILITY_STEPS + 1 }, (_, step) => step / VISIBILITY_STEPS) }
  );

  function updateFocusTimer() {
    const isGoalFocused = isGoalVisible && document.visibilityState === "visible";

    if (!isGoalFocused) {
      clearTimeout(focusTimer);
      focusTimer = null;
    } else if (focusTimer === null) {
      focusTimer = setTimeout(showRules, GOAL_FOCUS_DELAY_MS);
    }
  }

  function showRules() {
    observer.disconnect();
    document.removeEventListener("visibilitychange", updateFocusTimer);
    rulesDialog.showModal();
  }

  observer.observe(goalSection);
  document.addEventListener("visibilitychange", updateFocusTimer);
}

function isNightTime(date) {
  const hour = date.getHours();
  return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;
}

function applyNightBackground(date) {
  document.documentElement.classList.toggle(NIGHT_CLASS, isNightTime(date));
}

initGoldenRulesModal();
applyNightBackground(new Date());
