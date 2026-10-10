const topics = [
  {
    id: 1,
    name: "Present Simple",
    author: "Олена Ткач",
    taskType: "тест",
    usersDay1: 45,
    usersDay2: 38,
    durationHours: 0,
    durationMinutes: 45
  },
  {
    id: 2,
    name: "Past Simple",
    author: "Андрій Мельник",
    taskType: "вправи",
    usersDay1: 52,
    usersDay2: 41,
    durationHours: 1,
    durationMinutes: 15
  },
  {
    id: 3,
    name: "Future Forms",
    author: "Ірина Бондар",
    taskType: "квіз",
    usersDay1: 34,
    usersDay2: 29,
    durationHours: 1,
    durationMinutes: 0
  },
  {
    id: 4,
    name: "English Articles",
    author: "Василь Кравчук",
    taskType: "тест",
    usersDay1: 60,
    usersDay2: 55,
    durationHours: 0,
    durationMinutes: 45
  },
  {
    id: 5,
    name: "Phrasal Verbs",
    author: "Оксана Коваль",
    taskType: "діалог",
    usersDay1: 40,
    usersDay2: 32,
    durationHours: 1,
    durationMinutes: 30
  },
  {
    id: 6,
    name: "Modal Verbs",
    author: "Дмитро Савченко",
    taskType: "вправи",
    usersDay1: 48,
    usersDay2: 44,
    durationHours: 1,
    durationMinutes: 0
  },
  {
    id: 7,
    name: "Business Idioms",
    author: "Наталія Мороз",
    taskType: "практикум",
    usersDay1: 25,
    usersDay2: 20,
    durationHours: 2,
    durationMinutes: 0
  },
  {
    id: 8,
    name: "Prepositions of Time",
    author: "Юрій Лисенко",
    taskType: "тест",
    usersDay1: 58,
    usersDay2: 50,
    durationHours: 0,
    durationMinutes: 30
  },
  {
    id: 9,
    name: "Conditional Sentences",
    author: "Марія Грищенко",
    taskType: "аудіювання",
    usersDay1: 30,
    usersDay2: 24,
    durationHours: 1,
    durationMinutes: 15
  },
  {
    id: 10,
    name: "Job Interview Prep",
    author: "Світлана Шевченко",
    taskType: "симуляція",
    usersDay1: 38,
    usersDay2: 33,
    durationHours: 1,
    durationMinutes: 45
  }
];

const TOPIC_FIELDS = Object.keys(topics[0]);
const MINUTES_IN_HOUR = 60;
const MAX_TOPICS_WITHOUT_SLOWDOWN = 3;
const SLOWDOWN_FACTOR = 1.5;

function getTotalMinutes(topic) {
  return topic.durationHours * MINUTES_IN_HOUR + topic.durationMinutes;
}

function splitMinutes(totalMinutes) {
  const roundedMinutes = Math.round(totalMinutes);
  return {
    hours: Math.floor(roundedMinutes / MINUTES_IN_HOUR),
    minutes: roundedMinutes % MINUTES_IN_HOUR
  };
}

function sortTopicsByDuration(topicsList) {
  const sortedTopics = [...topicsList].sort((a, b) => getTotalMinutes(a) - getTotalMinutes(b));

  const durationGroups = new Map();
  for (const topic of sortedTopics) {
    const minutes = getTotalMinutes(topic);
    if (!durationGroups.has(minutes)) {
      durationGroups.set(minutes, []);
    }
    durationGroups.get(minutes).push(topic);
  }

  const averagesByDuration = [...durationGroups].map(([minutes, group]) => {
    const sumUsers = group.reduce((sum, item) => sum + item.usersDay1 + item.usersDay2, 0);
    return {
      totalMinutes: minutes,
      averageUsers: Number((sumUsers / group.length).toFixed(2)),
      topics: group.map(item => item.name)
    };
  });

  return { sortedTopics, averagesByDuration };
}

function findTopicWithMinUsersDay2(topicsList) {
  const { id, name, usersDay2 } = findMinBy(topicsList, item => item.usersDay2);
  return { id, name, usersDay2 };
}

function addTopic(topicsList, newTopic) {
  const hasMissingFields = TOPIC_FIELDS.some(field => isEmptyValue(newTopic[field]));

  if (hasMissingFields) {
    return [newTopic, ...topicsList];
  }

  const sortedByAuthor = [...topicsList].sort((a, b) => compareText(a.author, b.author));
  const targetIndex = sortedByAuthor.findIndex(item => compareText(newTopic.author, item.author) < 0);
  const insertIndex = targetIndex === -1 ? sortedByAuthor.length : targetIndex;

  sortedByAuthor.splice(insertIndex, 0, newTopic);
  return sortedByAuthor;
}

function calcSimultaneousDuration(topicsList, ids) {
  const selectedTopics = topicsList.filter(item => ids.includes(item.id));
  const factor = selectedTopics.length > MAX_TOPICS_WITHOUT_SLOWDOWN ? SLOWDOWN_FACTOR : 1;

  return selectedTopics.map(item => {
    const { hours, minutes } = splitMinutes(getTotalMinutes(item) * factor);
    return {
      name: item.name,
      newDurationHours: hours,
      newDurationMinutes: minutes
    };
  });
}

function runTopicsTests() {
  logTable("Початковий масив тем:", topics);

  const sortResult = sortTopicsByDuration(topics);
  logTable("Відсортовані теми за тривалістю:", sortResult.sortedTopics);
  logTable("Середня кількість користувачів за тривалістю:", sortResult.averagesByDuration);

  logTable("Тема з мінімальною кількістю користувачів на 2 день:", [findTopicWithMinUsersDay2(topics)]);

  const incompleteTopic = {
    id: 11,
    name: "Irregular Verbs",
    author: "Богдан Шевчук"
  };
  logTable("Додавання неповної теми:", addTopic(topics, incompleteTopic));

  const completeTopic = {
    id: 12,
    name: "English Pronunciation",
    author: "Галина Мельниченко",
    taskType: "практика",
    usersDay1: 44,
    usersDay2: 39,
    durationHours: 0,
    durationMinutes: 50
  };
  logTable("Додавання повної теми:", addTopic(topics, completeTopic));

  logTable(
    `Одночасне вивчення (<= ${MAX_TOPICS_WITHOUT_SLOWDOWN} тем):`,
    calcSimultaneousDuration(topics, [1, 2, 3])
  );
  logTable(
    `Одночасне вивчення (> ${MAX_TOPICS_WITHOUT_SLOWDOWN} тем, x${SLOWDOWN_FACTOR}):`,
    calcSimultaneousDuration(topics, [1, 2, 3, 5, 7])
  );
}

runTopicsTests();
