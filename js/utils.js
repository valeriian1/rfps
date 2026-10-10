const LOCALE = "uk";

function compareText(a, b) {
  return a.localeCompare(b, LOCALE);
}

function isEmptyValue(value) {
  return value === undefined || value === null || value === "";
}

function findMinBy(list, getValue) {
  return list.reduce((min, item) => (getValue(item) < getValue(min) ? item : min));
}

function logTable(title, data) {
  console.log(title);
  console.table(data);
}
