import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_CATALOG_STATE, parseCatalogState, toCatalogSearchParams } from "../src/lib/catalog-state.ts";

test("catalog URL state parses supported values and normalizes invalid input", () => {
  assert.deepEqual(
    parseCatalogState(new URLSearchParams("q=git&category=Tooling&sort=az&page=3")),
    { query: "git", category: "Tooling", sort: "az", page: 3 },
  );
  assert.deepEqual(
    parseCatalogState(new URLSearchParams("sort=unknown&page=-2")),
    DEFAULT_CATALOG_STATE,
  );
  assert.equal(parseCatalogState(new URLSearchParams("page=2.5")).page, 1);
});

test("catalog URL serialization omits defaults and empty values", () => {
  assert.equal(toCatalogSearchParams(DEFAULT_CATALOG_STATE).toString(), "");
  assert.equal(
    toCatalogSearchParams({ query: "api", category: "Architecture", sort: "shortest", page: 2 }).toString(),
    "q=api&category=Architecture&sort=shortest&page=2",
  );
});
