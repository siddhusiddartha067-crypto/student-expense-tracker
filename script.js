// ===============================
// Student Expense Tracker
// ===============================

// Get HTML elements
const expenseForm = document.getElementById("expenseForm");

const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const expenseDate = document.getElementById("expenseDate");

const budgetInput = document.getElementById("budgetInput");
const setBudgetButton = document.getElementById("setBudget");

const budgetDisplay = document.getElementById("budget");
const totalDisplay = document.getElementById("total");
const remainingDisplay = document.getElementById("remaining");

const expenseList = document.getElementById("expenseList");
const expenseCount = document.getElementById("expenseCount");


// ===============================
// Load saved data
// ===============================

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let budget = Number(localStorage.getItem("budget")) || 0;


// ===============================
// Save expenses
// ===============================

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}


// ===============================
// Save budget
// ===============================

function saveBudget() {
  localStorage.setItem("budget", budget);
}


// ===============================
// Add Expense
// ===============================

expenseForm.addEventListener("submit", function (event) {

  event.preventDefault();

  const name = expenseName.value.trim();
  const amount = Number(expenseAmount.value);
  const category = expenseCategory.value;
  const date = expenseDate.value;

  if (!name || !amount || !category || !date) {
    alert("Please fill all expense details.");
    return;
  }

  if (amount <= 0) {
    alert("Amount must be greater than ₹0.");
    return;
  }

  const newExpense = {
    id: Date.now(),
    name: name,
    amount: amount,
    category: category,
    date: date
  };

  expenses.push(newExpense);

  saveExpenses();

  expenseForm.reset();

  displayExpenses();

  updateSummary();

  checkBudgetAlert();

});


// ===============================
// Display Expenses
// ===============================

function displayExpenses() {

  expenseList.innerHTML = "";

  if (expenses.length === 0) {

    expenseList.innerHTML =
      '<p class="empty">No expenses added yet.</p>';

    expenseCount.textContent = "0 expenses";

    updateSummary();

    return;
  }


  const reversedExpenses = expenses.slice().reverse();


  reversedExpenses.forEach(function (expense) {

    const item = document.createElement("div");

    item.className = "expense-item";


    item.innerHTML = `

      <div class="expense-info">

        <h3>${escapeHTML(expense.name)}</h3>

        <p>
          ${escapeHTML(expense.category)}
          •
          ${formatDate(expense.date)}
        </p>

      </div>


      <div class="expense-right">

        <div class="expense-amount">
          ₹${Number(expense.amount).toFixed(2)}
        </div>


        <button
          class="edit-btn"
          onclick="editExpense(${expense.id})"
        >
          Edit
        </button>


        <button
          class="delete-btn"
          onclick="deleteExpense(${expense.id})"
        >
          Delete
        </button>

      </div>

    `;


    expenseList.appendChild(item);

  });


  expenseCount.textContent =
    `${expenses.length} ${expenses.length === 1 ? "expense" : "expenses"}`;


  updateSummary();

}


// ===============================
// Edit Expense
// ===============================

function editExpense(id) {

  const expense = expenses.find(function (item) {
    return item.id === id;
  });


  if (!expense) {
    alert("Expense not found.");
    return;
  }


  const newName = prompt(
    "Enter expense name:",
    expense.name
  );


  if (newName === null) {
    return;
  }


  const newAmount = prompt(
    "Enter amount:",
    expense.amount
  );


  if (newAmount === null) {
    return;
  }


  const newCategory = prompt(
    "Enter category:\nFood\nTravel\nEducation\nShopping\nRecharge\nEntertainment\nOther",
    expense.category
  );


  if (newCategory === null) {
    return;
  }


  const newDate = prompt(
    "Enter date (YYYY-MM-DD):",
    expense.date
  );


  if (newDate === null) {
    return;
  }


  const amountNumber = Number(newAmount);


  if (!newName.trim()) {
    alert("Expense name cannot be empty.");
    return;
  }


  if (!amountNumber || amountNumber <= 0) {
    alert("Please enter a valid amount.");
    return;
  }


  expense.name = newName.trim();

  expense.amount = amountNumber;

  expense.category = newCategory.trim();

  expense.date = newDate;


  saveExpenses();

  displayExpenses();

  updateSummary();

  checkBudgetAlert();

}


// ===============================
// Delete Expense
// ===============================

function deleteExpense(id) {

  const confirmDelete = confirm(
    "Are you sure you want to delete this expense?"
  );


  if (!confirmDelete) {
    return;
  }


  expenses = expenses.filter(function (expense) {
    return expense.id !== id;
  });


  saveExpenses();

  displayExpenses();

  updateSummary();

  checkBudgetAlert();

}


// ===============================
// Set Monthly Budget
// ===============================

setBudgetButton.addEventListener("click", function () {

  const newBudget = Number(budgetInput.value);


  if (newBudget < 0 || isNaN(newBudget)) {
    alert("Please enter a valid budget.");
    return;
  }


  if (newBudget === 0) {
    alert("Please enter a budget greater than ₹0.");
    return;
  }


  budget = newBudget;


  saveBudget();

  budgetInput.value = "";


  updateSummary();

  checkBudgetAlert();

  alert(
    `Monthly budget set to ₹${budget.toFixed(2)}`
  );

});


// ===============================
// Update Summary
// ===============================

function updateSummary() {

  const totalSpent = expenses.reduce(
    function (total, expense) {

      return total + Number(expense.amount);

    },
    0
  );


  const remaining = budget - totalSpent;


  budgetDisplay.textContent =
    `₹${budget.toFixed(2)}`;


  totalDisplay.textContent =
    `₹${totalSpent.toFixed(2)}`;


  remainingDisplay.textContent =
    `₹${remaining.toFixed(2)}`;


  checkBudgetAlert();

}


// ===============================
// Budget Alert
// ===============================

function checkBudgetAlert() {

  // Remove old alert
  const oldAlert = document.getElementById("budgetAlert");

  if (oldAlert) {
    oldAlert.remove();
  }


  if (budget <= 0) {
    return;
  }


  const totalSpent = expenses.reduce(
    function (total, expense) {

      return total + Number(expense.amount);

    },
    0
  );


  const remaining = budget - totalSpent;

  const percentage =
    (totalSpent / budget) * 100;


  const alertBox =
    document.createElement("div");


  alertBox.id = "budgetAlert";


  alertBox.style.margin = "15px 0";
  alertBox.style.padding = "16px";
  alertBox.style.borderRadius = "12px";
  alertBox.style.fontWeight = "bold";
  alertBox.style.textAlign = "center";


  // Budget exceeded
  if (remaining < 0) {

    alertBox.textContent =
      `🚨 Budget Exceeded! You are ₹${Math.abs(remaining).toFixed(2)} over your monthly budget.`;

    alertBox.style.background = "#fee2e2";
    alertBox.style.color = "#b91c1c";

  }

  // Budget completely used
  else if (remaining === 0) {

    alertBox.textContent =
      "🔴 Your monthly budget is fully used.";

    alertBox.style.background = "#fee2e2";
    alertBox.style.color = "#b91c1c";

  }

  // 90% or more
  else if (percentage >= 90) {

    alertBox.textContent =
      `⚠️ Budget almost finished! Only ₹${remaining.toFixed(2)} remaining.`;

    alertBox.style.background = "#ffedd5";
    alertBox.style.color = "#c2410c";

  }

  // 70% or more
  else if (percentage >= 70) {

    alertBox.textContent =
      `🟡 Budget Warning: You have used ${percentage.toFixed(0)}% of your budget.`;

    alertBox.style.background = "#fef3c7";
    alertBox.style.color = "#92400e";

  }

  // Less than 70%
  else {

    alertBox.textContent =
      `🟢 Budget Healthy: ₹${remaining.toFixed(2)} remaining.`;

    alertBox.style.background = "#dcfce7";
    alertBox.style.color = "#166534";

  }


  const container =
    document.querySelector(".container");


  container.insertBefore(
    alertBox,
    container.firstChild
  );

}


// ===============================
// Format Date
// ===============================

function formatDate(dateString) {

  if (!dateString) {
    return "";
  }


  const parts = dateString.split("-");


  if (parts.length !== 3) {
    return dateString;
  }


  return `${parts[2]}-${parts[1]}-${parts[0]}`;

}


// ===============================
// Security Helper
// ===============================

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


// ===============================
// Start App
// ===============================

displayExpenses();

updateSummary();

checkBudgetAlert();
