let myActivities = JSON.parse(localStorage.getItem("myTransaction")) || [];
let myBudgets = JSON.parse(localStorage.getItem("myBudgets")) || {};
let mode = "income";

function updateUI() {
    const balanceDisp = document.getElementById("balance");
    const activityBox = document.getElementById("activityBox");
    const cardsPage = document.getElementById("cards");

    if (balanceDisp) {
        let total = myActivities.reduce((acc, curr) => acc + curr.amount, 0);
        balanceDisp.innerHTML = `${total} EGP`;
    }

    if (activityBox) {
        activityBox.innerHTML = "";
        myActivities.slice(-5).reverse().forEach(act => {
            let isIncome = act.amount > 0;
            activityBox.innerHTML += `
                <div class="activity-item">
                    <span>${act.title}</span>
                    <span class="num ${isIncome ? 'plus' : 'minus'}">
                        ${isIncome ? '+' : ''}${act.amount} EGP
                    </span>
                </div>`;
        });
    }

    if (cardsPage) {
        cardsPage.innerHTML = myActivities.length === 0 ? "<p>No Activities</p>" : "";
        myActivities.slice().reverse().forEach((act, index) => {
            let isIncome = act.amount > 0;
            cardsPage.innerHTML += `
                <div class="card-item">
                    <h3>${act.title} | ${act.category}</h3>
                    <p>${act.date || 'No Date'}</p>
                    <h4 class="num ${isIncome ? 'plus' : 'minus'}">${act.amount} EGP</h4>
                    <button onclick="deleteActivity(${myActivities.length - 1 - index})" class="delete">Delete</button>
                </div>`;
        });
    }
}

function updateBudgetsUI() {
    const budgetBox = document.getElementById("budgetBox");
    const budgetBoxPage = document.getElementById("budCards");

    if (budgetBox) budgetBox.innerHTML = "";
    if (budgetBoxPage) budgetBoxPage.innerHTML = "";

    for (let category in myBudgets) {
        let b = myBudgets[category];
        let percent = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
        let barColor = percent >= 100 ? "#e74c3c" : (percent > 80 ? "#f1c40f" : "#2ecc71");

        let htmlDashboard = `
            <div class="budget-item">
                <div class="budget-info">
                    <span>${category}</span><br>
                    <span class="limits">Limit ${b.limit} EGP, Spent ${b.spent} EGP</span>
                </div>
                <span class="percentage" style="color: ${barColor}">${Math.round(percent)}%</span>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${Math.min(percent, 100)}%; background-color: ${barColor}"></div>
                </div>
            </div>`;

        let htmlFullPage = `
            <div class="card-item">
                <h3 class="title">${category}</h3>
                <span class="limits">Limit ${b.limit} EGP, Spent ${b.spent} EGP</span><br>
                <span class="percentage" style="color: ${barColor}">${Math.round(percent)}%</span>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${Math.min(percent, 100)}%; background-color: ${barColor}"></div>
                </div>
                <button class="delete" onclick="deleteBudgets('${category}')">Delete</button>
            </div>`;

        if (budgetBox) budgetBox.innerHTML += htmlDashboard;
        if (budgetBoxPage) budgetBoxPage.innerHTML += htmlFullPage;
    }
}

function transactionAdd() {
    const description = document.getElementById("name");
    const amountInput = document.getElementById("amount");
    const dateInput = document.getElementById("date");
    const categoryInput = document.getElementById("CI");

    if (!description.value || !amountInput.value) return alert("Empty Inputs");

    let val = Number(amountInput.value);
    let activity = {
        title: description.value,
        amount: mode === "expense" ? -val : val,
        date: dateInput.value,
        category: categoryInput.value
    };

    if (mode === "expense" && myBudgets[activity.category]) {
        myBudgets[activity.category].spent += val;
        localStorage.setItem("myBudgets", JSON.stringify(myBudgets));
    }

    myActivities.push(activity);
    localStorage.setItem("myTransaction", JSON.stringify(myActivities));

    description.value = "";
    amountInput.value = "";
    updateUI();
    updateBudgetsUI();
}

function createBudget() {
    const catInput = document.getElementById("category");
    const limInput = document.getElementById("limitInput");

    if (!limInput.value) return alert("Enter Limit");

    myBudgets[catInput.value] = {
        limit: Number(limInput.value),
        spent: 0
    };

    localStorage.setItem("myBudgets", JSON.stringify(myBudgets));
    limInput.value = "";
    updateBudgetsUI();
}

function deleteActivity(index) {
    let act = myActivities[index];
    if (act.amount < 0 && myBudgets[act.category]) {
        myBudgets[act.category].spent -= Math.abs(act.amount);
        localStorage.setItem("myBudgets", JSON.stringify(myBudgets));
    }
    myActivities.splice(index, 1);
    localStorage.setItem("myTransaction", JSON.stringify(myActivities));
    updateUI();
    updateBudgetsUI();
}

function deleteBudgets(category) {
    delete myBudgets[category];
    localStorage.setItem("myBudgets", JSON.stringify(myBudgets));
    updateBudgetsUI();
}

document.addEventListener("DOMContentLoaded", () => {
    updateUI();
    updateBudgetsUI();

    const addBtn = document.getElementById("addTransaction");
    const bBtn = document.getElementById("budgetBtn");
    if (addBtn) addBtn.onclick = transactionAdd;
    if (bBtn) bBtn.onclick = createBudget;

    const inc = document.getElementById("income");
    const exp = document.getElementById("expense");
    if (inc && exp) {
        inc.onclick = () => { mode = "income"; inc.style.opacity = "1"; exp.style.opacity = "0.5"; };
        exp.onclick = () => { mode = "expense"; exp.style.opacity = "1"; inc.style.opacity = "0.5"; };
    }
});













let DLmode = document.getElementById("darkmode");

DLmode.addEventListener("click" , () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme",document.body.classList)
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme","dark")
    }
    else {
        dlocalStorage.setItem("theme","light")
    }
    
})

let savedTheme = localStorage.getItem("theme");
if (savedTheme == "dark") {
    document.body.classList.add("dark");
}
else {
    document.body.classList.add("light")
}