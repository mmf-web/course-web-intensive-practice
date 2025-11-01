class Api {
  // GRUD

  async createOperation(operation) {
    const r = await fetch("http://localhost:3000/operations", {
      method: "POST",
      body: JSON.stringify(operation),
    });
    const body = await r.json();
    return body;
  }

  async getAllOperations() {
    const r = await fetch("http://localhost:3000/operations");
    const body = await r.json();
    return body;
  }

  async getAllCategories() {
    const r = await fetch("http://localhost:3000/categories");
    const body = await r.json();
    return body;
  }

  async getAllOperationsByType() {}

  async deleteOperation(id) {
    const r = await fetch(`http://localhost:3000/operations/${id}`, {
      method: "DELETE",
    });
    const body = await r.json();
    return body;
  }

  async updateOperation(id, updates) {
    const r = await fetch(`http://localhost:3000/operations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    const body = await r.json();
    return body;
  }

  async getOperations(page = 1, limit = 10) {
    const query = new URLSearchParams();
    query.set("_page", page);
    query.set("_per_page", limit);

    // фильтры
    if (filters.category) query.set("category", filters.category);
    if (filters.type) query.set("type", filters.type);
    if (filters.description) query.set("description", filters.description);

    // сортировка
    if (sortState.field) {
      const sortParam =
        sortState.direction === "desc"
          ? `-${sortState.field}`
          : sortState.field;
      query.set("_sort", sortParam);
    }

    const r = await fetch(
      `http://localhost:3000/operations?${query.toString()}`
    );
    const result = await r.json();

    let data = result.data;

    return {
      data: data,
      total: data.length,
      totalPages: result.pages,
      currentPage: page,
    };
  }
}

const api = new Api();

// глобальные переменные
const filters = {
  category: "",
  type: "",
  description: "",
  // startDate: "",
  // endDate: "",
};

// в json-server не работает сравнение дат?

const sortState = {
  field: null, // 'date' | 'amount'
  direction: null, // 'asc' | 'desc' | null
};

let editMode = false;
let editOperationId = null;
let currentPage = 1;
let pageSize = 10;
let totalPages = 1;
let categoriesCache = null;

function resetForm() {
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";
  document.getElementById("category").value = "";
  document.getElementById("type").value = "";
  document.getElementById("description").value = "";

  editMode = false;
  editOperationId = null;

  document.getElementById("add-operation-btn").textContent =
    "+ Добавить операцию";
  cancelBtn.classList.add("hidden");
}

async function getCategories() {
  if (!categoriesCache) {
    const r = await fetch("http://localhost:3000/categories");
    categoriesCache = await r.json();
  }
  return categoriesCache;
}

// рендеринг операции
operationToHTML = (operation, categories) => {
  const category = categories.find((c) => c.id == operation.category);
  const categoryName = category ? category.name : "Неизвестно";
  const typeName = operation.type == "expence" ? "Расход" : "Доход";
  const formattedAmount =
    (operation.type == "expence" ? "-" : "+") +
    Math.abs(operation.amount).toFixed(2) +
    " BYN";

  const row = document.createElement("tr");
  row.className = "border-b border-gray-100";

  row.innerHTML = `
    <td class="py-3 px-2 md:px-4">${new Date(operation.date).toLocaleDateString(
      "ru-RU"
    )}</td>
    <td class="py-3 px-2 md:px-4">${categoryName}</td>
    <td class="py-3 px-2 md:px-4">${operation.description}</td>
    <td class="py-3 px-2 md:px-4">${typeName}</td>
    <td class="py-3 px-2 md:px-4 text-right">${formattedAmount}</td>

    <td class="py-3 px-2 md:px-4 text-right relative">
      <button class="menu-btn p-2 rounded-full hover:bg-gray-100 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="w-5 h-5 text-gray-500">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 6a.75.75 0 110-1.5.75.75 0 010 1.5zm0 6a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
        </svg>
      </button>

      <div class="menu hidden absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-10">
        <button type="button" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 edit-btn">
          ✏️ Редактировать
        </button>
        <button type="button" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 delete-btn">
          🗑️ Удалить
        </button>
      </div>
    </td>
  `;

  const menuBtn = row.querySelector(".menu-btn");
  const menu = row.querySelector(".menu");

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".menu").forEach((m) => {
      if (m !== menu) m.classList.add("hidden");
    });
    menu.classList.toggle("hidden");
  });

  window.addEventListener("click", () => menu.classList.add("hidden"));

  row.querySelector(".edit-btn").addEventListener("click", (e) => {
    //e.stopPropagation();

    editMode = true;
    editOperationId = operation.id;

    document.getElementById("amount").value = operation.amount;
    document.getElementById("date").value = operation.date;
    document.getElementById("category").value = operation.category;
    document.getElementById("type").value = operation.type;
    document.getElementById("description").value = operation.description;

    document.getElementById("add-operation-btn").textContent =
      "💾 Сохранить изменения";
    cancelBtn.classList.remove("hidden");

    menu.classList.add("hidden");
  });
  row.querySelector(".delete-btn").addEventListener("click", (e) => {
    api.deleteOperation(operation.id);
    renderAllOperations();
  });
  return row;
};

// рендеринг таблицы и пагинации
renderPagination = () => {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className =
      "px-1 md:px-3 py-1 rounded-lg border " +
      (i === currentPage
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100");

    btn.addEventListener("click", () => {
      currentPage = i;
      renderAllOperations();
    });

    pagination.appendChild(btn);
  }
};

renderAllOperations = async () => {
  const container = document.getElementById("operations-container");
  container.innerHTML = "";

  const {
    data: operations,
    total,
    totalPages: pages,
  } = await api.getOperations(currentPage, pageSize);

  totalPages = pages;
  const categories = categoriesCache;

  operations.forEach((operation) => {
    container.appendChild(operationToHTML(operation, categories));
  });

  renderPagination();
};

// кнопки
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const categorySelect = document.getElementById("category");
const typeSelect = document.getElementById("type");
const descriptionInput = document.getElementById("description");
const addBtn = document.getElementById("add-operation-btn");
const cancelBtn = document.getElementById("cancel-edit-btn");

const pageSizeSelect = document.getElementById("page-size");
const categoryFilterSelect = document.getElementById("filter-category");
const typeFilterSelect = document.getElementById("filter-type");
const searchDescriptionInput = document.getElementById("description-search");

// обработчики
cancelBtn.addEventListener("click", () => {
  resetForm();
  cancelBtn.classList.add("hidden");
});

searchDescriptionInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    filters.description = searchDescriptionInput.value;
    renderAllOperations();
  }
});

addBtn.addEventListener("click", async () => {
  const operation = {
    amount: Number(amountInput.value),
    date: dateInput.value
      ? new Date(dateInput.value).toLocaleDateString("sv-SE")
      : new Date().toLocaleDateString("sv-SE"),
    category: parseInt(categorySelect.value),
    type: typeSelect.value,
    description: descriptionInput.value.trim(),
  };

  if (!operation.amount || !operation.category || !operation.type) {
    alert("Заполните все поля");
    return;
  }

  if (
    operation.amount <= 0 ||
    !/^[1-9]\d*(,[1-9]\d)?$/.test(operation.amount)
  ) {
    alert("Неверная сумма");
    return;
  }

  if (editMode) {
    await api.updateOperation(editOperationId, operation);
    editMode = false;
    editOperationId = null;
    addBtn.textContent = "+ Добавить операцию";
  } else {
    await api.createOperation(operation);
  }

  resetForm();
  renderAllOperations();
});

pageSizeSelect.addEventListener("change", (e) => {
  pageSize = Number(e.target.value);
  currentPage = 1;
  renderAllOperations();
});

document.getElementById("next-page").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderAllOperations();
  }
});

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderAllOperations();
  }
});

categoryFilterSelect.addEventListener("change", (e) => {
  filters.category = e.target.value;
  renderAllOperations();
});

typeFilterSelect.addEventListener("change", (e) => {
  filters.type = e.target.value;
  renderAllOperations();
});

// main
async function main() {
  await getCategories();
  await renderAllOperations();
}

main();

const sortDateBtn = document.getElementById("sort-date");
const sortAmountBtn = document.getElementById("sort-amount");

function updateSortIcon(th, direction) {
  const icon = th.querySelector(".sort-icon");

  if (direction === "asc") {
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M12 6l-6 6h12l-6-6z"/>`;
  } else if (direction === "desc") {
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M12 18l6-6H6l6 6z"/>`;
  } else {
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 12h16M4 16h16"/>`;
  }
}

sortDateBtn.addEventListener("click", () => handleSort("date", sortDateBtn));
sortAmountBtn.addEventListener("click", () =>
  handleSort("amount", sortAmountBtn)
);

function handleSort(field, th) {
  updateSortIcon(sortDateBtn, null);
  updateSortIcon(sortAmountBtn, null);

  if (sortState.field === field) {
    if (sortState.direction === "asc") sortState.direction = "desc";
    else if (sortState.direction === "desc") sortState.direction = null;
    else sortState.direction = "asc";
  } else {
    sortState.field = field;
    sortState.direction = "asc";
  }

  updateSortIcon(th, sortState.direction);
  renderAllOperations();
}
