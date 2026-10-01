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
    return this._users.filter(user => {
      const appealMonth = new Date(user.appealDate).getMonth() + 1;
      return appealMonth === month && user.appealTime === time;
    });
  }

  getUserWithMinAge() {
    if (this._users.length === 0) {
      return null;
    }

    const minUser = this._users.reduce((min, current) => {
      return current.age < min.age ? current : min;
    }, this._users[0]);

    return {
      age: minUser.age,
      email: minUser.email,
      appealDate: minUser.appealDate
    };
  }

  classifyUsers() {
    const schoolchildrenBeforeYear = [];
    const nonSchoolDuringSemester = [];
    const others = [];

    for (const user of this._users) {
      
      const month = new Date(user.appealDate).getMonth() + 1;

      if (user.age <= 16 && month >= 1 && month <= 8) {
        schoolchildrenBeforeYear.push(user);
      } else if (
        user.age > 16 &&
        ((month >= 9 && month <= 12) || (month >= 2 && month <= 5))
      ) {
        nonSchoolDuringSemester.push(user);
      } else {
        others.push(user);
      }
    }

    return {
      schoolchildrenBeforeYear,
      schoolchildrenBeforeYearCount: schoolchildrenBeforeYear.length,
      nonSchoolDuringSemester,
      nonSchoolDuringSemesterCount: nonSchoolDuringSemester.length,
      others,
      othersCount: others.length
    };
  }

  sortByEmailAsc() {
    return [...this._users]
      .sort((a, b) => a.email.localeCompare(b.email, "uk"))
      .map(user => ({
        email: user.email,
        purpose: user.purpose
      }));
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

  for (const user of initialUsers) {
    registry.addUser(user);
  }

  console.log("Початковий список користувачів зворотного зв'язку:");
  console.table(registry.getUsers());

  const usersByMonthTime = registry.getUsersByMonthAndTime(5, "14:30");
  console.log("Користувачі за травень (місяць 5) о 14:30:");
  console.table(usersByMonthTime);

  const minAgeUser = registry.getUserWithMinAge();
  console.log("Користувач з мінімальним віком:");
  console.table([minAgeUser]);

  const classifiedUsers = registry.classifyUsers();
  console.log("Школярі до початку навчального року:");
  console.table(classifiedUsers.schoolchildrenBeforeYear);
  console.log("Не школярі під час семестру:");
  console.table(classifiedUsers.nonSchoolDuringSemester);
  console.log("Інші користувачі:");
  console.table(classifiedUsers.others);

  const sortedByEmail = registry.sortByEmailAsc();
  console.log("Відсортовані за email (зростання):");
  console.table(sortedByEmail);
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", runFeedbackTests);
} else {
  runFeedbackTests();
}
