import { type CatalogSort } from "./catalog.ts";

export interface CatalogState {
  query: string;
  category: string;
  sort: CatalogSort;
  page: number;
}

export const DEFAULT_CATALOG_STATE: CatalogState = {
  query: "",
  category: "All",
  sort: "recommended",
  page: 1,
};

const catalogSorts = new Set<CatalogSort>(["recommended", "az", "shortest", "longest", "level"]);

export function parseCatalogState(searchParams: URLSearchParams): CatalogState {
  const rawSort = searchParams.get("sort") ?? DEFAULT_CATALOG_STATE.sort;
  const rawPage = Number(searchParams.get("page") ?? DEFAULT_CATALOG_STATE.page);

  return {
    query: searchParams.get("q")?.trim() ?? "",
    category: searchParams.get("category")?.trim() || DEFAULT_CATALOG_STATE.category,
    sort: catalogSorts.has(rawSort as CatalogSort) ? rawSort as CatalogSort : DEFAULT_CATALOG_STATE.sort,
    page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : DEFAULT_CATALOG_STATE.page,
  };
}

export function toCatalogSearchParams(state: CatalogState): URLSearchParams {
  const params = new URLSearchParams();
  const query = state.query.trim();
  const category = state.category.trim();

  if (query) params.set("q", query);
  if (category && category !== DEFAULT_CATALOG_STATE.category) params.set("category", category);
  if (state.sort !== DEFAULT_CATALOG_STATE.sort) params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(Math.floor(state.page)));

  return params;
}
