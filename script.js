// ==========================================
// STUDENT EXPENSE TRACKER
// AI + EXPENSE MANAGEMENT
// ==========================================

// ==========================================
// CLOUDFLARE AI BACKEND
// ==========================================

const AI_BACKEND_URL =
  "https://student-expense-ai-siddhu2026.siddhusiddartha067.workers.dev";


// ==========================================
// ELEMENTS
// ==========================================

const expenseForm =
  document.getElementById("expenseForm");

const expenseName =
  document.getElementById("expenseName");

const expenseAmount =
  document.getElementById("expenseAmount");

const expenseCategory =
  document.getElementById("expenseCategory");

const expenseDate =
  document.getElementById("expenseDate");

const budgetInput =
  document.getElementById("budgetInput");

const setBudgetButton =
  document.getElementById("setBudget");

const budgetDisplay =
  document.getElementById("budget");

const totalDisplay =
  document.getElementById("total");

const remainingDisplay =
  document.getElementById("remaining");

const expenseList =
  document.getElementById("expenseList");

const expenseCount =
  document.getElementById("expenseCount");


// ==========================================
// LOCAL STORAGE
// ==========================================

let expenses =
  JSON.parse(
    localStorage.getItem("expenses")
  ) || [];

let budget =
  Number(
    localStorage.getItem("budget")
  ) || 0;

let editingId = null;


// ==========================================
// SAVE DATA
// ==========================================

function saveExpenses() {

  localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
  );

}


function saveBudget() {

  localStorage.setItem(
    "budget",
    budget
  );

}


// ==========================================
// ADD / UPDATE EXPENSE
// ==========================================

expenseForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();

    const name =
      expenseName.value.trim();

    const amount =
      Number(expenseAmount.value);

    const category =
      expenseCategory.value;

    const date =
      expenseDate.value;


    if (
      !name ||
      !amount ||
      amount <= 0 ||
      !category ||
      !date
    ) {

      alert(
        "Please fill all expense details correctly."
      );

      return;

    }


    // UPDATE EXISTING EXPENSE
    if (editingId !== null) {

      expenses =
        expenses.map(
          function (expense) {

            if (
              expense.id === editingId
            ) {

              return {

                id: expense.id,

                name: name,

                amount: amount,

                category: category,

                date: date

              };

            }

            return expense;

          }
        );


      editingId = null;


      const button =
        expenseForm.querySelector(
          "button[type='submit']"
        );

      button.textContent =
        "+ Add Expense";

    }


    // ADD NEW EXPENSE
    else {

      const newExpense = {

        id: Date.now(),

        name: name,

        amount: amount,

        category: category,

        date: date

      };


      expenses.push(
        newExpense
      );

    }


    saveExpenses();

    expenseForm.reset();

    setTodayDate();

    displayExpenses();

    updateSummary();

    updateAnalytics();

  }
);


// ==========================================
// DISPLAY EXPENSES
// ==========================================

function displayExpenses() {

  expenseList.innerHTML = "";


  if (expenses.length === 0) {

    expenseList.innerHTML =
      '<p class="empty">No expenses added yet.</p>';

    expenseCount.textContent =
      "0 expenses";

    return;

  }


  expenses
    .slice()
    .reverse()
    .forEach(
      function (expense) {

        const item =
          document.createElement("div");

        item.className =
          "expense-item";


        item.innerHTML = `

          <div class="expense-info">

            <h3>
              ${escapeHTML(
                expense.name
              )}
            </h3>

            <p>
              ${escapeHTML(
                expense.category
              )}
              •
              ${formatDate(
                expense.date
              )}
            </p>

          </div>


          <div class="expense-right">

            <div class="expense-amount">
              ₹${Number(
                expense.amount
              ).toFixed(2)}
            </div>


            <button
              class="edit-btn"
              onclick="editExpense(${expense.id})"
            >
              ✏️ Edit
            </button>


            <button
              class="delete-btn"
              onclick="deleteExpense(${expense.id})"
            >
              🗑️ Delete
            </button>

          </div>

        `;


        expenseList.appendChild(
          item
        );

      }
    );


  expenseCount.textContent =
    `${expenses.length} ${
      expenses.length === 1
        ? "expense"
        : "expenses"
    }`;

}


// ==========================================
// EDIT EXPENSE
// ==========================================

function editExpense(id) {

  const expense =
    expenses.find(
      function (item) {

        return item.id === id;

      }
    );


  if (!expense) {

    alert(
      "Expense not found."
    );

    return;

  }


  expenseName.value =
    expense.name;

  expenseAmount.value =
    expense.amount;

  expenseCategory.value =
    expense.category;

  expenseDate.value =
    expense.date;


  editingId = id;


  const button =
    expenseForm.querySelector(
      "button[type='submit']"
    );


  button.textContent =
    "Update Expense";


  expenseForm.scrollIntoView({

    behavior: "smooth",

    block: "center"

  });

}


// ==========================================
// DELETE EXPENSE
// ==========================================

function deleteExpense(id) {

  const confirmed =
    confirm(
      "Are you sure you want to delete this expense?"
    );


  if (!confirmed) {

    return;

  }


  expenses =
    expenses.filter(
      function (expense) {

        return expense.id !== id;

      }
    );


  saveExpenses();

  displayExpenses();

  updateSummary();

  updateAnalytics();

}


// ==========================================
// SET BUDGET
// ==========================================

setBudgetButton.addEventListener(
  "click",
  function () {

    const newBudget =
      Number(
        budgetInput.value
      );


    if (
      !newBudget ||
      newBudget <= 0
    ) {

      alert(
        "Please enter a budget greater than ₹0."
      );

      return;

    }


    budget =
      newBudget;


    saveBudget();

    budgetInput.value = "";

    updateSummary();

    updateAnalytics();

  }
);


// ==========================================
// SUMMARY
// ==========================================

function updateSummary() {

  const totalSpent =
    expenses.reduce(
      function (
        total,
        expense
      ) {

        return (
          total +
          Number(
            expense.amount
          )
        );

      },
      0
    );


  const remaining =
    budget - totalSpent;


  budgetDisplay.textContent =
    `₹${budget.toFixed(2)}`;


  totalDisplay.textContent =
    `₹${totalSpent.toFixed(2)}`;


  remainingDisplay.textContent =
    `₹${remaining.toFixed(2)}`;


  updateBudgetAlert(
    totalSpent,
    remaining
  );

}


// ==========================================
// BUDGET ALERT
// ==========================================

function updateBudgetAlert(
  totalSpent,
  remaining
) {

  let alertBox =
    document.getElementById(
      "budgetAlert"
    );


  if (!alertBox) {

    alertBox =
      document.createElement(
        "div"
      );

    alertBox.id =
      "budgetAlert";

    alertBox.style.margin =
      "15px 0";

    alertBox.style.padding =
      "15px";

    alertBox.style.borderRadius =
      "12px";

    alertBox.style.fontWeight =
      "bold";

    alertBox.style.textAlign =
      "center";


    const container =
      document.querySelector(
        ".container"
      );


    container.insertBefore(
      alertBox,
      container.firstChild
    );

  }


  if (budget <= 0) {

    alertBox.style.display =
      "none";

    return;

  }


  alertBox.style.display =
    "block";


  const percentage =
    (totalSpent / budget) * 100;


  if (remaining < 0) {

    alertBox.textContent =
      `🚨 Budget exceeded by ₹${Math.abs(
        remaining
      ).toFixed(2)}.`;

    alertBox.style.background =
      "#fee2e2";

    alertBox.style.color =
      "#b91c1c";

  }

  else if (
    percentage >= 90
  ) {

    alertBox.textContent =
      `🔴 Budget almost finished! ₹${remaining.toFixed(
        2
      )} remaining.`;

    alertBox.style.background =
      "#ffedd5";

    alertBox.style.color =
      "#c2410c";

  }

  else if (
    percentage >= 70
  ) {

    alertBox.textContent =
      `⚠️ Budget warning: ${percentage.toFixed(
        0
      )}% used.`;

    alertBox.style.background =
      "#fef3c7";

    alertBox.style.color =
      "#92400e";

  }

  else {

    alertBox.textContent =
      `🟢 Budget healthy: ₹${remaining.toFixed(
        2
      )} remaining.`;

    alertBox.style.background =
      "#dcfce7";

    alertBox.style.color =
      "#166534";

  }

}


// ==========================================
// ANALYTICS
// ==========================================

function updateAnalytics() {

  let analytics =
    document.getElementById(
      "analyticsDashboard"
    );


  if (!analytics) {

    analytics =
      document.createElement(
        "section"
      );

    analytics.id =
      "analyticsDashboard";

    analytics.style.background =
      "white";

    analytics.style.padding =
      "20px";

    analytics.style.borderRadius =
      "16px";

    analytics.style.marginBottom =
      "18px";

    analytics.style.boxShadow =
      "0 4px 15px rgba(0,0,0,0.07)";


    const container =
      document.querySelector(
        ".container"
      );


    container.insertBefore(
      analytics,
      document.querySelector(
        ".form-card"
      )
    );

  }


  if (expenses.length === 0) {

    analytics.innerHTML = `

      <h2>
        📊 Spending Analytics
      </h2>

      <p
        style="
          color:#6b7280;
          margin-top:10px;
        "
      >
        Add expenses to see your spending analytics.
      </p>

    `;

    return;

  }


  const today =
    new Date();


  const todayString =
    getLocalDateString(
      today
    );


  const currentYear =
    today.getFullYear();


  const currentMonth =
    today.getMonth();


  const todaySpent =
    expenses
      .filter(
        function (expense) {

          return (
            expense.date ===
            todayString
          );

        }
      )
      .reduce(
        function (
          total,
          expense
        ) {

          return (
            total +
            Number(
              expense.amount
            )
          );

        },
        0
      );


  const monthExpenses =
    expenses.filter(
      function (expense) {

        const date =
          new Date(
            expense.date +
            "T00:00:00"
          );


        return (
          date.getFullYear() ===
            currentYear &&
          date.getMonth() ===
            currentMonth
        );

      }
    );


  const monthSpent =
    monthExpenses.reduce(
      function (
        total,
        expense
      ) {

        return (
          total +
          Number(
            expense.amount
          )
        );

      },
      0
    );


  const highestExpense =
    expenses.reduce(
      function (
        highest,
        expense
      ) {

        return (
          Number(
            expense.amount
          ) >
          Number(
            highest.amount
          )
            ? expense
            : highest
        );

      },
      expenses[0]
    );


  const categoryTotals = {};


  expenses.forEach(
    function (expense) {

      if (
        !categoryTotals[
          expense.category
        ]
      ) {

        categoryTotals[
          expense.category
        ] = 0;

      }


      categoryTotals[
        expense.category
      ] += Number(
        expense.amount
      );

    }
  );


  let topCategory =
    "None";


  let topCategoryAmount =
    0;


  Object.keys(
    categoryTotals
  ).forEach(
    function (category) {

      if (
        categoryTotals[
          category
        ] >
        topCategoryAmount
      ) {

        topCategory =
          category;

        topCategoryAmount =
          categoryTotals[
            category
          ];

      }

    }
  );


  const firstExpenseDate =
    new Date(
      expenses[0].date +
      "T00:00:00"
    );


  const daysPassed =
    Math.max(
      1,
      Math.ceil(
        (
          today -
          firstExpenseDate
        ) /
        (
          1000 *
          60 *
          60 *
          24
        )
      ) + 1
    );


  const totalSpent =
    expenses.reduce(
      function (
        total,
        expense
      ) {

        return (
          total +
          Number(
            expense.amount
          )
        );

      },
      0
    );


  const averageDaily =
    totalSpent /
    daysPassed;


  analytics.innerHTML = `

    <h2>
      📊 Spending Analytics
    </h2>


    <div
      style="
        display:grid;
        grid-template-columns:
        repeat(auto-fit,minmax(140px,1fr));
        gap:12px;
        margin-top:15px;
      "
    >

      <div style="
        background:#f3f4f6;
        padding:14px;
        border-radius:12px;
      ">

        <small>
          Today's Spending
        </small>

        <h3>
          ₹${todaySpent.toFixed(2)}
        </h3>

      </div>


      <div style="
        background:#f3f4f6;
        padding:14px;
        border-radius:12px;
      ">

        <small>
          This Month
        </small>

        <h3>
          ₹${monthSpent.toFixed(2)}
        </h3>

      </div>


      <div style="
        background:#f3f4f6;
        padding:14px;
        border-radius:12px;
      ">

        <small>
          Average / Day
        </small>

        <h3>
          ₹${averageDaily.toFixed(2)}
        </h3>

      </div>


      <div style="
        background:#f3f4f6;
        padding:14px;
        border-radius:12px;
      ">

        <small>
          Highest Expense
        </small>

        <h3>
          ₹${Number(
            highestExpense.amount
          ).toFixed(2)}
        </h3>

        <small>
          ${escapeHTML(
            highestExpense.name
          )}
        </small>

      </div>


      <div style="
        background:#f3f4f6;
        padding:14px;
        border-radius:12px;
      ">

        <small>
          Top Category
        </small>

        <h3>
          ${escapeHTML(
            topCategory
          )}
        </h3>

        <small>
          ₹${topCategoryAmount.toFixed(2)}
        </small>

      </div>

    </div>

  `;

}


// ==========================================
// AI DASHBOARD
// ==========================================

function createAIDashboard() {

  let aiSection =
    document.getElementById(
      "aiDashboard"
    );


  if (aiSection) {
    return;
  }


  aiSection =
    document.createElement(
      "section"
    );


  aiSection.id =
    "aiDashboard";


  aiSection.style.background =
    "white";

  aiSection.style.padding =
    "20px";

  aiSection.style.borderRadius =
    "16px";

  aiSection.style.marginBottom =
    "18px";

  aiSection.style.boxShadow =
    "0 4px 15px rgba(0,0,0,0.07)";


  aiSection.innerHTML = `

    <h2>
      🤖 AI Financial Assistant
    </h2>


    <p
      style="
        color:#6b7280;
        margin:8px 0 16px;
      "
    >
      Get personalized insights from your expense data.
    </p>


    <div
      style="
        display:grid;
        gap:10px;
      "
    >

      <button
        id="analyzeAIButton"
        type="button"
      >
        🤖 Analyze My Spending
      </button>


      <button
        id="savingAIButton"
        type="button"
      >
        💰 Give Me Smart Saving Tips
      </button>


      <div
        style="
          display:flex;
          gap:8px;
          margin-top:4px;
        "
      >

        <input
          id="aiQuestion"
          type="text"
          placeholder="Ask AI about your expenses..."
          style="flex:1;"
        >

        <button
          id="askAIButton"
          type="button"
        >
          Ask
        </button>

      </div>


      <div
        id="aiResult"
        style="
          display:none;
          margin-top:10px;
          padding:15px;
          background:#f3f4f6;
          border-radius:12px;
          line-height:1.6;
          white-space:pre-wrap;
        "
      ></div>

    </div>

  `;


  const container =
    document.querySelector(
      ".container"
    );


  container.insertBefore(
    aiSection,
    document.querySelector(
      ".form-card"
    )
  );


  document
    .getElementById(
      "analyzeAIButton"
    )
    .addEventListener(
      "click",
      function () {

        runAI(
          "analyze"
        );

      }
    );


  document
    .getElementById(
      "savingAIButton"
    )
    .addEventListener(
      "click",
      function () {

        runAI(
          "saving"
        );

      }
    );


  document
    .getElementById(
      "askAIButton"
    )
    .addEventListener(
      "click",
      function () {

        const question =
          document
            .getElementById(
              "aiQuestion"
            )
            .value
            .trim();


        if (!question) {

          alert(
            "Please enter a question for AI."
          );

          return;

        }


        runAI(
          "ask",
          question
        );

      }
    );

}


// ==========================================
// CALL CLOUDFLARE AI
// ==========================================

async function runAI(
  action,
  question = ""
) {

  const result =
    document.getElementById(
      "aiResult"
    );


  const analyzeButton =
    document.getElementById(
      "analyzeAIButton"
    );


  const savingButton =
    document.getElementById(
      "savingAIButton"
    );


  const askButton =
    document.getElementById(
      "askAIButton"
    );


  result.style.display =
    "block";


  result.textContent =
    "🤖 AI is analyzing your expenses...";


  analyzeButton.disabled =
    true;

  savingButton.disabled =
    true;

  askButton.disabled =
    true;


  try {

    const response =
      await fetch(
        AI_BACKEND_URL,
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              action:
                action,

              question:
                question,

              expenses:
                expenses,

              budget:
                budget

            })

        }
      );


    const data =
      await response.json();


    if (
      !response.ok ||
      !data.success
    ) {

      throw new Error(
        data.message ||
        "AI request failed."
      );

    }


    result.textContent =
      data.answer ||
      "AI did not return an answer.";


  }

  catch (error) {

    console.error(
      "AI Error:",
      error
    );


    result.textContent =
      "❌ AI connection failed.\n\n" +
      "Please check your internet connection and try again.";

  }

  finally {

    analyzeButton.disabled =
      false;

    savingButton.disabled =
      false;

    askButton.disabled =
  false;
      }

}


// ==========================================
// DATE HELPERS
// ==========================================

function setTodayDate() {

  if (!expenseDate) {
    return;
  }

  expenseDate.value =
    getLocalDateString(
      new Date()
    );

}


function getLocalDateString(
  date
) {

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;

}


function formatDate(
  dateString
) {

  if (!dateString) {
    return "";
  }

  const parts =
    dateString.split("-");

  if (
    parts.length !== 3
  ) {

    return dateString;

  }

  return `${parts[2]}-${parts[1]}-${parts[0]}`;

}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(
  text
) {

  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    text;

  return div.innerHTML;

}


// ==========================================
// START APP
// ==========================================

setTodayDate();

displayExpenses();

updateSummary();

updateAnalytics();

createAIDashboard();
  
