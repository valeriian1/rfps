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

function sortTopicsByDuration(topicsList) {
  const sortedTopics = [...topicsList].sort((a, b) => {
    const totalMinutesA = a.durationHours * 60 + a.durationMinutes;
    const totalMinutesB = b.durationHours * 60 + b.durationMinutes;
    return totalMinutesA - totalMinutesB;
  });

  const durationGroups = {};
  for (const topic of sortedTopics) {
    const minutes = topic.durationHours * 60 + topic.durationMinutes;
    if (!durationGroups[minutes]) {
      durationGroups[minutes] = [];
    }
    durationGroups[minutes].push(topic);
  }

  const averagesByDuration = [];
  for (const [minutes, group] of Object.entries(durationGroups)) {
    if (group.length > 1) {
      const sumUsers = group.reduce((sum, item) => sum + item.usersDay1 + item.usersDay2, 0);
      const averageUsers = sumUsers / group.length;
      averagesByDuration.push({
        totalMinutes: Number(minutes),
        averageUsers: Number(averageUsers.toFixed(2)),
        topics: group.map(item => item.name)
      });
    }
  }

  return { sortedTopics, averagesByDuration };
}

function findTopicWithMinUsersDay2(topicsList) {
  const minTopic = topicsList.reduce((min, item) => {
    return item.usersDay2 < min.usersDay2 ? item : min;
  }, topicsList[0]);

  return {
    id: minTopic.id,
    name: minTopic.name,
    usersDay2: minTopic.usersDay2
  };
}

function addTopic(topicsList, newTopic) {
  const requiredFields = [
    "id",
    "name",
    "author",
    "taskType",
    "usersDay1",
    "usersDay2",
    "durationHours",
    "durationMinutes"
  ];

  const hasMissingFields = requiredFields.some(field => newTopic[field] === undefined);

  if (hasMissingFields) {
    return [newTopic, ...topicsList];
  }

  const sortedByAuthor = [...topicsList].sort((a, b) => {
    return a.author.localeCompare(b.author, "uk");
  });

  const targetIndex = sortedByAuthor.findIndex(item => {
    return newTopic.author.localeCompare(item.author, "uk") < 0;
  });

  if (targetIndex === -1) {
    sortedByAuthor.push(newTopic);
  } else {
    sortedByAuthor.splice(targetIndex, 0, newTopic);
  }

  return sortedByAuthor;
}

function calcSimultaneousDuration(topicsList, ids) {
  const selectedTopics = topicsList.filter(item => ids.includes(item.id));
  const isMultiplied = selectedTopics.length > 3;

  return selectedTopics.map(item => {
    if (!isMultiplied) {
      return {
        name: item.name,
        newDurationHours: item.durationHours,
        newDurationMinutes: item.durationMinutes
      };
    }

    const totalMinutes = (item.durationHours * 60 + item.durationMinutes) * 1.5;
    const newDurationHours = Math.floor(totalMinutes / 60);
    const newDurationMinutes = Math.round(totalMinutes % 60);

    return {
      name: item.name,
      newDurationHours,
      newDurationMinutes
    };
  });
}

function renderTopicsTable() {
  if (typeof document === "undefined") return;
  const container = document.getElementById("topics-table-container");
  if (!container) return;

  const table = document.createElement("table");
  table.innerHTML = `
    <caption>Зведена таблиця навчальних тем (Лабораторна робота №3)</caption>
    <thead>
      <tr>
        <th>ID</th>
        <th>Назва теми</th>
        <th>Автор</th>
        <th>Тип завдання</th>
        <th>День 1</th>
        <th>День 2</th>
        <th>Тривалість</th>
      </tr>
    </thead>
    <tbody>
      ${topics.map(t => `
        <tr>
          <td>${t.id}</td>
          <td>${t.name}</td>
          <td>${t.author}</td>
          <td>${t.taskType}</td>
          <td>${t.usersDay1}</td>
          <td>${t.usersDay2}</td>
          <td>${t.durationHours} год ${t.durationMinutes} хв</td>
        </tr>
      `).join("")}
    </tbody>
  `;
  container.innerHTML = "";
  container.appendChild(table);
}

function runTopicsTests() {
  console.log("Початковий масив тем:");
  console.table(topics);

  const sortResult = sortTopicsByDuration(topics);
  console.log("Відсортовані теми за тривалістю:");
  console.table(sortResult.sortedTopics);
  console.log("Середня кількість користувачів за тривалістю:");
  console.table(sortResult.averagesByDuration);

  const minUsersResult = findTopicWithMinUsersDay2(topics);
  console.log("Тема з мінімальною кількістю користувачів на 2 день:");
  console.table([minUsersResult]);

  const incompleteTopic = {
    id: 11,
    name: "Irregular Verbs",
    author: "Богдан Шевчук"
  };
  const addIncompleteResult = addTopic(topics, incompleteTopic);
  console.log("Додавання неповної теми:");
  console.table(addIncompleteResult);

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
  const addCompleteResult = addTopic(topics, completeTopic);
  console.log("Додавання повної теми:");
  console.table(addCompleteResult);

  const fewTopicsResult = calcSimultaneousDuration(topics, [1, 2, 3]);
  console.log("Одночасне вивчення (<= 3 тем):");
  console.table(fewTopicsResult);

  const manyTopicsResult = calcSimultaneousDuration(topics, [1, 2, 3, 5, 7]);
  console.log("Одночасне вивчення (> 3 тем, x1.5):");
  console.table(manyTopicsResult);

  renderTopicsTable();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", runTopicsTests);
} else {
  runTopicsTests();
}
