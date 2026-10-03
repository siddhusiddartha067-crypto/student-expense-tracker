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

let editingId = null;


// Add or Update Expense
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

  // Update existing expense
  if (editingId !== null) {
    expenses = expenses.map(function (expense) {
      if (expense.id === editingId) {
        return {
          id: expense.id,
          name: name,
          amount: amount,
          category: category,
          date: date
        };
      }

      return expense;
    });

    editingId = null;

    saveExpenses();
    expenseForm.reset();

    const button = expenseForm.querySelector("button[type='submit']");
    button.textContent = "+ Add Expense";

    displayExpenses();

    alert("Expense updated successfully!");
    return;
  }

  // Add new expense
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


// Set Monthly Budget
setBudgetButton.addEventListener("click", function () {
  const newBudget = Number(budgetInput.value);

  if (budgetInput.value === "" || newBudget < 0) {
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
    `${expenses.length} ${
      expenses.length === 1 ? "expense" : "expenses"
    }`;

  updateSummary();
}


// Edit Expense
function editExpense(id) {
  const expense = expenses.find(function (item) {
    return item.id === id;
  });

  if (!expense) {
    return;
  }

  expenseName.value = expense.name;
  expenseAmount.value = expense.amount;
  expenseCategory.value = expense.category;
  expenseDate.value = expense.date;

  editingId = id;

  const button = expenseForm.querySelector("button[type='submit']");
  button.textContent = "Update Expense";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
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

  budgetDisplay.textContent =
    `₹${budget.toFixed(2)}`;

  totalDisplay.textContent =
    `₹${totalSpent.toFixed(2)}`;

  remainingDisplay.textContent =
    `₹${remaining.toFixed(2)}`;
}


// Load saved data
displayExpenses();
updateSummary();
