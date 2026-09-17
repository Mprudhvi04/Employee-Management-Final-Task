function updateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-IN");
  document.getElementById("dateTime").innerHTML =
    `Today:${date}<br>Time:${time}`;
}
setInterval(updateTime, 1000);

const Api = "https://dummyjson.com/users";
let employees = [];
fetch(Api)
  .then(function (response) {
    if (!response.ok) {
      throw new Error("API failed");
    }

    return response.json();
  })
  .then(function (data) {
    employees = data.users.map(function (employee, index) {
      employee.salary = 50000 + index * 5000;

      return employee;
    });

    displayEmployees(employees);

    document.getElementById("message").innerText =
      "Employee data loaded successfully.....";
  })
  .catch(function (error) {
    console.log("Error:", error);

    document.getElementById("message").innerHTML =
      "Unable to load employee data.<br>Please try again.";
  });

function displayEmployees(list) {
  const container = document.getElementById("employees");

  container.innerHTML = "";

  document.getElementById("count").innerHTML = list.length;

  list.forEach(function (employee) {
    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <img src="${employee.image}" alt="Employee">

      <h2>
        ${employee.firstName}
        ${employee.lastName || ""}
      </h2>

      <p>Age: ${employee.age}</p>

      <p>Email: ${employee.email}</p>

      <p>Phone: ${employee.phone}</p>
      

      <p>Department: ${employee.company.department}</p>

      <p>
        Salary: ₹${(employee.salary || 0).toLocaleString("en-IN")}
      </p>

      <button
        class="delete"
        onclick="deleteEmployee(${employee.id})">
        Delete
      </button>
    `;

    container.appendChild(card);
  });

  
  calculateSalary(list);

  highestSalaryEmployee(list);
}

function deleteEmployee(id) {
  employees = employees.filter(function (employee) {
    return employee.id !== id;
  });

  displayEmployees(employees);
}
function searchEmployee() {
  let text = document.getElementById("search").value.toLowerCase();

  let result = employees.filter(function (employee) {
    let name = employee.firstName + " " + employee.lastName;

    return name.toLowerCase().includes(text);
  });
  displayEmployees(result);
}
function filterDepartment(department) {
  if (department === "ALL") {
    displayEmployees(employees);
    return;
  }
  let result = employees.filter(function (employee) {
    return employee.company.department === department;
  });
  displayEmployees(result);
}
function sortEmployees(type) {

  let sorted = [...employees];

  if (type === "nameAsc") {
    sorted.sort(function (a, b) {
      let nameA = a.firstName.toLowerCase();
      let nameB = b.firstName.toLowerCase();

      return nameA.localeCompare(nameB);
    });
  }

  if (type === "nameDesc") {
    sorted.sort(function (a, b) {
      let nameA = a.firstName.toLowerCase();
      let nameB = b.firstName.toLowerCase();

      return nameB.localeCompare(nameA);
    });
  }

  if (type === "ageAsc") {
    sorted.sort(function (a, b) {
      return a.age - b.age;
    });
  }

  if (type === "ageDesc") {
    sorted.sort(function (a, b) {
      return b.age - a.age;
    });
  }

  if (type === "salaryAsc") {
    sorted.sort(function (a, b) {
      return (a.salary || 0) - (b.salary || 0);
    });
  }

  if (type === "salaryDesc") {
    sorted.sort(function (a, b) {
      return (b.salary || 0) - (a.salary || 0);
    });
  }

  displayEmployees(sorted);
}

function addEmployee() {
  let name = document.getElementById("name").value;
  let age = document.getElementById("age").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("number").value;
  let department = document.getElementById("department").value;

  let salary = Number(document.getElementById("salary").value);

  if (name === "") {
    alert("Please Enter name");
    return;
  }
  if (age <= 18) {
    alert("age must be greater than 18");
    return;
  }
  if (department === "") {
    alert("Please select the department");
    return;
  }
  if (salary === "") {
    alert("Please Enter Salary");
  }

  let newEmployee = {
    id: Date.now(),
    firstName: name,
    age: age,
    email: email,
    phone: phone,
    company: {
      department: department,
    },
    salary: salary,
  };
  employees.push(newEmployee);
  displayEmployees(employees);
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("email").value = "";
  document.getElementById("department").value = "";
  document.getElementById("salary").value = "";
}
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("email").value = "";
  document.getElementById("number").value = "";
  document.getElementById("department").value = "";
  document.getElementById("salary").value = "";
}
function calculateSalary(list) {

  let total = list.reduce(function (sum, employee) {
    return sum + (employee.salary || 0);
  }, 0);

  let average = list.length > 0
    ? total / list.length
    : 0;


  document.getElementById("count").innerText = list.length;

  document.getElementById("totalSalary").innerText =
    "₹" + total.toLocaleString("en-IN");

  document.getElementById("averageSalary").innerText =
    "₹" + Math.round(average).toLocaleString("en-IN");
}
function highestSalaryEmployee() {
  if (employees.length === 0) {
    document.getElementById("highestEmployee").innerText = "No employee added";
    return;
  }

  let highest = employees.reduce(function (max, employee) {
    if ((employee.salary || 0) > (max.salary || 0)) {
      return employee;
    } else {
      return max;
    }
  });

  document.getElementById("highestEmployee").innerHTML =
    "Name: " +
    highest.firstName +
    "<br>Salary: ₹" +
    (highest.salary || 0).toLocaleString("en-IN");
}
