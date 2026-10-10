const SCHOOL_AGE_LIMIT = 16;
const SCHOOL_YEAR_START_MONTH = 9;
const SEMESTER_MONTHS = [2, 3, 4, 5, 9, 10, 11, 12];

const USER_CLASSES = {
  schoolchildrenBeforeYear: "Школярі до початку навчального року",
  nonSchoolDuringSemester: "Не школярі впродовж семестру",
  others: "Інші"
};

class FeedbackUser {
  constructor(lastName, firstName, age, email, purpose, appealDate, appealTime) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.age = age;
    this.email = email;
    this.purpose = purpose;
    this.appealDate = appealDate;
    this.appealTime = appealTime;
  }

  get appealMonth() {
    return new Date(this.appealDate).getMonth() + 1;
  }

  get isSchoolchild() {
    return this.age < SCHOOL_AGE_LIMIT;
  }
}

class FeedbackRegistry {
  constructor() {
    this._users = [];
  }

  addUser(user) {
    this._users.push(user);
  }

  getUsers() {
    return [...this._users];
  }

  getUsersByMonthAndTime(month, time) {
    return this._users.filter(user => user.appealMonth === month && user.appealTime === time);
  }

  getUserWithMinAge() {
    if (this._users.length === 0) {
      return null;
    }

    const { age, email, appealDate } = findMinBy(this._users, user => user.age);
    return { age, email, appealDate };
  }

  _getUserClass(user) {
    if (user.isSchoolchild && user.appealMonth < SCHOOL_YEAR_START_MONTH) {
      return "schoolchildrenBeforeYear";
    }
    if (!user.isSchoolchild && SEMESTER_MONTHS.includes(user.appealMonth)) {
      return "nonSchoolDuringSemester";
    }
    return "others";
  }

  classifyUsers() {
    return Object.entries(USER_CLASSES).map(([key, title]) => {
      const users = this._users.filter(user => this._getUserClass(user) === key);
      return { title, users, count: users.length };
    });
  }

  sortByEmailAsc() {
    return [...this._users]
      .sort((a, b) => compareText(a.email, b.email))
      .map(({ email, purpose }) => ({ email, purpose }));
  }
}

function runFeedbackTests() {
  const registry = new FeedbackRegistry();

  const initialUsers = [
    new FeedbackUser("Коваленко", "Максим", 15, "m.kovalenko@gmail.com", "консультація щодо тестів", "2026-05-14", "14:30"),
    new FeedbackUser("Сидоренко", "Анна", 14, "a.sydorenko@ukr.net", "підбір викладача", "2026-05-20", "14:30"),
    new FeedbackUser("Мельник", "Дмитро", 16, "d.melnyk@outlook.com", "технічна помилка в уроці", "2026-03-10", "10:15"),
    new FeedbackUser("Петренко", "Василь", 22, "v.petrenko@gmail.com", "співпраця", "2026-10-05", "11:00"),
    new FeedbackUser("Ткаченко", "Олена", 30, "o.tkachenko@meta.ua", "пропозиція нового курсу", "2026-11-18", "16:45"),
    new FeedbackUser("Бойко", "Артем", 19, "a.boyko@yahoo.com", "питання щодо сертифіката", "2026-04-12", "09:30"),
    new FeedbackUser("Кравчук", "Ірина", 28, "i.kravchuk@gmail.com", "скарга на контент", "2026-07-15", "15:20"),
    new FeedbackUser("Гриценко", "Ярослав", 35, "y.hrytsenko@ukr.net", "індивідуальні заняття", "2026-06-25", "18:00"),
    new FeedbackUser("Марченко", "Софія", 12, "s.marchenko@gmail.com", "проходження квізу", "2026-10-22", "13:10"),
    new FeedbackUser("Лисенко", "Роман", 10, "r.lysenko@i.ua", "доступ до платформи", "2026-02-14", "14:30")
  ];

  initialUsers.forEach(user => registry.addUser(user));

  logTable("Початковий список користувачів зворотного зв'язку:", registry.getUsers());
  logTable("Користувачі за травень (місяць 5) о 14:30:", registry.getUsersByMonthAndTime(5, "14:30"));
  logTable("Користувач з мінімальним віком:", [registry.getUserWithMinAge()]);

  const userClasses = registry.classifyUsers();
  userClasses.forEach(({ title, users }) => logTable(`${title}:`, users));
  logTable("Кількість користувачів у кожному класі:", userClasses.map(({ title, count }) => ({ title, count })));

  logTable("Відсортовані за email (зростання):", registry.sortByEmailAsc());
}

runFeedbackTests();
