class Api {
  #baseURL = "http://localhost:3000";
  #categoriesCache = null;

  async #fetch(path, options) {
    return await (await fetch(this.#baseURL + path, options)).json();
  }

  getAllCategories = async () => {
    if (!this.#categoriesCache) {
      this.#categoriesCache = await this.#fetch("/categories");
    }
    return this.#categoriesCache;
  };

  createOperation = (operation) => {
    this.#categoriesCache = null; // TODO: should we ALWAYS clear the cache?
    return this.#fetch("/operations", { method: "POST", body: JSON.stringify(operation) });
  };

  deleteOperation = (id) => this.#fetch(`/operations/${id}`, { method: "DELETE" });

  updateOperation = (id, updates) =>
    this.#fetch(`/operations/${id}`, { method: "PATCH", body: JSON.stringify(updates) });

  async getOperations(params = {}) {
    const { page = 1, limit = 10, filters, sort } = params;
    const query = new URLSearchParams({ _page: page, _per_page: limit, ...filters });

    if (sort.field) {
      query.set("_sort", sort.direction === "desc" ? `-${sort.field}` : sort.field);
    }

    const result = await this.#fetch(`/operations?${query.toString()}`);
    return { ...result, currentPage: page };
  }
}
