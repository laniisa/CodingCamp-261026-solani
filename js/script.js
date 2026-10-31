const STORAGE_KEYS = {
  transactions: "spendly_transactions",
  budget: "spendly_budget",
  theme: "spendly_theme"
};

const categoryColors = {
  Food: "#f0a45c",
  Transport: "#58a7c5",
  Fun: "#8174dc"
};

const transactionForm = document.getElementById("transactionForm");
const itemNameInput = document.getElementById("itemName");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const transactionList = document.getElementById("transactionList");
const formFeedback = document.getElementById("formFeedback");
const budgetForm = document.getElementById("budgetForm");
const budgetInput = document.getElementById("budgetInput");

let transactions = loadFromStorage(STORAGE_KEYS.transactions, []);
let monthlyBudget = Number(loadFromStorage(STORAGE_KEYS.budget, 0)) || 0;

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.warn(`Tidak dapat membaca ${key} dari Local Storage.`, error);
    return fallback;
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
  localStorage.setItem(STORAGE_KEYS.budget, JSON.stringify(monthlyBudget));
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric"
  }).format(new Date(dateString));
}

function getCurrentMonthTransactions() {
  const now = new Date();
  return transactions.filter((item) => {
    const date = new Date(item.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
}

function showFeedback(message, isError = true) {
  formFeedback.textContent = message;
  formFeedback.style.color = isError ? "var(--red)" : "var(--green)";
}

function addTransaction(event) {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;

  if (!name || !amountInput.value || !category) {
    showFeedback("Semua kolom wajib diisi.");
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showFeedback("Nominal harus berupa angka lebih dari 0.");
    amountInput.focus();
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(categoryColors, category)) {
    showFeedback("Silakan pilih kategori yang tersedia.");
    categoryInput.focus();
    return;
  }

  transactions.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    amount,
    category,
    date: new Date().toISOString()
  });

  saveData();
  transactionForm.reset();
  showFeedback("Transaksi berhasil ditambahkan.", false);
  renderDashboard();
  itemNameInput.focus();
}

function deleteTransaction(id) {
  transactions = transactions.filter((item) => item.id !== id);
  saveData();
  renderDashboard();
}

function renderTransactions() {
  transactionList.innerHTML = "";
  document.getElementById("listCount").textContent = `${transactions.length} transaksi`;

  if (transactions.length === 0) {
    transactionList.innerHTML = '<tr class="empty-row"><td colspan="5">Belum ada transaksi. Tambahkan transaksi pertamamu.</td></tr>';
    return;
  }

  transactions.forEach((item) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.className = "item-name";
    nameCell.textContent = item.name;

    const categoryCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `category-badge category-${item.category.toLowerCase()}`;
    badge.textContent = item.category;
    categoryCell.appendChild(badge);

    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(item.date);

    const amountCell = document.createElement("td");
    amountCell.className = "amount-cell";
    amountCell.textContent = formatRupiah(item.amount);

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Hapus";
    deleteButton.setAttribute("aria-label", `Hapus transaksi ${item.name}`);
    deleteButton.addEventListener("click", () => deleteTransaction(item.id));
    actionCell.appendChild(deleteButton);

    row.append(nameCell, categoryCell, dateCell, amountCell, actionCell);
    transactionList.appendChild(row);
  });
}

function renderSummary() {
  const total = transactions.reduce((sum, item) => sum + item.amount, 0);
  const monthlyTotal = getCurrentMonthTransactions().reduce((sum, item) => sum + item.amount, 0);
  const monthName = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date());

  document.getElementById("totalExpense").textContent = formatRupiah(total);
  document.getElementById("transactionCount").textContent = transactions.length;
  document.getElementById("monthlyExpense").textContent = formatRupiah(monthlyTotal);
  document.getElementById("monthLabel").textContent = monthName;
  document.getElementById("chartTotal").textContent = formatRupiah(total);
}

function renderChart() {
  const totals = { Food: 0, Transport: 0, Fun: 0 };
  transactions.forEach((item) => { totals[item.category] += item.amount; });
  const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
  const chart = document.getElementById("donutChart");
  const legend = document.getElementById("chartLegend");

  if (total === 0) {
    chart.style.background = "conic-gradient(#e9eaf0 0deg 360deg)";
    legend.innerHTML = '<p class="empty-state">Belum ada data pengeluaran.</p>';
    return;
  }

  let currentDegree = 0;
  const segments = [];
  legend.innerHTML = "";

  Object.entries(totals).forEach(([category, value]) => {
    if (value === 0) return;
    const degrees = (value / total) * 360;
    segments.push(`${categoryColors[category]} ${currentDegree}deg ${currentDegree + degrees}deg`);
    currentDegree += degrees;

    const item = document.createElement("div");
    item.className = "legend-item";
    const dot = document.createElement("span");
    dot.className = "legend-dot";
    dot.style.backgroundColor = categoryColors[category];
    const name = document.createElement("span");
    name.className = "legend-name";
    name.textContent = category;
    const amount = document.createElement("strong");
    amount.className = "legend-value";
    amount.textContent = `${Math.round((value / total) * 100)}%`;
    item.append(dot, name, amount);
    legend.appendChild(item);
  });

  chart.style.background = `conic-gradient(${segments.join(", ")})`;
}

function renderBudget() {
  const spent = getCurrentMonthTransactions().reduce((sum, item) => sum + item.amount, 0);
  const percent = monthlyBudget > 0 ? (spent / monthlyBudget) * 100 : 0;
  const cappedPercent = Math.min(percent, 100);
  const remaining = monthlyBudget - spent;

  budgetInput.value = monthlyBudget || "";
  document.getElementById("budgetPercent").textContent = `${Math.round(percent)}%`;
  document.getElementById("budgetProgress").style.width = `${cappedPercent}%`;
  document.getElementById("budgetSpent").textContent = `Terpakai ${formatRupiah(spent)}`;
  document.getElementById("budgetRemaining").textContent = monthlyBudget > 0
    ? `${remaining >= 0 ? "Sisa" : "Melebihi"} ${formatRupiah(Math.abs(remaining))}`
    : "Belum diatur";

  const progress = document.getElementById("budgetProgress");
  progress.style.background = percent >= 100 ? "var(--red)" : percent >= 80 ? "var(--orange)" : "var(--primary)";

  let message = "Masukkan anggaran bulanan untuk mulai memantau.";
  if (monthlyBudget > 0 && percent < 80) message = "Pengeluaran masih dalam batas anggaran. Pertahankan!";
  if (monthlyBudget > 0 && percent >= 80 && percent < 100) message = "Perhatian, anggaran mulai mendekati batas.";
  if (monthlyBudget > 0 && percent >= 100) message = "Batas anggaran sudah tercapai atau terlampaui.";
  document.getElementById("budgetMessage").textContent = message;
}

function renderDashboard() {
  renderTransactions();
  renderSummary();
  renderChart();
  renderBudget();
}

transactionForm.addEventListener("submit", addTransaction);

budgetForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = Number(budgetInput.value);
  if (!Number.isFinite(value) || value <= 0) {
    budgetInput.setCustomValidity("Anggaran harus lebih dari 0.");
    budgetInput.reportValidity();
    budgetInput.setCustomValidity("");
    return;
  }
  monthlyBudget = value;
  saveData();
  renderBudget();
});

const themeToggle = document.getElementById("themeToggle");
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  document.getElementById("themeIcon").textContent = theme === "dark" ? "☀" : "☾";
  document.getElementById("themeText").textContent = theme === "dark" ? "Mode terang" : "Mode gelap";
}
const savedTheme = loadFromStorage(STORAGE_KEYS.theme, "light");
applyTheme(savedTheme);
themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(nextTheme));
  applyTheme(nextTheme);
});

const now = new Date();
document.getElementById("currentDate").textContent = new Intl.DateTimeFormat("id-ID", {
  day: "numeric", month: "long", year: "numeric"
}).format(now);
document.getElementById("todayLabel").textContent = new Intl.DateTimeFormat("id-ID", {
  weekday: "long"
}).format(now).toUpperCase();

renderDashboard();
