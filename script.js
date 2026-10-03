let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = Number(localStorage.getItem("budget")) || 0;

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


// Add Expense
expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = expenseName.value.trim();
  const amount = Number(expenseAmount.value);
  const category = expenseCategory.value;
  const date = expenseDate.value;

  if (!name || amount <= 0 || !category || !date) {
    alert("Please fill all fields correctly.");
    return;
  }

  const expense = {
    id: Date.now(),
    name: name,
    amount: amount,
    category: category,
    date: date
  };

  expenses.push(expense);

  saveExpenses();
  expenseForm.reset();
  displayExpenses();
});


// Set Budget
setBudgetButton.addEventListener("click", function () {
  const newBudget = Number(budgetInput.value);

  if (newBudget < 0 || budgetInput.value === "") {
    alert("Please enter a valid budget.");
    return;
  }

  budget = newBudget;

  localStorage.setItem("budget", budget);

  budgetInput.value = "";

  updateSummary();
});


// Save Expenses
function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}


// Display Expenses
function displayExpenses() {
  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    expenseList.innerHTML =
      '<p class="empty">No expenses added yet.</p>';

    expenseCount.textContent = "0 expenses";
    updateSummary();
    return;
  }

  expenses
    .slice()
    .reverse()
    .forEach(function (expense) {
      const item = document.createElement("div");

      item.className = "expense-item";

      item.innerHTML = `
        <div class="expense-info">
          <h3>${expense.name}</h3>
          <p>${expense.category} • ${expense.date}</p>
        </div>

        <div class="expense-right">
          <div class="expense-amount">
            ₹${expense.amount.toFixed(2)}
          </div>

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


// Delete Expense
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
}


// Update Summary
function updateSummary() {
  const totalSpent = expenses.reduce(function (total, expense) {
    return total + expense.amount;
  }, 0);

  const remaining = budget - totalSpent;

  budgetDisplay.textContent = `₹${budget.toFixed(2)}`;
  totalDisplay.textContent = `₹${totalSpent.toFixed(2)}`;
  remainingDisplay.textContent = `₹${remaining.toFixed(2)}`;
}


// Load saved data when page opens
displayExpenses();

updateSummary();
