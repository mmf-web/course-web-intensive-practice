async function main() {
  await renderAllOperations();
}

const api = new Api();

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

let currentPage = 1;
let pageSize = 10;
let totalPages = 1;

function resetForm() {
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";
  document.getElementById("category").value = "";
  document.getElementById("type").value = "";
  document.getElementById("description").value = "";
  document.getElementById("operation-id").value = "";

  editMode = false;

  document.getElementById("add-operation-btn").textContent = "+ Добавить операцию";
  cancelBtn.classList.add("hidden");
}

// рендеринг операции
const operationToHTML = (operation, categories) => {
  const categoryName = categories.find((c) => c.id == operation.category)?.name ?? "Неизвестно";
  const typeName = operation.type == "expence" ? "Расход" : "Доход";
  const formattedAmount = (operation.type == "expence" ? "-" : "+") + Math.abs(operation.amount).toFixed(2) + " BYN";

  const row = document.createElement("tr");
  row.className = "border-b border-gray-100";

  row.innerHTML = `
    <td class="py-3 px-2 md:px-4">${new Date(operation.date).toLocaleDateString("ru-RU")}</td>
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
    document.querySelectorAll(".menu").forEach((m) => m.classList.add("hidden"));
    menu.classList.remove("hidden");
  });

  // ! WARN: this is never cleaned up !
  // Maybe when switching pages, clear all previous listeners
  // window.addEventListener("click", () => {
  //   menu.classList.add("hidden");
  //   console.log("window click" + operation.id);
  // });

  row.querySelector(".edit-btn").addEventListener("click", (e) => {
    //e.stopPropagation();

    operationIdInput.value = operation.id;

    document.getElementById("amount").value = operation.amount;
    document.getElementById("date").value = operation.date;
    document.getElementById("category").value = operation.category;
    document.getElementById("type").value = operation.type;
    document.getElementById("description").value = operation.description;

    document.getElementById("add-operation-btn").textContent = "💾 Сохранить изменения";
    cancelBtn.classList.remove("hidden");

    menu.classList.add("hidden");
  });
  row.querySelector(".delete-btn").addEventListener("click", async (e) => {
    await api.deleteOperation(operation.id);
    // renderAllOperations();
    row.remove();
  });
  return row;
};

// let globalListeners = [];
// window.addEventListener("click", (e) => globalListeners.forEach((fn) => fn(e)));

// function addGlobalListener(fn) {
//   globalListeners.push(fn);
// }
// function removeGlobalListener(fn) {
//   globalListeners = globalListeners.filter((f) => f !== fn);
// }
// function clearGlobalListeners() {
//   globalListeners = [];
// }

const renderPagination = () => {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.dataset.page = i;
    btn.className =
      "px-1 md:px-3 py-1 rounded-lg border " +
      (i === currentPage
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100");

    btn.addEventListener("click", (e) => {
      renderAllOperations({ page: Number(e.target.dataset.page) });
    });

    pagination.appendChild(btn);
  }
};

const renderAllOperations = async ({ page = 1 } = {}) => {
  const [{ data: operations, pages }, categories] = await Promise.all([
    api.getOperations({
      page: page,
      limit: pageSize,
      filters,
      sort: sortState,
    }),
    api.getAllCategories(),
  ]);

  totalPages = pages;
  nextPageBtn.dataset.page = page + 1;

  const container = document.getElementById("operations-container");
  container.innerHTML = "";
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
    id: operationIdInput.value,
    amount: Number(amountInput.value),
    date: new Date(dateInput.value || undefined).toLocaleDateString("sv-SE"),
    category: parseInt(categorySelect.value),
    type: typeSelect.value,
    description: descriptionInput.value.trim(),
  };

  if (!operation.amount || !operation.category || !operation.type) {
    alert("Заполните все поля");
    return;
  }

  if (operation.amount <= 0 || !/^[1-9]\d*(,[1-9]\d)?$/.test(operation.amount)) {
    alert("Неверная сумма");
    return;
  }

  if (operation.id) {
    await api.updateOperation(operation.id, operation);
    addBtn.textContent = "+ Добавить операцию";
  } else {
    await api.createOperation(operation);
  }

  resetForm();
  renderAllOperations();
});

pageSizeSelect.addEventListener("change", (e) => {
  pageSize = Number(e.target.value);
  renderAllOperations();
});

const nextPageBtn = document.getElementById("next-page");
nextPageBtn.addEventListener("click", (e) => {
  renderAllOperations({ page: Number(e.target.dataset.page) });
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
sortAmountBtn.addEventListener("click", () => handleSort("amount", sortAmountBtn));

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

main();
